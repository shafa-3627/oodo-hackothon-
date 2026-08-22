import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../member-2/src/context/AuthContext';
import { useHR } from '../../../member-2/src/context/HRContext';

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function fmt(d: Date) {
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
}

function StatusBadge({ s }: { s?: string }) {
  if (!s) return <span className="text-gray-300 text-xs">—</span>;
  const map: Record<string, string> = {
    Present:   'bg-green-100 text-green-700',
    Absent:    'bg-yellow-100 text-yellow-700',
    'Half-day':'bg-orange-100 text-orange-700',
    Leave:     'bg-blue-100 text-blue-700',
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[s] || 'bg-gray-100 text-gray-600'}`}>{s}</span>;
}

export default function Attendance() {
  const { currentUser } = useAuth();
  const { employees, attendance, checkIn, checkOut } = useHR();
  const isAdmin = currentUser?.role === 'admin';

  const today  = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const [viewDate, setViewDate] = useState(today);
  const [viewMode, setViewMode] = useState<'Day' | 'Week'>('Day');
  const [selEmp, setSelEmp] = useState<string>(
    isAdmin
      ? (employees.find((e) => e.id !== currentUser?.id)?.id || '')
      : (currentUser?.id || '')
  );

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Build weekday list for month
  const monthDays: string[] = [];
  for (let d = 1; d <= new Date(year, month+1, 0).getDate(); d++) {
    const dt = new Date(year, month, d);
    if (dt.getDay() !== 0 && dt.getDay() !== 6) monthDays.push(dt.toISOString().split('T')[0]);
  }

  const targetId  = isAdmin ? selEmp : (currentUser?.id || '');
  const targetEmp = employees.find((e) => e.id === targetId);
  const myEmp     = employees.find((e) => e.id === currentUser?.id);
  const todayRec  = attendance.find((a) => a.employeeId === currentUser?.id && a.date === todayStr);

  const monthRecs = attendance.filter(
    (a) => a.employeeId === targetId &&
           a.date.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)
  );

  const daysPresent   = monthRecs.filter((a) => a.status === 'Present').length;
  const leavesCount   = monthRecs.filter((a) => a.status === 'Leave').length;
  const totalWorkDays = monthDays.length;

  // Admin today's snapshot
  const todayAll = isAdmin
    ? employees.filter((e) => e.id !== currentUser?.id).map((emp) => ({
        emp,
        rec: attendance.find((a) => a.employeeId === emp.id && a.date === todayStr),
      }))
    : [];

  const prev = () => setViewDate(new Date(year, month - 1, 1));
  const next = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div className="p-4 max-w-5xl mx-auto">

      {/* ── Toolbar: arrows + month dropdown + Day/Week toggle ── */}
      <div className="bg-white border border-gray-200 rounded mb-3 px-3 py-2 flex items-center gap-2 flex-wrap">
        <button onClick={prev} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={16} /></button>
        <button onClick={next} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={16} /></button>

        {/* Month dropdown */}
        <select
          className="border border-gray-300 rounded text-sm px-2 py-1 focus:outline-none"
          value={month}
          onChange={(e) => setViewDate(new Date(year, Number(e.target.value), 1))}
        >
          {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>

        {/* Day / Week toggle */}
        <div className="flex border border-gray-300 rounded overflow-hidden text-sm">
          {(['Day', 'Week'] as const).map((v) => (
            <button key={v} onClick={() => setViewMode(v)}
              className={`px-3 py-1 transition-colors ${viewMode === v ? 'bg-purple-600 text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
              {v}
            </button>
          ))}
        </div>

        {/* Employee selector (admin) */}
        {isAdmin && (
          <select
            className="ml-auto border border-gray-300 rounded text-sm px-2 py-1 focus:outline-none"
            value={selEmp}
            onChange={(e) => setSelEmp(e.target.value)}
          >
            {employees.filter((e) => e.id !== currentUser?.id).map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        )}

        {/* Employee stats (employee view) */}
        {!isAdmin && (
          <div className="ml-auto flex items-center gap-4 text-xs text-gray-600">
            <span>Count of days present: <strong className="text-purple-700">{daysPresent}</strong></span>
            <span>Leaves count: <strong className="text-red-500">{leavesCount}</strong></span>
            <span>Total working days: <strong>{totalWorkDays}</strong></span>
          </div>
        )}
      </div>

      {/* ── Month label ── */}
      <p className="text-sm font-semibold text-gray-700 mb-2 px-1">
        {MONTHS[month]} {year}
        {isAdmin && targetEmp && <span className="ml-2 text-gray-400 font-normal">— {targetEmp.name}</span>}
      </p>

      {/* ── Admin: today's all-employee table ── */}
      {isAdmin && (
        <div className="bg-white border border-gray-200 rounded mb-3 overflow-hidden">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500">
            Attendance — {today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="table-th">Emp</th>
                  <th className="table-th">Check In</th>
                  <th className="table-th">Check Out</th>
                  <th className="table-th">Work Hours</th>
                  <th className="table-th">Extra Hours</th>
                </tr>
              </thead>
              <tbody>
                {todayAll.map(({ emp, rec }) => (
                  <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${emp.onLeave ? 'bg-blue-400' : emp.checkedIn ? 'bg-green-500' : 'bg-yellow-400'}`} />
                        {emp.name}
                      </div>
                    </td>
                    <td className="table-td">{rec?.checkIn || '—'}</td>
                    <td className="table-td">{rec?.checkOut || '—'}</td>
                    <td className="table-td">{rec?.workHours != null ? `${rec.workHours}` : '—'}</td>
                    <td className="table-td">{rec?.extraHours != null ? `${rec.extraHours}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Main attendance table ── */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="table-th">Date</th>
                {isAdmin && <th className="table-th">Emp</th>}
                <th className="table-th">Check In</th>
                <th className="table-th">Check Out</th>
                <th className="table-th">Work Hours</th>
                <th className="table-th">Extra Hours</th>
                {!isAdmin && <th className="table-th">Status</th>}
              </tr>
            </thead>
            <tbody>
              {monthDays.map((dateStr) => {
                const rec     = monthRecs.find((a) => a.date === dateStr);
                const d       = new Date(dateStr + 'T00:00:00');
                const isToday = dateStr === todayStr;
                return (
                  <tr key={dateStr}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${isToday ? 'bg-purple-50' : ''}`}>
                    <td className="table-td font-medium whitespace-nowrap">
                      {fmt(d)}
                      {isToday && <span className="ml-1 text-xs text-purple-500">(Today)</span>}
                    </td>
                    {isAdmin && (
                      <td className="table-td">{targetEmp?.name}</td>
                    )}
                    <td className="table-td">{rec?.checkIn || '—'}</td>
                    <td className="table-td">{rec?.checkOut || '—'}</td>
                    <td className="table-td">{rec?.workHours != null ? `${rec.workHours}` : '—'}</td>
                    <td className="table-td">{rec?.extraHours != null ? `${rec.extraHours}` : '—'}</td>
                    {!isAdmin && (
                      <td className="table-td">
                        <StatusBadge s={rec?.status || (dateStr > todayStr ? undefined : 'Absent')} />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
