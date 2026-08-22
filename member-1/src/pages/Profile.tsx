import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, Plus } from 'lucide-react';
import { useAuth } from '../../../member-2/src/context/AuthContext';
import { useHR } from '../../../member-2/src/context/HRContext';
import type { SalaryComponent } from '../../../member-3/src/types';

/* ── Security tab (self-contained) ───────────────────────────── */
function SecurityTab({ userId }: { userId: string }) {
  const { updatePassword, currentUser } = useAuth();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [msg, setMsg]   = useState<{ text: string; ok: boolean } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (form.next !== form.confirm) { setMsg({ text: 'New passwords do not match.', ok: false }); return; }
    if (form.next.length < 6)       { setMsg({ text: 'Password must be at least 6 characters.', ok: false }); return; }
    // For own profile only
    if (userId !== currentUser?.id)  { setMsg({ text: 'You can only change your own password.', ok: false }); return; }
    updatePassword(userId, form.next);
    setMsg({ text: 'Password updated successfully!', ok: true });
    setForm({ current: '', next: '', confirm: '' });
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-5 max-w-sm">
      <p className="text-sm font-semibold text-gray-700 mb-4">Change Password</p>
      {msg && (
        <div className={`text-xs px-3 py-2 rounded mb-4 ${msg.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Current Password</label>
          <input type="password" required className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-400"
            value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">New Password</label>
          <input type="password" required className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-400"
            value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Confirm New Password</label>
          <input type="password" required className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-400"
            value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        </div>
        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded w-full transition-colors">
          Update Password
        </button>
      </form>
    </div>
  );
}

/* ── Salary auto-calc ─────────────────────────────────────────── */
function recalc(wage: number): SalaryComponent[] {
  const basic  = wage * 0.50;
  const hra    = basic * 0.50;
  const std    = 4167;
  const pb     = wage * 0.0833;
  const lta    = wage * 0.0833;
  const fixed  = Math.max(0, wage - basic - hra - std - pb - lta);
  return [
    { name: 'Basic Salary',           computationType: 'percentage_of_wage',  percentage: 50,   amount: Math.round(basic) },
    { name: 'House Rent Allowance',   computationType: 'percentage_of_basic', percentage: 50,   amount: Math.round(hra) },
    { name: 'Standard Allowance',     computationType: 'fixed_amount',        percentage: null, amount: std },
    { name: 'Performance Bonus',      computationType: 'percentage_of_wage',  percentage: 8.33, amount: Math.round(pb) },
    { name: 'Leave Travel Allowance', computationType: 'percentage_of_wage',  percentage: 8.33, amount: Math.round(lta) },
    { name: 'Fixed Allowance',        computationType: 'fixed_remainder',     percentage: null, amount: Math.round(fixed) },
  ];
}

/* ── Field row helper ─────────────────────────────────────────── */
function Field({ label, value, editing, onChange }: {
  label: string; value: string; editing: boolean; onChange?: (v: string) => void;
}) {
  return (
    <div className="mb-3">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      {editing && onChange ? (
        <input
          className="w-full border-b border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-purple-500 bg-transparent py-0.5"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p className="text-sm text-gray-800 border-b border-gray-200 pb-0.5">{value || '—'}</p>
      )}
    </div>
  );
}

export default function Profile() {
  const { id } = useParams<{ id?: string }>();
  const { currentUser } = useAuth();
  const { employees, updateEmployee } = useHR();
  const navigate = useNavigate();

  const isAdmin = currentUser?.role === 'admin';
  const targetId = id || currentUser?.id || '';
  const employee = employees.find((e) => e.id === targetId);

  type Tab = 'resume' | 'private' | 'salary' | 'security';
  const [tab, setTab] = useState<Tab>('resume');
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const [form, setForm] = useState({
    name:             employee?.name || '',
    phone:            employee?.phone || '',
    address:          employee?.address || '',
    about:            employee?.about || '',
    whatILove:        employee?.whatILove || '',
    interests:        employee?.interests || '',
    personalEmail:    employee?.personalEmail || '',
    dateOfBirth:      employee?.dateOfBirth || '',
    gender:           employee?.gender || '',
    nationality:      employee?.nationality || '',
    maritalStatus:    employee?.maritalStatus || '',
    bankAccountNumber:employee?.bankAccountNumber || '',
    bankName:         employee?.bankName || '',
    ifscCode:         employee?.ifscCode || '',
    department:       employee?.department || '',
    designation:      employee?.designation || '',
    manager:          employee?.manager || '',
    joinDate:         employee?.joinDate || '',
  });

  const [wage, setWage]           = useState(employee?.salary.monthWage || 50000);
  const [workDays, setWorkDays]   = useState(employee?.salary.noOfWorkingDaysPerWeek || 5);
  const [breakHrs, setBreakHrs]   = useState(employee?.salary.breakTimeHrs || 1);
  const [components, setComponents] = useState<SalaryComponent[]>(
    employee?.salary.components || recalc(employee?.salary.monthWage || 50000)
  );

  if (!employee) return <div className="p-8 text-center text-gray-400">Employee not found.</div>;

  const handleWage = (w: number) => { setWage(w); setComponents(recalc(w)); };

  const handleSave = () => {
    const u: Record<string, unknown> = { ...form };
    if (isAdmin) {
      u.salary = { ...employee.salary, monthWage: wage, yearlyWage: wage * 12,
        noOfWorkingDaysPerWeek: workDays, breakTimeHrs: breakHrs, components };
    }
    updateEmployee(employee.id, u as never);
    setEditing(false);
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    updateEmployee(employee.id, { skills: [...employee.skills, newSkill.trim()] });
    setNewSkill('');
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'resume',   label: 'Resume'       },
    { id: 'private',  label: 'Private Info' },
    ...(isAdmin ? [{ id: 'salary' as Tab, label: 'Salary Info' }] : []),
    { id: 'security', label: 'Security'     },
  ];

  const pfAmt = Math.round((components[0]?.amount || 0) * 0.12);
  const netSalary = Math.round(
    components.reduce((s, c) => s + c.amount, 0) - 200 - pfAmt
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">

      {/* Back */}
      {id && id !== currentUser?.id && (
        <button onClick={() => navigate('/employees')}
          className="text-xs text-purple-600 hover:underline mb-3 flex items-center gap-1">
          ← Back to Employees
        </button>
      )}

      {/* ── Header card ── */}
      <div className="bg-white border border-gray-200 rounded mb-3">

        {/* Top row: title */}
        <div className="px-4 py-2 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">My Profile</p>
        </div>

        {/* Avatar + fields */}
        <div className="p-4 flex gap-5">

          {/* Avatar with edit pencil */}
          <div className="flex-shrink-0 relative">
            <div className="w-24 h-24 rounded-full bg-pink-200 border-2 border-gray-300 flex items-center justify-center text-gray-500 text-3xl overflow-hidden">
              👤
            </div>
            {editing && (
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow">
                <Pencil size={11} className="text-gray-500" />
              </button>
            )}
          </div>

          {/* Left column: Name / Login ID / Email / Mobile */}
          <div className="flex-1 min-w-0">
            {/* Name big */}
            {editing && isAdmin ? (
              <input
                className="text-xl font-bold text-gray-900 border-b border-purple-400 focus:outline-none w-full mb-2 bg-transparent"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-900 mb-2">{employee.name}</h2>
            )}
            <div className="space-y-1 text-xs text-gray-500">
              <p>Login ID &nbsp;<span className="font-mono text-gray-700">{employee.loginId}</span></p>
              <Field label="Email"  value={employee.email} editing={false} />
              <Field label="Mobile" value={form.phone} editing={editing}
                onChange={(v) => setForm({ ...form, phone: v })} />
            </div>
          </div>

          {/* Right column: Company / Department / Manager / Location */}
          <div className="w-48 flex-shrink-0 text-xs">
            <Field label="Company"    value={employee.company}    editing={false} />
            <Field label="Department" value={form.department} editing={editing && isAdmin}
              onChange={(v) => setForm({ ...form, department: v })} />
            <Field label="Manager"    value={form.manager}    editing={editing && isAdmin}
              onChange={(v) => setForm({ ...form, manager: v })} />
            <Field label="Location"   value={employee.location}   editing={false} />
          </div>

          {/* Edit / Save */}
          <div className="flex-shrink-0 flex flex-col gap-2 pt-1">
            {!editing ? (
              <button onClick={() => setEditing(true)}
                className="text-xs border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 flex items-center gap-1">
                <Pencil size={11} /> Edit
              </button>
            ) : (
              <>
                <button onClick={handleSave}
                  className="text-xs bg-green-500 text-white rounded px-3 py-1 hover:bg-green-600">Save</button>
                <button onClick={() => setEditing(false)}
                  className="text-xs border border-gray-300 rounded px-3 py-1 hover:bg-gray-50">Cancel</button>
              </>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-t border-gray-200">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t.id
                  ? 'border-purple-600 text-purple-700 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB: Resume ── */}
      {tab === 'resume' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left: About */}
          <div className="bg-white border border-gray-200 rounded p-4 space-y-4">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-sm font-semibold text-gray-700">About</p>
                {editing && <Pencil size={11} className="text-gray-400" />}
              </div>
              {editing
                ? <textarea className="w-full border border-gray-200 rounded p-2 text-sm resize-none" rows={4}
                    value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
                : <p className="text-xs text-gray-600 leading-relaxed">{employee.about || '—'}</p>
              }
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-sm font-semibold text-gray-700">What I love about my job</p>
                {editing && <Pencil size={11} className="text-gray-400" />}
              </div>
              {editing
                ? <textarea className="w-full border border-gray-200 rounded p-2 text-sm resize-none" rows={4}
                    value={form.whatILove} onChange={(e) => setForm({ ...form, whatILove: e.target.value })} />
                : <p className="text-xs text-gray-600 leading-relaxed">{employee.whatILove || '—'}</p>
              }
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-sm font-semibold text-gray-700">My interests and hobbies</p>
                {editing && <Pencil size={11} className="text-gray-400" />}
              </div>
              {editing
                ? <textarea className="w-full border border-gray-200 rounded p-2 text-sm resize-none" rows={4}
                    value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />
                : <p className="text-xs text-gray-600 leading-relaxed">{employee.interests || '—'}</p>
              }
            </div>
          </div>

          {/* Right: Skills + Certification */}
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Skills</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {employee.skills.map((s) => (
                  <span key={s} className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-xs">{s}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-dashed border-gray-200 pt-3">
                <input
                  className="flex-1 text-xs border-b border-gray-300 focus:outline-none focus:border-purple-400 py-0.5"
                  placeholder="Add skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                />
                <button onClick={addSkill}
                  className="text-xs text-purple-600 flex items-center gap-0.5 hover:underline">
                  <Plus size={12} /> Add Skills
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Certification</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {employee.certifications.map((c) => (
                  <span key={c} className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-xs">{c}</span>
                ))}
                {employee.certifications.length === 0 && (
                  <p className="text-xs text-gray-400">None added yet.</p>
                )}
              </div>
              <div className="border-t border-dashed border-gray-200 pt-3">
                <button className="text-xs text-purple-600 flex items-center gap-0.5 hover:underline">
                  <Plus size={12} /> Add Skills
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Private Info ── */}
      {tab === 'private' && (
        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="grid grid-cols-2 gap-x-12 gap-y-1">
            {/* Left column */}
            <div>
              <Field label="Date of Birth"    value={form.dateOfBirth}   editing={editing}
                onChange={(v) => setForm({ ...form, dateOfBirth: v })} />
              <Field label="Residing Address" value={form.address}       editing={editing}
                onChange={(v) => setForm({ ...form, address: v })} />
              <Field label="Nationality"      value={form.nationality}   editing={editing}
                onChange={(v) => setForm({ ...form, nationality: v })} />
              <Field label="Personal Email"   value={form.personalEmail} editing={editing}
                onChange={(v) => setForm({ ...form, personalEmail: v })} />
              <Field label="Gender"           value={form.gender}        editing={editing}
                onChange={(v) => setForm({ ...form, gender: v })} />
              <Field label="Marital Status"   value={form.maritalStatus} editing={editing}
                onChange={(v) => setForm({ ...form, maritalStatus: v })} />
              <Field label="Date of Joining"  value={employee.joinDate}  editing={false} />
            </div>
            {/* Right column: Bank Details */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Bank Details</p>
              <Field label="Account Number" value={form.bankAccountNumber} editing={editing}
                onChange={(v) => setForm({ ...form, bankAccountNumber: v })} />
              <Field label="Bank Name"      value={form.bankName}          editing={editing}
                onChange={(v) => setForm({ ...form, bankName: v })} />
              <Field label="IFSC Code"      value={form.ifscCode}          editing={editing}
                onChange={(v) => setForm({ ...form, ifscCode: v })} />
              <Field label="PAN No"         value={employee.panNo}         editing={false} />
              <Field label="UAN No"         value={employee.uanNo}         editing={false} />
              <Field label="Emp Code"       value={employee.empCode}       editing={false} />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Salary Info (Admin only) ── */}
      {tab === 'salary' && isAdmin && (
        <div className="bg-white border border-gray-200 rounded p-5 space-y-5">

          {/* Wage row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-28">Month Wage</span>
                {editing
                  ? <input type="number" className="border-b border-gray-300 text-sm focus:outline-none focus:border-purple-400 w-28"
                      value={wage} onChange={(e) => handleWage(Number(e.target.value))} />
                  : <span className="text-sm font-semibold">{wage.toLocaleString()}</span>
                }
                <span className="text-xs text-gray-400">/ Month</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-28">Yearly wage</span>
                <span className="text-sm font-semibold">{(wage * 12).toLocaleString()}</span>
                <span className="text-xs text-gray-400">/ Yearly</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-40">No of working days in a week:</span>
                {editing
                  ? <input type="number" className="border-b border-gray-300 text-sm focus:outline-none w-12"
                      value={workDays} onChange={(e) => setWorkDays(Number(e.target.value))} />
                  : <span className="text-sm font-semibold">{workDays}</span>
                }
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-40">Break Time:</span>
                {editing
                  ? <input type="number" className="border-b border-gray-300 text-sm focus:outline-none w-12"
                      value={breakHrs} onChange={(e) => setBreakHrs(Number(e.target.value))} />
                  : <span className="text-sm font-semibold">{breakHrs}</span>
                }
                <span className="text-xs text-gray-400">/hrs</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Salary Components */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Salary Components</p>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-gray-100">
                  {components.map((c) => (
                    <tr key={c.name}>
                      <td className="py-2 text-gray-700 font-medium w-44">{c.name}</td>
                      <td className="py-2 text-right text-gray-800">
                        {c.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 text-right text-gray-500 pl-2 w-16">₹ / month</td>
                      <td className="py-2 text-right text-purple-600 font-semibold pl-2 w-14">
                        {c.percentage !== null ? `${c.percentage} %` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Descriptions */}
              <div className="mt-3 space-y-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3">
                <p>Define Basic salary from company cost — computed based on monthly wage.</p>
                <p>HRA provided to employees — 50% of the basic salary.</p>
                <p>Standard allowance is a fixed amount provided as part of salary.</p>
                <p>Performance Bonus — variable amount, % of basic salary.</p>
                <p>LTA paid to cover travel expenses — % of basic salary.</p>
                <p>Fixed Allowance = wage − total of all other components.</p>
              </div>
            </div>

            {/* PF + Tax */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Provident Fund (PF) Contribution</p>
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2 text-gray-600">Employee</td>
                      <td className="py-2 text-right">{pfAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 text-right text-gray-400 pl-1">₹ / month</td>
                      <td className="py-2 text-right text-purple-600 font-semibold pl-2">12.00 %</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">Employer</td>
                      <td className="py-2 text-right">{pfAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 text-right text-gray-400 pl-1">₹ / month</td>
                      <td className="py-2 text-right text-purple-600 font-semibold pl-2">12.00 %</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-1">PF is calculated based on the basic salary.</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Tax Deductions</p>
                <table className="w-full text-xs">
                  <tbody>
                    <tr>
                      <td className="py-2 text-gray-600">Professional Tax</td>
                      <td className="py-2 text-right">200.00</td>
                      <td className="py-2 text-right text-gray-400 pl-1">₹ / month</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-1">Professional Tax deducted from Gross salary.</p>
              </div>

              {/* Net */}
              <div className="border-t-2 border-purple-200 pt-3 flex items-center justify-between bg-purple-50 px-3 py-2 rounded">
                <span className="text-sm font-bold text-purple-800">Net Monthly Salary</span>
                <span className="text-base font-bold text-purple-700">
                  ₹ {netSalary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            * Salary components auto-update when Monthly Wage changes.
          </p>
        </div>
      )}

      {tab === 'security' && (
        <SecurityTab userId={employee.id} />
      )}
    </div>
  );
}
