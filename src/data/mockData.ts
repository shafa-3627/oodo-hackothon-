import type { User, Employee, AttendanceRecord, LeaveRequest, LeaveBalance } from '../types';

// ─── Login ID Generator ────────────────────────────────────────────────────
export function generateLoginId(name: string, joinYear: number, serial: number): string {
  const parts = name.trim().split(' ');
  const first2First = (parts[0] || 'XX').substring(0, 2).toUpperCase();
  const first2Last = (parts[1] || 'XX').substring(0, 2).toUpperCase();
  const serialStr = String(serial).padStart(4, '0');
  return `OI${first2First}${first2Last}${joinYear}${serialStr}`;
}

// ─── Users ─────────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: 'u1',
    loginId: 'OISAJO20200001',
    employeeId: 'EMP001',
    email: 'admin@dayflow.com',
    password: 'Admin@123',
    role: 'admin',
    name: 'Sarah Johnson',
    isVerified: true,
    joinYear: 2020,
  },
  {
    id: 'u2',
    loginId: 'OIJOSM20210001',
    employeeId: 'EMP002',
    email: 'john@dayflow.com',
    password: 'Admin@123',
    role: 'employee',
    name: 'John Smith',
    isVerified: true,
    joinYear: 2021,
  },
  {
    id: 'u3',
    loginId: 'OIEMDA20210002',
    employeeId: 'EMP003',
    email: 'emily@dayflow.com',
    password: 'Admin@123',
    role: 'employee',
    name: 'Emily Davis',
    isVerified: true,
    joinYear: 2021,
  },
  {
    id: 'u4',
    loginId: 'OIMIBR20220001',
    employeeId: 'EMP004',
    email: 'mike@dayflow.com',
    password: 'Admin@123',
    role: 'employee',
    name: 'Michael Brown',
    isVerified: true,
    joinYear: 2022,
  },
  {
    id: 'u5',
    loginId: 'OIPAWI20220002',
    employeeId: 'EMP005',
    email: 'priya@dayflow.com',
    password: 'Admin@123',
    role: 'employee',
    name: 'Priya Wilson',
    isVerified: true,
    joinYear: 2022,
  },
  {
    id: 'u6',
    loginId: 'OIALCH20230001',
    employeeId: 'EMP006',
    email: 'alex@dayflow.com',
    password: 'Admin@123',
    role: 'employee',
    name: 'Alex Chen',
    isVerified: true,
    joinYear: 2023,
  },
];

// ─── Salary helpers ────────────────────────────────────────────────────────
export function buildSalaryForWage(monthWage: number) {
  return buildSalary(monthWage);
}

function buildSalary(monthWage: number) {
  const basic = monthWage * 0.50;
  const hra = basic * 0.50;
  const standardAllowance = 4167;
  const performanceBonus = monthWage * 0.0833;
  const lta = monthWage * 0.0833;
  const fixedAllowance = monthWage - basic - hra - standardAllowance - performanceBonus - lta;
  return {
    wageType: 'Fixed' as const,
    monthWage,
    yearlyWage: monthWage * 12,
    noOfWorkingDaysPerWeek: 5,
    breakTimeHrs: 1,
    components: [
      { name: 'Basic Salary',           computationType: 'percentage_of_wage' as const,  percentage: 50,    amount: basic },
      { name: 'House Rent Allowance',   computationType: 'percentage_of_basic' as const, percentage: 50,    amount: hra },
      { name: 'Standard Allowance',     computationType: 'fixed_amount' as const,         percentage: null,  amount: standardAllowance },
      { name: 'Performance Bonus',      computationType: 'percentage_of_wage' as const,  percentage: 8.33,  amount: performanceBonus },
      { name: 'Leave Travel Allowance', computationType: 'percentage_of_wage' as const,  percentage: 8.33,  amount: lta },
      { name: 'Fixed Allowance',        computationType: 'fixed_remainder' as const,      percentage: null,  amount: Math.max(0, fixedAllowance) },
    ],
  };
}

