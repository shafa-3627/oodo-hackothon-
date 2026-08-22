export type Role = 'admin' | 'employee';

export interface User {
  id: string;
  loginId: string;       // auto-generated: OI+initials+year+serial e.g. OIJOSM20220001
  employeeId: string;
  email: string;
  password: string;
  role: Role;
  name: string;
  isVerified: boolean;
  joinYear: number;
}

export interface Employee {
  id: string;
  loginId: string;
  employeeId: string;
  name: string;
  email: string;
  personalEmail: string;
  phone: string;
  address: string;
  profilePicture: string;
  department: string;
  designation: string;        // job position
  jobPosition: string;
  manager: string;
  company: string;
  location: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  joinDate: string;
  status: 'active' | 'inactive';
  checkedIn: boolean;
  onLeave: boolean;
  // About section
  about: string;
  whatILove: string;
  interests: string;
  // Skills & certs
  skills: string[];
  certifications: string[];
  // Bank
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  panNo: string;
  uanNo: string;
  empCode: string;
  // Salary
  salary: SalaryInfo;
}

export interface SalaryInfo {
  wageType: 'Fixed';
  monthWage: number;
  yearlyWage: number;
  noOfWorkingDaysPerWeek: number;
  breakTimeHrs: number;
  components: SalaryComponent[];
}

export interface SalaryComponent {
  name: string;
  computationType: 'percentage_of_wage' | 'percentage_of_basic' | 'fixed_amount' | 'fixed_remainder';
  percentage: number | null;
  amount: number;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Half-day' | 'Leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  workHours: number | null;
  extraHours: number | null;
}

export type LeaveType = 'Paid Time Off' | 'Sick Leave' | 'Unpaid Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  remarks: string;
  status: LeaveStatus;
  appliedDate: string;
  adminComment: string;
  attachment?: string;
}

export interface LeaveBalance {
  employeeId: string;
  paidTimeOff: number;
  sickLeave: number;
  unpaidLeave: number;
}
