// HRMS Frontend State Engine and Local Database Simulation

const DEFAULT_EMPLOYEES = [
  {
    id: "OIOOAD20260001",
    name: "Odoo Admin",
    email: "admin@odooindia.com",
    phone: "+91 98765 43210",
    role: "Admin",
    password: "admin",
    joinDate: "2026-01-10",
    department: "Human Resources",
    position: "HR Director",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin",
    status: "present", // present, absent, leave
    // Private Info
    dob: "1988-05-15",
    address: "101, Prestige Heights, Bangalore, India",
    nationality: "Indian",
    personalEmail: "admin.personal@gmail.com",
    gender: "Male",
    maritalStatus: "Married",
    bankAccount: "123456789012",
    bankName: "State Bank of India",
    bankBic: "SBIN0004567",
    panNo: "ABCDE1234F",
    pfNo: "KN/BAN/1234567/789",
    esicNo: "31000123450001001",
    // Resume
    about: "Experienced HR leader with over 15 years in software company operations.",
    interests: "Reading, golf, traveling.",
    loveJob: "Empowering people to achieve their career goals and optimizing workspace dynamics.",
    skills: ["Talent Acquisition", "Conflict Resolution", "Strategic Payroll", "Odoo ERP"],
    certificates: ["SHRM-CP", "Certified Compensation Professional (CCP)"],
    // Salary Info
    wageType: "Fixed wage",
    monthlyWage: 120000,
    workingDaysWeek: 5,
    workingHoursDay: 8,
    pfRate: 12,
    ptax: 200
  },
  {
    id: "OIJADO20260002",
    name: "Jane Doe",
    email: "jane.doe@odooindia.com",
    phone: "+91 99887 76655",
    role: "Employee",
    password: "password123",
    joinDate: "2026-03-15",
    department: "Engineering",
    position: "Senior Frontend Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    status: "present",
    // Private Info
    dob: "1994-08-22",
    address: "Flat 402, Green Meadows, Tech Park Road, Bangalore",
    nationality: "Indian",
    personalEmail: "jane.doe94@gmail.com",
    gender: "Female",
    maritalStatus: "Single",
    bankAccount: "987654321098",
    bankName: "HDFC Bank",
    bankBic: "HDFC0000123",
    panNo: "WXYZR9876Q",
    pfNo: "KN/BAN/9876543/123",
    esicNo: "31000987650001002",
    // Resume
    about: "Passionate UI/UX developer specializing in responsive React applications and CSS architecture.",
    interests: "Sketching, playing violin, hiking.",
    loveJob: "Turning complex backend data schemas into beautiful, high-performance web applications.",
    skills: ["HTML5 / CSS3", "JavaScript (ES6+)", "React.js", "UI Design"],
    certificates: ["AWS Certified Cloud Practitioner", "Scrum Alliance CSM"],
    // Salary Info
    wageType: "Fixed wage",
    monthlyWage: 75000,
    workingDaysWeek: 5,
    workingHoursDay: 8,
    pfRate: 12,
    ptax: 200
  },
  {
    id: "OIJOSM20260003",
    name: "John Smith",
    email: "john.smith@odooindia.com",
    phone: "+91 91234 56789",
    role: "Employee",
    password: "password123",
    joinDate: "2026-05-01",
    department: "Marketing",
    position: "Digital Marketing Executive",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    status: "absent",
    // Private Info
    dob: "1997-12-05",
    address: "24/B, Lotus Lane, Koramangala, Bangalore",
    nationality: "Indian",
    personalEmail: "jsmith97@gmail.com",
    gender: "Male",
    maritalStatus: "Single",
    bankAccount: "112233445566",
    bankName: "ICICI Bank",
    bankBic: "ICIC0000999",
    panNo: "JKLMN5566G",
    pfNo: "KN/BAN/1122334/555",
    esicNo: "31000112230001003",
    // Resume
    about: "Creative marketer focused on performance marketing, SEO, and developer relations outreach.",
    interests: "Photography, gaming, cooking.",
    loveJob: "Seeing campaigns scale and connecting with global developer communities.",
    skills: ["SEO Optimization", "Google Analytics", "Copywriting", "Email Campaigns"],
    certificates: ["Google Analytics Certified", "HubSpot Content Marketing"],
    // Salary Info
    wageType: "Fixed wage",
    monthlyWage: 50000,
    workingDaysWeek: 5,
    workingHoursDay: 8,
    pfRate: 12,
    ptax: 200
  }
];