// ─── Employees ─────────────────────────────────────────────────────────────
export let mockEmployees: Employee[] = [
  {
    id: 'u1', loginId: 'OISAJO20200001', employeeId: 'EMP001',
    name: 'Sarah Johnson', email: 'admin@dayflow.com', personalEmail: 'sarah.j@gmail.com',
    phone: '+1 (555) 001-0001', address: '123 Admin Street, New York, NY 10001',
    profilePicture: '', department: 'Human Resources', designation: 'HR Manager',
    jobPosition: 'HR Manager', manager: 'CEO', company: 'Dayflow Inc.', location: 'New York',
    dateOfBirth: '1990-05-12', gender: 'Female', nationality: 'American', maritalStatus: 'Married',
    joinDate: '2020-01-15', status: 'active', checkedIn: true, onLeave: false,
    about: 'Passionate HR professional with 10+ years of experience.', whatILove: 'Building great teams and cultures.', interests: 'Reading, Hiking, Travel.',
    skills: ['Recruitment', 'Payroll', 'HR Compliance'], certifications: ['SHRM-CP', 'PHR'],
    bankAccountNumber: '1234567890', bankName: 'Chase Bank', ifscCode: 'CHAS0001', panNo: 'ABCDE1234F', uanNo: '100123456789', empCode: 'SJ001',
    salary: buildSalary(80000),
  },
  {
    id: 'u2', loginId: 'OIJOSM20210001', employeeId: 'EMP002',
    name: 'John Smith', email: 'john@dayflow.com', personalEmail: 'john.smith@gmail.com',
    phone: '+1 (555) 002-0002', address: '456 Employee Ave, Brooklyn, NY 11201',
    profilePicture: '', department: 'Engineering', designation: 'Software Engineer',
    jobPosition: 'Senior Developer', manager: 'Sarah Johnson', company: 'Dayflow Inc.', location: 'Brooklyn',
    dateOfBirth: '1992-08-23', gender: 'Male', nationality: 'American', maritalStatus: 'Single',
    joinDate: '2021-03-01', status: 'active', checkedIn: true, onLeave: false,
    about: 'Full stack developer who loves clean code.', whatILove: 'Solving complex problems with elegant solutions.', interests: 'Gaming, Open Source, Coffee.',
    skills: ['React', 'Node.js', 'TypeScript'], certifications: ['AWS Certified'],
    bankAccountNumber: '9876543210', bankName: 'Bank of America', ifscCode: 'BOFA0002', panNo: 'FGHIJ5678K', uanNo: '100234567890', empCode: 'JS002',
    salary: buildSalary(50000),
  },
  {
    id: 'u3', loginId: 'OIEMDA20210002', employeeId: 'EMP003',
    name: 'Emily Davis', email: 'emily@dayflow.com', personalEmail: 'emily.d@gmail.com',
    phone: '+1 (555) 003-0003', address: '789 Oak Lane, Queens, NY 11354',
    profilePicture: '', department: 'Design', designation: 'UI/UX Designer',
    jobPosition: 'Lead Designer', manager: 'Sarah Johnson', company: 'Dayflow Inc.', location: 'Queens',
    dateOfBirth: '1994-03-17', gender: 'Female', nationality: 'American', maritalStatus: 'Single',
    joinDate: '2021-06-15', status: 'active', checkedIn: false, onLeave: true,
    about: 'Creative designer focused on user-centered design.', whatILove: 'Crafting beautiful and intuitive interfaces.', interests: 'Art, Photography, Yoga.',
    skills: ['Figma', 'Sketch', 'Adobe XD'], certifications: ['Google UX Design'],
    bankAccountNumber: '1122334455', bankName: 'Wells Fargo', ifscCode: 'WFAR0003', panNo: 'KLMNO9012P', uanNo: '100345678901', empCode: 'ED003',
    salary: buildSalary(45000),
  },
  {
    id: 'u4', loginId: 'OIMIBR20220001', employeeId: 'EMP004',
    name: 'Michael Brown', email: 'mike@dayflow.com', personalEmail: 'mike.b@gmail.com',
    phone: '+1 (555) 004-0004', address: '321 Pine Road, Bronx, NY 10451',
    profilePicture: '', department: 'Marketing', designation: 'Marketing Analyst',
    jobPosition: 'Marketing Analyst', manager: 'Sarah Johnson', company: 'Dayflow Inc.', location: 'Bronx',
    dateOfBirth: '1993-11-05', gender: 'Male', nationality: 'American', maritalStatus: 'Married',
    joinDate: '2022-01-10', status: 'active', checkedIn: false, onLeave: false,
    about: 'Data-driven marketer with passion for growth hacking.', whatILove: 'Turning data into actionable insights.', interests: 'Sports, Cooking, Travel.',
    skills: ['SEO', 'Google Analytics', 'Excel'], certifications: ['Google Analytics Certified'],
    bankAccountNumber: '5566778899', bankName: 'Citibank', ifscCode: 'CITI0004', panNo: 'QRSTU3456V', uanNo: '100456789012', empCode: 'MB004',
    salary: buildSalary(40000),
  },
  {
    id: 'u5', loginId: 'OIPAWI20220002', employeeId: 'EMP005',
    name: 'Priya Wilson', email: 'priya@dayflow.com', personalEmail: 'priya.w@gmail.com',
    phone: '+1 (555) 005-0005', address: '654 Maple Ave, Manhattan, NY 10002',
    profilePicture: '', department: 'Engineering', designation: 'Backend Engineer',
    jobPosition: 'Backend Engineer', manager: 'John Smith', company: 'Dayflow Inc.', location: 'Manhattan',
    dateOfBirth: '1995-07-22', gender: 'Female', nationality: 'Indian', maritalStatus: 'Single',
    joinDate: '2022-04-01', status: 'active', checkedIn: true, onLeave: false,
    about: 'Backend engineer specializing in scalable systems.', whatILove: 'Building robust APIs and microservices.', interests: 'Music, Dancing, Cooking.',
    skills: ['Python', 'Django', 'PostgreSQL'], certifications: ['AWS Solutions Architect'],
    bankAccountNumber: '6677889900', bankName: 'HDFC Bank', ifscCode: 'HDFC0005', panNo: 'VWXYZ7890A', uanNo: '100567890123', empCode: 'PW005',
    salary: buildSalary(48000),
  },
  {
    id: 'u6', loginId: 'OIALCH20230001', employeeId: 'EMP006',
    name: 'Alex Chen', email: 'alex@dayflow.com', personalEmail: 'alex.c@gmail.com',
    phone: '+1 (555) 006-0006', address: '987 Birch Blvd, Staten Island, NY 10301',
    profilePicture: '', department: 'Design', designation: 'Graphic Designer',
    jobPosition: 'Graphic Designer', manager: 'Emily Davis', company: 'Dayflow Inc.', location: 'Staten Island',
    dateOfBirth: '1997-02-14', gender: 'Male', nationality: 'Chinese-American', maritalStatus: 'Single',
    joinDate: '2023-02-20', status: 'active', checkedIn: true, onLeave: false,
    about: 'Visual storyteller with an eye for detail.', whatILove: 'Creating compelling brand identities.', interests: 'Skateboarding, Anime, 3D Modeling.',
    skills: ['Illustrator', 'Photoshop', 'After Effects'], certifications: [],
    bankAccountNumber: '7788990011', bankName: 'TD Bank', ifscCode: 'TDBA0006', panNo: 'BCDEF2345G', uanNo: '100678901234', empCode: 'AC006',
    salary: buildSalary(38000),
  },
];

