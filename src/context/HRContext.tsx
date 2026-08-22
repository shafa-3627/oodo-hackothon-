import React, { createContext, useContext, useState } from 'react';
import type { Employee, AttendanceRecord, LeaveRequest, LeaveBalance, LeaveStatus } from '../types';
import { mockAttendance, mockLeaveRequests, mockLeaveBalances } from '../data/mockData';
import { getEmployeeStore } from './AuthContext';

interface HRContextType {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  refreshEmployees: () => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  checkIn: (employeeId: string) => void;
  checkOut: (employeeId: string) => void;
  applyLeave: (request: LeaveRequest) => void;
  updateLeaveStatus: (id: string, status: LeaveStatus, comment: string) => void;
}

const HRContext = createContext<HRContextType | null>(null);

export function HRProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees]         = useState<Employee[]>(() => getEmployeeStore());
  const [attendance, setAttendance]       = useState<AttendanceRecord[]>(mockAttendance);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>(mockLeaveBalances);

  const refreshEmployees = () => setEmployees([...getEmployeeStore()]);

  const updateEmployee = (id: string, updates: Partial<Employee>) =>
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));

  const checkIn = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const t = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    setAttendance((prev) => {
      const existing = prev.find((a) => a.employeeId === employeeId && a.date === today);
      if (existing) return prev.map((a) => a.id === existing.id ? { ...a, checkIn: t, status: 'Present' } : a);
      return [...prev, { id: `att${Date.now()}`, employeeId, date: today, checkIn: t, checkOut: null, status: 'Present', workHours: null, extraHours: null }];
    });
    setEmployees((prev) => prev.map((e) => e.id === employeeId ? { ...e, checkedIn: true } : e));
  };

  const checkOut = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const t = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    setAttendance((prev) => {
      const existing = prev.find((a) => a.employeeId === employeeId && a.date === today);
      if (!existing?.checkIn) return prev;
      const [ih, im] = existing.checkIn.split(':').map(Number);
      const [oh, om] = t.split(':').map(Number);
      const totalMins = (oh * 60 + om) - (ih * 60 + im);
      const workMins  = Math.max(0, totalMins - 60);
      const workHours = Math.round((workMins / 60) * 10) / 10;
      const extraHours = Math.max(0, Math.round(((workMins - 480) / 60) * 10) / 10);
      return prev.map((a) =>
        a.id === existing.id
          ? { ...a, checkOut: t, workHours, extraHours, status: workHours >= 4.5 ? 'Present' : 'Half-day' }
          : a
      );
    });
    setEmployees((prev) => prev.map((e) => e.id === employeeId ? { ...e, checkedIn: false } : e));
  };

  const applyLeave = (request: LeaveRequest) =>
    setLeaveRequests((prev) => [...prev, request]);

  const updateLeaveStatus = (id: string, status: LeaveStatus, comment: string) => {
    setLeaveRequests((prev) => prev.map((lr) => {
      if (lr.id !== id) return lr;
      const updated = { ...lr, status, adminComment: comment };
      // When approved: mark employee as onLeave if dates include today
      if (status === 'Approved') {
        const today = new Date().toISOString().split('T')[0];
        const isOnLeave = lr.startDate <= today && today <= lr.endDate;
        if (isOnLeave) {
          setEmployees((emp) => emp.map((e) => e.id === lr.employeeId ? { ...e, onLeave: true } : e));
        }
        // Deduct from leave balance
        setLeaveBalances((bal) => bal.map((b) => {
          if (b.employeeId !== lr.employeeId) return b;
          const start = new Date(lr.startDate);
          const end   = new Date(lr.endDate);
          const days  = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
          if (lr.leaveType === 'Paid Time Off') return { ...b, paidTimeOff: Math.max(0, b.paidTimeOff - days) };
          if (lr.leaveType === 'Sick Leave')    return { ...b, sickLeave:   Math.max(0, b.sickLeave   - days) };
          if (lr.leaveType === 'Unpaid Leave')  return { ...b, unpaidLeave: Math.max(0, b.unpaidLeave - days) };
          return b;
        }));
      }
      // When rejected: if employee was marked onLeave from this request, revert
      if (status === 'Rejected') {
        setEmployees((emp) => emp.map((e) => e.id === lr.employeeId ? { ...e, onLeave: false } : e));
      }
      return updated;
    }));
  };

  return (
    <HRContext.Provider value={{
      employees, attendance, leaveRequests, leaveBalances,
      refreshEmployees, updateEmployee, checkIn, checkOut, applyLeave, updateLeaveStatus,
    }}>
      {children}
    </HRContext.Provider>
  );
}

export function useHR() {
  const ctx = useContext(HRContext);
  if (!ctx) throw new Error('useHR must be used within HRProvider');
  return ctx;
}