const DEFAULT_ATTENDANCES = [
  { id: 1, employeeId: "OIOOAD20260001", date: "2026-08-18", checkIn: "09:30", checkOut: "18:30", workHours: 9.0, extraHours: 1.0 },
  { id: 2, employeeId: "OIJADO20260002", date: "2026-08-18", checkIn: "10:00", checkOut: "19:00", workHours: 9.0, extraHours: 1.0 },
  { id: 3, employeeId: "OIJOSM20260003", date: "2026-08-18", checkIn: "09:45", checkOut: "17:45", workHours: 8.0, extraHours: 0.0 },
  
  { id: 4, employeeId: "OIOOAD20260001", date: "2026-08-19", checkIn: "09:20", checkOut: "18:20", workHours: 9.0, extraHours: 1.0 },
  { id: 5, employeeId: "OIJADO20260002", date: "2026-08-19", checkIn: "10:15", checkOut: "19:15", workHours: 9.0, extraHours: 1.0 },
  { id: 6, employeeId: "OIJOSM20260003", date: "2026-08-19", checkIn: "10:00", checkOut: "18:00", workHours: 8.0, extraHours: 0.0 },

  { id: 7, employeeId: "OIOOAD20260001", date: "2026-08-20", checkIn: "09:30", checkOut: "18:00", workHours: 8.5, extraHours: 0.5 },
  { id: 8, employeeId: "OIJADO20260002", date: "2026-08-20", checkIn: "09:55", checkOut: "19:00", workHours: 9.08, extraHours: 1.08 },
  { id: 9, employeeId: "OIJOSM20260003", date: "2026-08-20", checkIn: "10:00", checkOut: "18:30", workHours: 8.5, extraHours: 0.5 },

  { id: 10, employeeId: "OIOOAD20260001", date: "2026-08-21", checkIn: "09:40", checkOut: "18:40", workHours: 9.0, extraHours: 1.0 },
  { id: 11, employeeId: "OIJADO20260002", date: "2026-08-21", checkIn: "10:00", checkOut: "19:00", workHours: 9.0, extraHours: 1.0 }
  // John Smith was absent/on leave on 21st August
];

const DEFAULT_LEAVES = [
  { id: 1, employeeId: "OIJOSM20260003", employeeName: "John Smith", leaveType: "Sick Leave", startDate: "2026-08-21", endDate: "2026-08-21", days: 1, status: "approved", attachment: "medical_cert_0821.pdf" },
  { id: 2, employeeId: "OIJADO20260002", employeeName: "Jane Doe", leaveType: "Paid time off", startDate: "2026-09-02", endDate: "2026-09-05", days: 4, status: "pending", attachment: null }
];

// Initial State Setup in localStorage
function initDatabase() {
  if (!localStorage.getItem("hrms_employees")) {
    localStorage.setItem("hrms_employees", JSON.stringify(DEFAULT_EMPLOYEES));
  }
  if (!localStorage.getItem("hrms_attendances")) {
    localStorage.setItem("hrms_attendances", JSON.stringify(DEFAULT_ATTENDANCES));
  }
  if (!localStorage.getItem("hrms_leaves")) {
    localStorage.setItem("hrms_leaves", JSON.stringify(DEFAULT_LEAVES));
  }
  if (!localStorage.getItem("hrms_company_logo")) {
    localStorage.setItem("hrms_company_logo", "logo.svg");
  }
  if (!localStorage.getItem("hrms_company_name")) {
    localStorage.setItem("hrms_company_name", "Odoo India");
  }
}

initDatabase();