// ─── Attendance ─────────────────────────────────────────────────────────────
const generateAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const empIds = ['u2', 'u3', 'u4', 'u5', 'u6'];
  let idCounter = 1;

  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const date = new Date(2026, 7, 22); // Aug 22 2026
    date.setDate(date.getDate() - dayOffset);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue;
    const dateStr = date.toISOString().split('T')[0];

    for (const empId of empIds) {
      const rand = Math.random();
      let status: AttendanceRecord['status'];
      let checkIn: string | null = null;
      let checkOut: string | null = null;
      let workHours: number | null = null;
      let extraHours: number | null = null;

      if (rand < 0.70) {
        status = 'Present';
        checkIn = '10:00';
        checkOut = '19:00';
        workHours = 9;
        extraHours = 1;
      } else if (rand < 0.80) {
        status = 'Absent';
      } else if (rand < 0.90) {
        status = 'Half-day';
        checkIn = '14:00';
        checkOut = '19:00';
        workHours = 5;
        extraHours = 0;
      } else {
        status = 'Leave';
      }

      records.push({ id: `att${idCounter++}`, employeeId: empId, date: dateStr, checkIn, checkOut, status, workHours, extraHours });
    }
  }
  return records;
};

export let mockAttendance: AttendanceRecord[] = generateAttendance();

// ─── Leave Requests ─────────────────────────────────────────────────────────
export let mockLeaveRequests: LeaveRequest[] = [
  { id: 'lr1', employeeId: 'u2', employeeName: 'John Smith',    leaveType: 'Sick Leave',     startDate: '2026-08-25', endDate: '2026-08-26', remarks: 'Not feeling well.', status: 'Pending',  appliedDate: '2026-08-22', adminComment: '' },
  { id: 'lr2', employeeId: 'u3', employeeName: 'Emily Davis',   leaveType: 'Paid Time Off',  startDate: '2026-09-01', endDate: '2026-09-05', remarks: 'Family vacation.', status: 'Approved', appliedDate: '2026-08-15', adminComment: 'Approved. Enjoy!' },
  { id: 'lr3', employeeId: 'u4', employeeName: 'Michael Brown', leaveType: 'Unpaid Leave',   startDate: '2026-08-28', endDate: '2026-08-28', remarks: 'Personal errand.', status: 'Rejected', appliedDate: '2026-08-20', adminComment: 'Critical deadline.' },
  { id: 'lr4', employeeId: 'u2', employeeName: 'John Smith',    leaveType: 'Paid Time Off',  startDate: '2026-09-10', endDate: '2026-09-12', remarks: 'Annual leave.',    status: 'Pending',  appliedDate: '2026-08-21', adminComment: '' },
  { id: 'lr5', employeeId: 'u5', employeeName: 'Priya Wilson',  leaveType: 'Sick Leave',     startDate: '2026-08-20', endDate: '2026-08-21', remarks: 'Fever.',          status: 'Approved', appliedDate: '2026-08-19', adminComment: 'Get well soon!' },
];

// ─── Leave Balances ─────────────────────────────────────────────────────────
export let mockLeaveBalances: LeaveBalance[] = [
  { employeeId: 'u2', paidTimeOff: 24, sickLeave: 7, unpaidLeave: 5 },
  { employeeId: 'u3', paidTimeOff: 18, sickLeave: 5, unpaidLeave: 5 },
  { employeeId: 'u4', paidTimeOff: 22, sickLeave: 7, unpaidLeave: 5 },
  { employeeId: 'u5', paidTimeOff: 20, sickLeave: 5, unpaidLeave: 5 },
  { employeeId: 'u6', paidTimeOff: 24, sickLeave: 7, unpaidLeave: 5 },
];
