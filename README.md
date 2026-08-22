# 🌐 Dayflow – Human Resource Management System

> **Every workday, perfectly aligned.**

Dayflow is a **Human Resource Management System (HRMS)** designed to digitize and streamline essential HR operations such as employee onboarding, employee profile management, attendance tracking, leave management, payroll visibility, and administrative approval workflows.

The system provides different levels of access for **Employees, HR Officers, and Administrators**, allowing each user to access only the functionality relevant to their role.

---

## 📌 Table of Contents

* [About the Project](#-about-the-project)
* [Problem Statement](#-problem-statement)
* [Objectives](#-objectives)
* [Scope](#-scope)
* [Key Features](#-key-features)
* [User Roles](#-user-roles)
* [System Architecture](#-system-architecture)
* [Project Workflow](#-project-workflow)
* [Modules](#-modules)
* [Database Design](#-database-design)
* [Database Relationships](#-database-relationships)
* [API Structure](#-api-structure)
* [API Endpoints](#-api-endpoints)
* [Project Structure](#-project-structure)
* [Technology Stack](#-technology-stack)
* [Installation](#-installation)
* [Environment Variables](#-environment-variables)
* [Running the Project](#-running-the-project)
* [Authentication Flow](#-authentication-flow)
* [Attendance Workflow](#-attendance-workflow)
* [Leave Workflow](#-leave-workflow)
* [Payroll Workflow](#-payroll-workflow)
* [Role-Based Access](#-role-based-access)
* [Testing](#-testing)
* [Future Enhancements](#-future-enhancements)
* [Project Development Plan](#-project-development-plan)
* [Contributors](#-contributors)
* [License](#-license)

---

# 📖 About the Project

**Dayflow HRMS** is a centralized platform for managing employee-related activities.

The system aims to replace fragmented/manual HR processes with a structured digital workflow covering:

* Employee onboarding
* Authentication
* Employee profiles
* Attendance
* Leave requests
* Leave approval
* Payroll visibility
* Employee management
* Notifications
* Reports and analytics

The project requirements define secure authentication, role-based access, employee profile management, attendance tracking, leave management, and HR/Admin approval workflows as the core scope.

---

# 🎯 Problem Statement

Traditional HR processes may involve multiple disconnected systems or manual operations for:

* Employee information
* Attendance
* Leave requests
* Approvals
* Salary information
* HR reports

This can result in:

* Data duplication
* Manual errors
* Delayed approvals
* Difficulty tracking attendance
* Limited visibility for employees
* Increased HR workload

Dayflow provides a centralized HRMS to manage these operations through a single application.

---

# 🎯 Objectives

The main objectives of Dayflow are:

1. Provide secure user authentication.
2. Implement role-based access control.
3. Manage employee profiles.
4. Track employee attendance.
5. Provide daily and weekly attendance views.
6. Allow employees to apply for leave.
7. Allow HR/Admin users to approve or reject leave.
8. Provide employee payroll visibility.
9. Allow Admin/HR to manage salary structures.
10. Provide notifications and activity information.
11. Provide analytics and reports.
12. Maintain structured employee-related data in a centralized database.

---

# 📋 Scope

The core system provides:

* Secure Sign Up / Sign In
* Employee and HR/Admin roles
* Employee profile management
* Attendance tracking
* Daily attendance view
* Weekly attendance view
* Check-in / Check-out
* Leave application
* Leave approval
* Leave rejection
* Payroll visibility
* Employee management
* Notifications
* Reports and analytics

These capabilities correspond to the functional scope defined in the project specification.

---

# ✨ Key Features

## 🔐 Authentication

* User registration
* Login
* Password protection
* Email verification
* JWT-based authentication
* Role-based authorization
* Logout

The specification requires registration using Employee ID, email, password and role, with email verification.

---

## 👤 Employee Management

Employees can:

* View personal information
* View job information
* View salary structure
* View documents
* View profile picture
* Update limited personal information

Admin users can manage employee information.

The required profile functionality includes personal details, job details, salary structure, documents and profile picture.

---

## 🕒 Attendance Management

Employees can:

* Check in
* Check out
* View attendance
* View daily attendance
* View weekly attendance

Attendance statuses:

```text
PRESENT
ABSENT
HALF_DAY
LEAVE
```

Admin/HR users can view attendance records for all employees.

The attendance requirements specify daily/weekly views, check-in/check-out and these four status types.

---

## 🏖️ Leave Management

Employees can:

* Select leave type
* Select start date
* Select end date
* Add remarks
* Submit leave request
* View leave status

Supported leave types:

```text
PAID
SICK
UNPAID
```

Leave statuses:

```text
PENDING
APPROVED
REJECTED
```

Admin/HR users can:

* View requests
* Approve requests
* Reject requests
* Add comments

These requirements are defined in the Leave & Time-Off section.

---

## 💰 Payroll Management

### Employee

Employees can view:

* Basic salary
* Allowances
* Deductions
* Net salary

Payroll information is read-only for employees.

### Admin / HR

Admin/HR can:

* View payroll
* Update salary structure
* Update allowances
* Update deductions
* Maintain payroll accuracy

The specification defines employee payroll as read-only and Admin payroll as editable.

---

# 👥 User Roles

## 👨‍💼 Admin / HR Officer

Admin/HR users have management and approval privileges.

They can:

```text
Employee Management
        ↓
Attendance Management
        ↓
Leave Approval
        ↓
Payroll Management
        ↓
Reports / Analytics
```

## 👨‍💻 Employee

Employees have limited access:

```text
Profile
   ↓
Attendance
   ↓
Leave
   ↓
Payroll
   ↓
Notifications
```

The project specification defines Admin/HR as management users and Employees as regular users with limited access.

---

# 🏗️ System Architecture

Recommended implementation architecture:

```text
┌─────────────────────────────┐
│        USER / BROWSER       │
│        React Frontend       │
└──────────────┬──────────────┘
               │
               │ HTTP / REST API
               ▼
┌─────────────────────────────┐
│       EXPRESS SERVER        │
│        Node.js Backend      │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│ Middleware  │  │ Controllers  │
│ JWT / Role  │  │ Business     │
│ Validation  │  │ Logic        │
└─────────────┘  └──────┬───────┘
                        │
                        ▼
               ┌─────────────────┐
               │    MySQL DB     │
               └─────────────────┘
```

> **Note:** React + Node.js/Express + MySQL is the recommended implementation stack for this project. The original requirements document defines the functionality but does not mandate a particular technology stack.

---

# 🔄 Project Workflow

```text
                    DAYFLOW HRMS
                         │
                         ▼
                ┌────────────────┐
                │ SIGN UP / LOGIN │
                └───────┬────────┘
                        ▼
                 ┌─────────────┐
                 │ AUTHENTICATE│
                 └──────┬──────┘
                        ▼
                   ┌─────────┐
                   │ROLE CHECK│
                   └────┬────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        ┌───────────┐       ┌────────────┐
        │ EMPLOYEE  │       │ ADMIN / HR │
        └─────┬─────┘       └──────┬─────┘
              │                    │
      ┌───────┼────────┐    ┌──────┼──────────┐
      ▼       ▼        ▼    ▼      ▼          ▼
   Profile Attendance Leave Employees Leave  Payroll
      │       │        │    │      │          │
      │       │        │    │      │          │
      └───────┴────────┘    └──────┴──────────┘
              │                    │
              └──────────┬─────────┘
                         ▼
                    MySQL Database
```

---

# 🧩 Main Modules

```text
1. Authentication
2. Role-Based Access Control
3. Employee Management
4. Employee Profile
5. Attendance
6. Leave Management
7. Leave Approval
8. Payroll
9. Notifications
10. Reports & Analytics
```

---

# 🗄️ Database Design

## Main Tables

```text
users
employees
attendance
leave_requests
payroll
documents
notifications
```

---

## `users`

```text
users
--------------------------------
id                PK
employee_id
email
password
role
email_verified
created_at
```

Roles:

```text
ADMIN
HR
EMPLOYEE
```

---

## `employees`

```text
employees
--------------------------------
id                PK
user_id           FK
first_name
last_name
phone
address
date_of_birth
department
designation
joining_date
salary
profile_picture
```

---

## `attendance`

```text
attendance
--------------------------------
id                PK
employee_id       FK
date
check_in
check_out
status
```

Status:

```text
PRESENT
ABSENT
HALF_DAY
LEAVE
```

---

## `leave_requests`

```text
leave_requests
--------------------------------
id                PK
employee_id       FK
leave_type
start_date
end_date
remarks
status
admin_comment
created_at
```

Leave types:

```text
PAID
SICK
UNPAID
```

Leave status:

```text
PENDING
APPROVED
REJECTED
```

---

## `payroll`

```text
payroll
--------------------------------
id                PK
employee_id       FK
basic_salary
allowances
deductions
net_salary
effective_date
```

---

# 🔗 Database Relationships

```text
                         USERS
                           │
                           │ 1 : 1
                           ▼
                       EMPLOYEES
                           │
             ┌─────────────┼──────────────┐
             │             │              │
            1:N           1:N            1:N
             │             │              │
             ▼             ▼              ▼
        ATTENDANCE   LEAVE_REQUESTS    PAYROLL
             │
             │
             ▼
       Attendance Status
```

Additional relationships:

```text
EMPLOYEES ───── 1:N ───── DOCUMENTS

USERS ────────── 1:N ───── NOTIFICATIONS
```

---

# 🔌 API Structure

## Authentication APIs

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
```

---

## Employee APIs

```http
GET    /api/employees
GET    /api/employees/:id
PUT    /api/employees/:id
```

---

## Attendance APIs

```http
POST /api/attendance/check-in
POST /api/attendance/check-out
GET  /api/attendance/my
GET  /api/attendance/all
```

---

## Leave APIs

```http
POST /api/leaves
GET  /api/leaves/my
GET  /api/leaves
PUT  /api/leaves/:id/approve
PUT  /api/leaves/:id/reject
```

---

## Payroll APIs

```http
GET /api/payroll/my
GET /api/payroll
PUT /api/payroll/:id
```

---

## Notification APIs

```http
GET /api/notifications
PUT /api/notifications/:id/read
```

---

# 📁 Project Structure

```text
dayflow-hrms/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── attendanceController.js
│   │   ├── leaveController.js
│   │   └── payrollController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── leaveRoutes.js
│   │   └── payrollRoutes.js
│   │
│   ├── server.js
│   └── package.json
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── architecture/
│   ├── screenshots/
│   └── project-report/
│
├── .gitignore
├── .env.example
└── README.md
```

---

# 🛠️ Technology Stack

## Frontend

```text
React.js
JavaScript
HTML5
CSS3
Axios
React Router
```

## Backend

```text
Node.js
Express.js
REST API
JWT
bcrypt
```

## Database

```text
MySQL
```

## Development Tools

```text
Git
GitHub
VS Code
Postman
Excalidraw
```

## Optional Libraries

```text
Chart.js / Recharts
Nodemailer
Cloudinary
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

```bash
cd dayflow-hrms
```

---

# 📦 Backend Setup

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Recommended packages:

```bash
npm install express mysql2 bcrypt jsonwebtoken cors dotenv
```

Development dependency:

```bash
npm install -D nodemon
```

---

# 📦 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

If creating the frontend from scratch:

```bash
npm create vite@latest frontend
```

Select:

```text
React
JavaScript
```

Install:

```bash
npm install axios react-router-dom
```

---

# 🗃️ Database Setup

Create a MySQL database:

```sql
CREATE DATABASE dayflow_hrms;
```

Then execute:

```text
database/schema.sql
```

Optional sample data:

```text
database/seed.sql
```

---

# 🔐 Environment Variables

Create:

```text
backend/.env
```

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dayflow_hrms

JWT_SECRET=your_secret_key

FRONTEND_URL=http://localhost:5173
```

Never commit `.env` to GitHub.

Add:

```text
.env
```

to `.gitignore`.

---

# ▶️ Running the Project

## Start Backend

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## Start Frontend

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔐 Authentication Flow

```text
USER
 │
 ▼
REGISTER
 │
 ▼
Validate Data
 │
 ▼
Hash Password
 │
 ▼
Save USER
 │
 ▼
Email Verification
 │
 ▼
LOGIN
 │
 ▼
Verify Password
 │
 ▼
Generate JWT
 │
 ▼
ROLE CHECK
 │
 ├───────────────┐
 ▼               ▼
EMPLOYEE       ADMIN/HR
 │               │
 ▼               ▼
EMPLOYEE       ADMIN/HR
DASHBOARD      DASHBOARD
```

---

# 🕒 Attendance Workflow

```text
EMPLOYEE
   │
   ▼
ATTENDANCE PAGE
   │
   ▼
CHECK-IN
   │
   ▼
Create Attendance Record
   │
   ▼
STATUS = PRESENT
   │
   ▼
CHECK-OUT
   │
   ▼
Update Check-Out Time
   │
   ▼
ATTENDANCE HISTORY
```

Employees view only their own records, while Admin/HR can view all attendance records.

---

# 🏖️ Leave Workflow

```text
EMPLOYEE
   │
   ▼
APPLY LEAVE
   │
   ▼
Select Type
   │
   ▼
Select Date Range
   │
   ▼
Add Remarks
   │
   ▼
PENDING
   │
   ▼
ADMIN / HR
   │
   ├──────────────┐
   ▼              ▼
APPROVE         REJECT
   │              │
   ▼              ▼
APPROVED       REJECTED
   │
   ▼
Update Attendance
   │
   ▼
STATUS = LEAVE
```

---

# 💰 Payroll Workflow

```text
ADMIN / HR
     │
     ▼
SELECT EMPLOYEE
     │
     ▼
UPDATE SALARY STRUCTURE
     │
     ▼
PAYROLL DATABASE
     │
     ▼
┌───────────────────┐
│ Basic Salary      │
│ Allowances        │
│ Deductions        │
│ Net Salary        │
└─────────┬─────────┘
          │
          ▼
EMPLOYEE
          │
          ▼
READ-ONLY SALARY VIEW
```

---

# 🔑 Role-Based Access

| Feature              | Employee |  HR | Admin |
| -------------------- | :------: | :-: | :---: |
| Login                |     ✅    |  ✅  |   ✅   |
| View Own Profile     |     ✅    |  ✅  |   ✅   |
| Edit Limited Profile |     ✅    |  ✅  |   ✅   |
| Manage Employees     |     ❌    |  ✅  |   ✅   |
| View Own Attendance  |     ✅    |  ✅  |   ✅   |
| View All Attendance  |     ❌    |  ✅  |   ✅   |
| Apply Leave          |     ✅    |  —  |   —   |
| Approve Leave        |     ❌    |  ✅  |   ✅   |
| Reject Leave         |     ❌    |  ✅  |   ✅   |
| View Own Payroll     |     ✅    |  ✅  |   ✅   |
| Update Payroll       |     ❌    |  ✅  |   ✅   |
| Reports              |  Limited |  ✅  |   ✅   |

The core distinction between employee and Admin/HR permissions follows the project requirements.

---

# 🧪 Testing

## Authentication Testing

Test:

```text
✓ Valid registration
✓ Duplicate email
✓ Invalid email
✓ Weak password
✓ Valid login
✓ Invalid password
✓ Invalid email
✓ Role authorization
✓ Email verification
```

---

## Attendance Testing

Test:

```text
✓ Check-in
✓ Duplicate check-in prevention
✓ Check-out
✓ Check-out without check-in
✓ Daily attendance
✓ Weekly attendance
✓ Employee attendance restriction
✓ Admin attendance access
```

---

## Leave Testing

Test:

```text
✓ Apply leave
✓ Invalid date range
✓ Leave type validation
✓ Pending status
✓ Approve leave
✓ Reject leave
✓ Admin comment
✓ Attendance update after approval
```

---

## Payroll Testing

Test:

```text
✓ View salary
✓ Update salary
✓ Allowance calculation
✓ Deduction calculation
✓ Net salary calculation
✓ Employee read-only access
```

---

# 📊 Analytics & Reports

The planned reporting layer can provide:

```text
Employee Statistics
        │
        ├── Total Employees
        │
        ├── Present Employees
        │
        ├── Employees on Leave
        │
        └── Pending Leave Requests

Attendance Reports
        │
        ├── Daily
        └── Weekly

Payroll Reports
        │
        ├── Salary Information
        └── Salary Slips
```

The specification identifies analytics and reports such as attendance reports and salary slips as future enhancement areas.

---

# 🔔 Notifications

Planned notifications include:

```text
Leave Submitted
Leave Approved
Leave Rejected
Attendance Reminder
Profile Updated
Payroll Updated
```

Example:

```text
🔔 Your leave request has been approved.
```

---

# 🗺️ 8-Hour Development Plan

| Hour       | Work                         |
| ---------- | ---------------------------- |
| **Hour 1** | Database + API Structure     |
| **Hour 2** | Authentication + JWT         |
| **Hour 3** | Employee Profile             |
| **Hour 4** | Attendance                   |
| **Hour 5** | Leave Management             |
| **Hour 6** | Admin Dashboard + Approvals  |
| **Hour 7** | Payroll + Reports            |
| **Hour 8** | Integration + Testing + Demo |

---

# 🚀 Development Priority

Build the project in this order:

```text
1. Database
       ↓
2. Backend Server
       ↓
3. Authentication
       ↓
4. Role-Based Access
       ↓
5. Employee Management
       ↓
6. Attendance
       ↓
7. Leave Management
       ↓
8. Leave Approval
       ↓
9. Payroll
       ↓
10. Notifications
       ↓
11. Reports
       ↓
12. Testing
       ↓
13. Deployment
```

---

# 📌 Minimum Viable Product

The first working version should contain:

```text
✓ Registration
✓ Login
✓ Role-based dashboard
✓ Employee profile
✓ Check-in
✓ Check-out
✓ Attendance history
✓ Leave application
✓ Leave approval/rejection
✓ Payroll view
✓ Admin employee management
```

After the MVP works, add:

```text
→ Email verification
→ Notifications
→ Analytics
→ Salary slips
→ Advanced reports
→ UI improvements
→ Deployment
```

---

# 🔮 Future Enhancements

The original project specification identifies **email/notification alerts** and an **analytics/reports dashboard** as future enhancements.

Additional implementation possibilities include:

* Mobile application
* Biometric attendance
* QR-based attendance
* Advanced payroll processing
* Automated salary slips
* Email notifications
* Real-time notifications
* Advanced HR analytics
* Employee performance management
* Department-level analytics
* Cloud deployment

These additional items are proposed extensions and are not part of the original required scope.

---

# 🖥️ Suggested Application Pages

## Public

```text
/login
/register
/verify-email
```

## Employee

```text
/employee/dashboard
/employee/profile
/employee/attendance
/employee/leave
/employee/payroll
/employee/notifications
```

## Admin / HR

```text
/admin/dashboard
/admin/employees
/admin/employees/:id
/admin/attendance
/admin/leaves
/admin/payroll
/admin/reports
/admin/notifications
```

---

# 📡 API Request Flow

```text
React Frontend
      │
      │ Axios
      ▼
REST API
      │
      ▼
JWT Middleware
      │
      ▼
Role Authorization
      │
      ▼
Controller
      │
      ▼
Database Query
      │
      ▼
MySQL
      │
      ▼
JSON Response
      │
      ▼
React UI
```

---

# 🛡️ Security

The application should follow these practices:

* Password hashing using bcrypt
* JWT authentication
* Role-based authorization
* Protected API routes
* Input validation
* Parameterized SQL queries
* CORS configuration
* Environment variables for secrets
* No plain-text passwords
* Secure logout/token handling

---

# 📈 Project Status

```text
Project: Dayflow HRMS

Status: In Development

Core Modules:
├── Authentication      🟡
├── Employee Management 🟡
├── Attendance          🟡
├── Leave Management    🟡
├── Payroll             🟡
├── Notifications       🟡
└── Reports             🟡
```

Update these indicators as the team completes each module.

---

# 👨‍💻 Contributors

| Member   | Responsibility                   |
| -------- | -------------------------------- |
| Member 1 | Authentication + User Management |
| Member 2 | Employee Profile + Dashboard     |
| Member 3 | Attendance + Leave API           |
| Member 4 | Admin Dashboard + Approvals      |
| Member 5 | Payroll + Reports                |
| Team     | Integration + Testing            |

> Update the names and responsibilities according to your actual team.

---

# 📚 Project Documentation

Project requirements:

```text
Dayflow - Human Resource Management System
```

Architecture and workflow diagrams:

```text
Excalidraw
```

Recommended documentation:

```text
docs/
├── architecture/
├── database/
├── api/
├── screenshots/
└── project-report/
```

---

# 🤝 Git Workflow

Each team member should work on a separate branch.

```bash
git checkout -b feature/attendance
```

After completing the work:

```bash
git add .
git commit -m "Add attendance API"
git push origin feature/attendance
```

Then create a Pull Request to:

```text
main
```

Recommended branches:

```text
main
├── feature/authentication
├── feature/employee-profile
├── feature/attendance
├── feature/leave
├── feature/admin-dashboard
└── feature/payroll
```

---

# 🎯 Final Goal

The final Dayflow system should provide a centralized HR platform where:

```text
                    DAYFLOW
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
      EMPLOYEE                  ADMIN / HR
          │                         │
     ┌────┼────┐              ┌─────┼─────┐
     ▼    ▼    ▼              ▼     ▼     ▼
  Profile Attendance Leave  Employees Leave Payroll
     │    │    │              │     │     │
     └────┴────┘              └─────┴─────┘
          │                         │
          └──────────┬──────────────┘
                     ▼
                CENTRAL DB
                     │
                     ▼
             REPORTS / ANALYTICS
```

**Dayflow — Every workday, perfectly aligned.**
