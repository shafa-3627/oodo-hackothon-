import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, Role } from '../../../member-3/src/types';
import { mockUsers, mockEmployees, generateLoginId, buildSalaryForWage } from '../data/mockData';
import type { Employee } from '../../../member-3/src/types';

interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  signIn: (loginOrEmail: string, password: string) => { success: boolean; error?: string };
  signUp: (data: SignUpData) => { success: boolean; error?: string; loginId?: string };
  signOut: () => void;
  updatePassword: (userId: string, newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Shared mutable stores — live for the whole session
let userStore: User[] = [...mockUsers];
let employeeStore: Employee[] = [...mockEmployees];

// Expose so HRContext can read the same store
export function getUserStore() { return userStore; }
export function getEmployeeStore() { return employeeStore; }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('dayflow_user');
    return stored ? JSON.parse(stored) : null;
  });

  const signIn = useCallback((loginOrEmail: string, password: string) => {
    const user = userStore.find(
      (u) =>
        (u.email.toLowerCase() === loginOrEmail.toLowerCase() ||
          u.loginId.toLowerCase() === loginOrEmail.toLowerCase()) &&
        u.password === password
    );
    if (!user) return { success: false, error: 'Invalid Login ID / Email or password.' };
    setCurrentUser(user);
    sessionStorage.setItem('dayflow_user', JSON.stringify(user));
    return { success: true };
  }, []);

  const signUp = useCallback((data: SignUpData) => {
    // Check duplicate email
    if (userStore.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // Generate serial: count existing users who joined this year
    const joinYear = new Date().getFullYear();
    const sameYearCount = userStore.filter((u) => u.joinYear === joinYear).length;
    const serial = sameYearCount + 1;
    const loginId = generateLoginId(data.name, joinYear, serial);
    const newId = `u${Date.now()}`;
    const empId = `EMP${String(userStore.length + 1).padStart(3, '0')}`;

    // Create user record
    const newUser: User = {
      id: newId,
      loginId,
      employeeId: empId,
      email: data.email,
      password: data.password,
      role: data.role,
      name: data.name,
      isVerified: true,
      joinYear,
    };
    userStore = [...userStore, newUser];

    // Create matching employee record
    const newEmployee: Employee = {
      id: newId,
      loginId,
      employeeId: empId,
      name: data.name,
      email: data.email,
      personalEmail: '',
      phone: data.phone,
      address: '',
      profilePicture: '',
      department: data.role === 'admin' ? 'Human Resources' : '',
      designation: data.role === 'admin' ? 'HR Officer' : '',
      jobPosition: '',
      manager: '',
      company: 'Dayflow Inc.',
      location: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      maritalStatus: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      checkedIn: false,
      onLeave: false,
      about: '',
      whatILove: '',
      interests: '',
      skills: [],
      certifications: [],
      bankAccountNumber: '',
      bankName: '',
      ifscCode: '',
      panNo: '',
      uanNo: '',
      empCode: empId,
      salary: buildSalaryForWage(30000),
    };
    employeeStore = [...employeeStore, newEmployee];

    return { success: true, loginId };
  }, []);

  const signOut = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem('dayflow_user');
  }, []);

  const updatePassword = useCallback((userId: string, newPassword: string) => {
    userStore = userStore.map((u) =>
      u.id === userId ? { ...u, password: newPassword } : u
    );
    const updated = userStore.find((u) => u.id === userId);
    if (updated) {
      setCurrentUser(updated);
      sessionStorage.setItem('dayflow_user', JSON.stringify(updated));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, signIn, signUp, signOut, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