// State managers
let employees = JSON.parse(localStorage.getItem("hrms_employees"));
let attendances = JSON.parse(localStorage.getItem("hrms_attendances"));
let leaves = JSON.parse(localStorage.getItem("hrms_leaves"));
let currentUser = JSON.parse(sessionStorage.getItem("hrms_current_user")) || null;

// Clock tracking state
let clockTimerInterval = null;
let checkInTime = null;

// Helper to save state
function saveState() {
  localStorage.setItem("hrms_employees", JSON.stringify(employees));
  localStorage.setItem("hrms_attendances", JSON.stringify(attendances));
  localStorage.setItem("hrms_leaves", JSON.stringify(leaves));
}

// Generate unique ID
function generateEmployeeId(name, joinDateStr) {
  const companyName = localStorage.getItem("hrms_company_name") || "Odoo India";
  // Get first letters of each word in company name (e.g. Odoo India -> OI)
  const companyInitials = companyName
    .split(/\s+/)
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .substring(0, 3);

  // Get first two letters of first and last name
  const nameParts = name.trim().split(/\s+/);
  let nameCode = "XXXX";
  if (nameParts.length >= 2) {
    const first = nameParts[0].substring(0, 2).toUpperCase().padEnd(2, "X");
    const last = nameParts[nameParts.length - 1].substring(0, 2).toUpperCase().padEnd(2, "X");
    nameCode = first + last;
  } else if (nameParts.length === 1) {
    nameCode = nameParts[0].substring(0, 4).toUpperCase().padEnd(4, "X");
  }

  // Joining year
  const joinYear = joinDateStr ? new Date(joinDateStr).getFullYear() : new Date().getFullYear();

  // Serial count for that year
  const countForYear = employees.filter(emp => {
    const empYear = emp.joinDate ? new Date(emp.joinDate).getFullYear() : null;
    return empYear === joinYear;
  }).length;
  
  const serial = String(countForYear + 1).padStart(4, "0");
  return `${companyInitials}${nameCode}${joinYear}${serial}`;
}

// Calculate salary components based on monthly gross wage
function calculateSalaryComponents(wage) {
  const monthly = parseFloat(wage) || 0;
  const basic = monthly * 0.50; // 50.00% of wage
  const hra = basic * 0.50; // 50.00% of Basic
  const standard = basic * 0.1387; // 13.87% of Basic
  const bonus = basic * 0.0233; // 2.33% of Basic
  const lta = basic * 0.0233; // 2.33% of Basic
  
  // Royal Allowance is remainder
  const otherSum = basic + hra + standard + bonus + lta;
  const royal = Math.max(0, monthly - otherSum);

  // Provident Fund calculations (12% of Basic)
  const pf = basic * 0.12; 

  return {
    monthly: monthly,
    yearly: monthly * 12,
    basic: basic,
    hra: hra,
    standard: standard,
    bonus: bonus,
    lta: lta,
    royal: royal,
    pfEmployee: pf,
    pfEmployer: pf
  };
}

// System notifications/toast helper
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.className = `alert-toast ${type === "success" ? "success-toast" : "error-toast"} show`;
  setTimeout(() => {
    toast.className = "alert-toast";
  }, 4000);
}

// Update presence indicators on cards based on leaves or checkout status
function updateEmployeeStatusIndicator() {
  const todayStr = new Date().toISOString().split("T")[0];
  
  employees.forEach(emp => {
    // Check if on approved leave today
    const onLeave = leaves.some(l => 
      l.employeeId === emp.id && 
      l.status === "approved" && 
      todayStr >= l.startDate && 
      todayStr <= l.endDate
    );

    if (onLeave) {
      emp.status = "leave";
    } else {
      // Check if they have checked in today
      const hasCheckedInToday = attendances.some(att => 
        att.employeeId === emp.id && 
        att.date === todayStr &&
        att.checkIn &&
        !att.checkOut
      );
      
      emp.status = hasCheckedInToday ? "present" : "absent";
    }
  });
  saveState();
}

