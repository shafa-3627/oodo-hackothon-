import React, { useState } from 'react';
import { X, Paperclip } from 'lucide-react';
import { useAuth } from '../../../member-2/src/context/AuthContext';
import { useHR } from '../../../member-2/src/context/HRContext';
import type { LeaveType, LeaveRequest } from '../../../member-3/src/types';

/* ─── tiny helpers ──────────────────────────────────────────── */
function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    Pending:  'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100  text-green-800',
    Rejected: 'bg-red-100    text-red-700',
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[s] || 'bg-gray-100 text-gray-600'}`}>{s}</span>;
}

function TypeBadge({ t }: { t: string }) {
  const map: Record<string, string> = {
    'Paid Time Off': 'bg-green-100 text-green-700',
    'Sick Leave':    'bg-red-100   text-red-700',
    'Unpaid Leave':  'bg-gray-100  text-gray-600',
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[t] || 'bg-gray-100 text-gray-600'}`}>{t}</span>;
}

export default function TimeOff() {
  const { currentUser } = useAuth();
  const { leaveRequests, leaveBalances, applyLeave, updateLeaveStatus } = useHR();
  const isAdmin = currentUser?.role === 'admin';

  const [search,        setSearch]        = useState('');
  const [showModal,     setShowModal]     = useState(false);
  const [reviewItem,    setReviewItem]    = useState<LeaveRequest | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  const [form, setForm] = useState({
    leaveType: 'Paid Time Off' as LeaveType,
    validFrom: '', validTo: '',
    allocation: '1',
    note: '',
    attachment: '',
  });

  const myBalance = leaveBalances.find((b) => b.employeeId === currentUser?.id);

  const rows = (isAdmin
    ? leaveRequests
    : leaveRequests.filter((lr) => lr.employeeId === currentUser?.id)
  ).filter(
    (l) =>
      l.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      l.leaveType.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyLeave({
      id: `lr${Date.now()}`,
      employeeId:   currentUser!.id,
      employeeName: currentUser!.name,
      leaveType:    form.leaveType,
      startDate:    form.validFrom,
      endDate:      form.validTo,
      remarks:      form.note,
      status:       'Pending',
      appliedDate:  new Date().toISOString().split('T')[0],
      adminComment: '',
      attachment:   form.attachment,
    });
    setShowModal(false);
    setForm({ leaveType: 'Paid Time Off', validFrom: '', validTo: '', allocation: '1', note: '', attachment: '' });
  };

  const doReview = (action: 'Approved' | 'Rejected') => {
    if (!reviewItem) return;
    updateLeaveStatus(reviewItem.id, action, reviewComment);
    setReviewItem(null);
    setReviewComment('');
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">

      {/* ── Employee: balance cards ── */}
      {!isAdmin && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Paid Time Off',  days: myBalance?.paidTimeOff ?? 24, color: 'border-green-300' },
            { label: 'Sick time off',  days: myBalance?.sickLeave   ?? 7,  color: 'border-red-300'   },
          ].map((c) => (
            <div key={c.label} className={`bg-white border ${c.color} rounded p-4`}>
              <p className="text-xs font-semibold text-gray-600 mb-1">{c.label}</p>
              <p className="text-2xl font-bold text-gray-900">{c.days}</p>
              <p className="text-xs text-gray-400 mt-0.5">Days Available</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {/* Tabs: Time Off | Allocation */}
        <div className="flex border border-gray-300 rounded overflow-hidden text-sm">
          {['Time Off', 'Allocation'].map((t) => (
            <button key={t}
              className="px-4 py-1.5 text-sm font-medium bg-white hover:bg-gray-50 text-gray-600 first:border-r border-gray-300">
              {t}
            </button>
          ))}
        </div>

        <button onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-1.5 rounded transition-colors">
          NEW
        </button>

        <input
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-400 w-48"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── List table ── */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="table-th">Name</th>
                <th className="table-th">Start Date</th>
                <th className="table-th">End Date</th>
                <th className="table-th">Time Off Type</th>
                <th className="table-th">Status</th>
                {isAdmin && <th className="table-th">Action</th>}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="table-td text-center text-gray-400 py-10">
                    No records found
                  </td>
                </tr>
              ) : rows.map((lr) => (
                <tr key={lr.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="table-td font-medium">{lr.employeeName}</td>
                  <td className="table-td">{lr.startDate}</td>
                  <td className="table-td">{lr.endDate}</td>
                  <td className="table-td"><TypeBadge t={lr.leaveType} /></td>
                  <td className="table-td"><StatusBadge s={lr.status} /></td>
                  {isAdmin && (
                    <td className="table-td">
                      {lr.status === 'Pending' ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setReviewItem(lr); setReviewComment(''); }}
                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-0.5 rounded">
                            Approve
                          </button>
                          <button
                            onClick={() => { updateLeaveStatus(lr.id, 'Rejected', ''); }}
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded">
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">{lr.adminComment || '—'}</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── NEW Time Off Request Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Time off Type Request</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-0">

              {/* Row helper — label left, control right */}
              {/* Employee */}
              <div className="flex items-center py-2.5 border-b border-gray-100">
                <span className="text-sm text-gray-600 w-32 flex-shrink-0">Employee</span>
                <span className="text-sm text-gray-900 font-medium">{currentUser?.name}</span>
              </div>

              {/* Time off Type */}
              <div className="flex items-center py-2.5 border-b border-gray-100">
                <span className="text-sm text-gray-600 w-32 flex-shrink-0">Time off Type</span>
                <select
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-purple-500"
                  value={form.leaveType}
                  onChange={(e) => setForm({ ...form, leaveType: e.target.value as LeaveType })}
                >
                  <option value="Paid Time Off">Paid Time Off</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              {/* Validity Period */}
              <div className="flex items-center py-2.5 border-b border-gray-100">
                <span className="text-sm text-gray-600 w-32 flex-shrink-0">Validity Period</span>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="date"
                    required
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-purple-500"
                    value={form.validFrom}
                    onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                  />
                  <span className="text-xs text-gray-400 flex-shrink-0">To</span>
                  <input
                    type="date"
                    required
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-purple-500"
                    value={form.validTo}
                    min={form.validFrom}
                    onChange={(e) => setForm({ ...form, validTo: e.target.value })}
                  />
                </div>
              </div>

              {/* Allocation */}
              <div className="flex items-center py-2.5 border-b border-gray-100">
                <span className="text-sm text-gray-600 w-32 flex-shrink-0">Allocation</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-purple-500"
                    value={form.allocation}
                    onChange={(e) => setForm({ ...form, allocation: e.target.value })}
                  />
                  <span className="text-sm text-gray-400">Days</span>
                </div>
              </div>

              {/* Note */}
              <div className="flex items-start py-2.5 border-b border-gray-100">
                <span className="text-sm text-gray-600 w-32 flex-shrink-0 pt-1">Note</span>
                <textarea
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-purple-500"
                  rows={3}
                  placeholder="Reason for leave..."
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>

              {/* Attachment */}
              <div className="flex items-center py-2.5 border-b border-gray-100">
                <span className="text-sm text-gray-600 w-32 flex-shrink-0 flex items-center gap-1">
                  <Paperclip size={12} /> Attachment
                </span>
                <div className="flex-1 text-sm">
                  <label className="cursor-pointer text-purple-600 hover:underline text-sm">
                    Upload file (sick leave certificate)
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setForm({ ...form, attachment: e.target.files?.[0]?.name || '' })}
                    />
                  </label>
                  {form.attachment && (
                    <span className="ml-2 text-xs text-gray-500">{form.attachment}</span>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-6 py-2 rounded transition-colors"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border border-gray-300 text-gray-700 text-sm px-6 py-2 rounded hover:bg-gray-50 transition-colors"
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Admin Approve modal (with comment) ── */}
      {reviewItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Review Request</h3>
              <button onClick={() => setReviewItem(null)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-gray-50 rounded p-3 text-xs space-y-1.5">
                <div className="flex justify-between"><span className="text-gray-500">Employee</span><span className="font-semibold">{reviewItem.employeeName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Type</span><TypeBadge t={reviewItem.leaveType} /></div>
                <div className="flex justify-between"><span className="text-gray-500">Period</span><span className="font-semibold">{reviewItem.startDate} → {reviewItem.endDate}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Note</span><span className="font-semibold">{reviewItem.remarks || '—'}</span></div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Comment</label>
                <textarea className="w-full border border-gray-200 rounded p-2 text-sm resize-none focus:outline-none focus:border-purple-400" rows={2}
                  value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => doReview('Rejected')}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-1.5 rounded">Reject</button>
                <button onClick={() => doReview('Approved')}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-1.5 rounded">Approve</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