// Check in user
function performCheckIn(employeeId) {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const timeStr = now.toTimeString().split(" ")[0].substring(0, 5); // HH:MM

  // Check if already checked in today
  const existing = attendances.find(att => att.employeeId === employeeId && att.date === todayStr && !att.checkOut);
  if (existing) {
    showToast("Already checked in today!", "error");
    return;
  }

  const newLog = {
    id: Date.now(),
    employeeId: employeeId,
    date: todayStr,
    checkIn: timeStr,
    checkOut: null,
    workHours: null,
    extraHours: null
  };

  attendances.push(newLog);
  updateEmployeeStatusIndicator();
  saveState();
  startClockTimer(now);
  showToast("Check-in recorded successfully!");
}

// Check out user
function performCheckOut(employeeId) {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const timeStr = now.toTimeString().split(" ")[0].substring(0, 5); // HH:MM

  const log = attendances.find(att => att.employeeId === employeeId && att.date === todayStr && !att.checkOut);
  if (!log) {
    // Look for latest open check in
    const lastOpenLog = [...attendances].reverse().find(att => att.employeeId === employeeId && !att.checkOut);
    if (!lastOpenLog) {
      showToast("No active check-in record found!", "error");
      return;
    }
    log = lastOpenLog;
  }

  log.checkOut = timeStr;
  
  // Calculate hours
  const [inH, inM] = log.checkIn.split(":").map(Number);
  const [outH, outM] = timeStr.split(":").map(Number);
  let minutes = (outH * 60 + outM) - (inH * 60 + inM);
  if (minutes < 0) minutes += 24 * 60; // Handle overnight shift
  
  const hours = parseFloat((minutes / 60).toFixed(2));
  log.workHours = hours;
  log.extraHours = Math.max(0, parseFloat((hours - 8.0).toFixed(2)));

  updateEmployeeStatusIndicator();
  saveState();
  stopClockTimer();
  showToast("Check-out recorded successfully!");
}

// Running clock UI update
function startClockTimer(sinceTime) {
  const clockContainer = document.getElementById("clock-timer-wrapper");
  const checkinBtn = document.getElementById("header-checkin-btn");
  const checkoutBtn = document.getElementById("header-checkout-btn");
  const statusDot = document.getElementById("header-status-dot");
  
  checkinBtn.style.display = "none";
  checkoutBtn.style.display = "block";
  statusDot.classList.add("active", "pulsing");
  clockContainer.style.display = "block";

  checkInTime = sinceTime || new Date();

  clearInterval(clockTimerInterval);
  clockTimerInterval = setInterval(() => {
    const duration = new Date() - checkInTime;
    const hrs = String(Math.floor(duration / 3600000)).padStart(2, "0");
    const mins = String(Math.floor((duration % 3600000) / 60000)).padStart(2, "0");
    const secs = String(Math.floor((duration % 60000) / 1000)).padStart(2, "0");
    document.getElementById("clock-timer-digits").innerText = `${hrs}:${mins}:${secs}`;
  }, 1000);
}

function stopClockTimer() {
  const clockContainer = document.getElementById("clock-timer-wrapper");
  const checkinBtn = document.getElementById("header-checkin-btn");
  const checkoutBtn = document.getElementById("header-checkout-btn");
  const statusDot = document.getElementById("header-status-dot");

  clearInterval(clockTimerInterval);
  clockTimerInterval = null;

  checkinBtn.style.display = "block";
  checkoutBtn.style.display = "none";
  statusDot.classList.remove("active", "pulsing");
  clockContainer.style.display = "none";
}

// Check initial status on load
function checkActiveClock() {
  if (!currentUser) return;
  const todayStr = new Date().toISOString().split("T")[0];
  const activeLog = attendances.find(att => att.employeeId === currentUser.id && att.date === todayStr && !att.checkOut);
  
  if (activeLog) {
    // Calculate start time
    const [h, m] = activeLog.checkIn.split(":").map(Number);
    const start = new Date();
    start.setHours(h, m, 0, 0);
    startClockTimer(start);
  } else {
    stopClockTimer();
  }
}
