# Campus Placement Portal & Application Tracker

A full-stack campus placement management system built with **React.js, Spring Boot, Spring Data JPA, and MySQL**.

The project centralizes placement drives, student eligibility checks, applications, recruitment-stage tracking, and coordinator dashboards in one platform.

> **Current authentication status:** The application currently uses a temporary frontend role switch for Student and Coordinator views. JWT-based authentication and authorization will be added later.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Main Users](#main-users)
- [Features](#features)
- [Application Workflow](#application-workflow)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Design](#database-design)
- [Backend Features](#backend-features)
- [Frontend Features](#frontend-features)
- [REST API Endpoints](#rest-api-endpoints)
- [Pagination, Sorting and Filtering](#pagination-sorting-and-filtering)
- [Eligibility Rules](#eligibility-rules)
- [Application Status Workflow](#application-status-workflow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Example API Requests](#example-api-requests)
- [Future Improvements](#future-improvements)
- [Learning Outcomes](#learning-outcomes)
- [Resume Description](#resume-description)

---

## Problem Statement

Campus placement information is often distributed across emails, messaging groups, spreadsheets, and personal notes.

This creates problems for both students and placement coordinators.

### Problems faced by students

- Difficulty tracking multiple placement opportunities
- Missing application deadlines
- Uncertainty about eligibility requirements
- Difficulty remembering which companies they already applied to
- No centralized place to track assessment and interview progress
- No simple view of current recruitment status

### Problems faced by placement coordinators

- Managing many placement drives manually
- Handling large numbers of student applications
- Tracking students across multiple recruitment stages
- Checking eligibility manually
- Monitoring open and closed placement drives
- Maintaining overall placement statistics

---

## Solution

The **Campus Placement Portal & Application Tracker** provides a centralized platform where:

### Placement Coordinators can

- Post placement drives
- Define eligibility requirements
- Edit and delete placement drives
- Open or close applications
- View applicants for each drive
- Update student recruitment stages
- View placement statistics

### Students can

- View their profile
- Browse placement opportunities
- Search drives by company, role, and location
- Apply to eligible drives
- Receive meaningful eligibility errors
- Track application progress
- View their application history

---

## Main Users

### Student

A student can:

- View profile information
- Browse placement drives
- Search and filter opportunities
- Apply for placement drives
- View application status
- Track recruitment progress

### Placement Coordinator

A placement coordinator can:

- Create placement drives
- Edit placement drives
- Delete placement drives
- Open or close a drive
- View applicants
- Update applicant status
- View dashboard statistics

> Company/HR login is not currently part of the project. Companies are assumed to share placement details with the college placement cell, and the coordinator posts them to the portal.

---

## Features

### Placement Drive Management

- Create placement drive
- Read placement drives
- Update placement drive
- Delete placement drive
- Open/close placement drive
- Server-side pagination
- Sorting
- Search and filtering
- Eligible department management

### Student Management

- Student profile creation
- Student profile update
- Department
- CGPA
- Backlogs
- Graduation year

### Placement Applications

- Student applies to a placement drive
- Prevent duplicate applications
- Deadline validation
- CGPA eligibility validation
- Backlog validation
- Department eligibility validation
- Drive status validation
- Student application history
- Coordinator applicant view

### Recruitment Tracking

Application stages:

```text
APPLIED
   ↓
ASSESSMENT
   ↓
TECHNICAL_INTERVIEW
   ↓
HR_INTERVIEW
   ↓
SELECTED / REJECTED
```

The system also supports:

```text
WITHDRAWN
```

### Dashboard

Coordinator dashboard includes:

- Total placement drives
- Open drives
- Total applications
- Selected students
- Students currently in interview stages

### Error Handling

The backend includes:

- Custom business exceptions
- Resource-not-found exceptions
- Global exception handling
- Consistent error responses

---

## Application Workflow

### Placement Drive Flow

```text
Company shares placement information
                ↓
Placement Coordinator
                ↓
Posts Placement Drive
                ↓
Students view the opportunity
                ↓
Student clicks Apply
                ↓
Backend validates eligibility
                ↓
Application created
                ↓
Coordinator updates recruitment stage
                ↓
Student tracks status
```

### Student Application Validation

When a student applies:

```text
Is the drive OPEN?
        ↓
Has the deadline passed?
        ↓
Does student satisfy minimum CGPA?
        ↓
Are backlogs within allowed limit?
        ↓
Is student's department eligible?
        ↓
Has student already applied?
        ↓
Create Placement Application
```

---

## Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- CSS
- Fetch API

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Lombok
- MySQL Connector/J
- Maven

### Database

- MySQL

### Development Tools

- VS Code
- Postman
- MySQL Workbench
- Git
- GitHub

---

## Architecture

The backend follows a layered architecture:

```text
React Frontend
      ↓
REST API
      ↓
Controller Layer
      ↓
Service Layer
      ↓
Business Logic
      ↓
Repository Layer
      ↓
Spring Data JPA / Hibernate
      ↓
MySQL
```

### Layer Responsibilities

#### Controller

Receives HTTP requests and returns HTTP responses.

#### Service

Contains application and business logic.

Examples:

- Eligibility validation
- Duplicate application checking
- Status changes
- Deadline validation

#### Repository

Communicates with the database using Spring Data JPA.

#### Entity / Model

Represents application data stored in MySQL.

---

## Database Design

Main entities:

### User

```text
id
name
email
role
createdAt
```

Roles:

```text
STUDENT
COORDINATOR
```

### StudentProfile

```text
id
user_id
department
cgpa
backlogs
graduationYear
```

### PlacementDrive

```text
id
companyName
role
description
packageLpa
location
minimumCgpa
maxBacklogs
deadline
status
createdAt
```

Drive status:

```text
OPEN
CLOSED
```

### Eligible Departments

Eligible departments are stored using `@ElementCollection`.

Example:

```text
drive_eligible_departments

drive_id | department
---------|-----------
1        | CSE
1        | IT
1        | ECE
```

### PlacementApplication

```text
id
student_id
placement_drive_id
status
appliedAt
updatedAt
```

A unique constraint prevents the same student from applying to the same placement drive more than once.

---

## JPA Relationships

### User → StudentProfile

```text
User
  ↓
@OneToOne
  ↓
StudentProfile
```

### StudentProfile → PlacementApplication

```text
StudentProfile
      ↓
   @ManyToOne relationship from applications
      ↓
PlacementApplication
```

One student can have multiple placement applications.

### PlacementDrive → PlacementApplication

One placement drive can receive multiple applications.

```text
PlacementDrive
      ↓
PlacementApplication
      ↓
StudentProfile
```

---

## Backend Features

The backend demonstrates:

- REST API development
- CRUD operations
- Spring Data JPA
- Hibernate ORM
- MySQL integration
- Pagination
- Sorting
- Search
- Filtering
- Custom JPQL queries
- Derived query methods
- JPA relationships
- `@OneToOne`
- `@ManyToOne`
- `@ElementCollection`
- Enums
- Custom exceptions
- Global exception handling
- Business-rule validation
- Dashboard aggregation/count queries

---

## Frontend Features

### Student Dashboard

- Student profile card
- Edit profile
- Placement drive listing
- Company search
- Role search
- Location search
- Apply button
- Application status table
- Pagination

### Coordinator Dashboard

- Placement statistics
- Create placement drive form
- Edit placement drive
- Delete placement drive
- Open/close placement drive
- View applicants
- Update applicant recruitment stage
- Applicant pagination

### Responsive UI

The frontend includes:

- Modern dashboard cards
- Status badges
- Responsive placement cards
- Forms
- Tables
- Alerts
- Pagination controls
- Mobile-friendly layout

---

## REST API Endpoints

Base URL:

```text
http://localhost:8080/api
```

---

### Placement Drives

#### Create drive

```http
POST /api/drives
```

#### Get placement drives

```http
GET /api/drives
```

Supports pagination, sorting and filtering.

#### Get drive by ID

```http
GET /api/drives/{id}
```

#### Update drive

```http
PUT /api/drives/{id}
```

#### Delete drive

```http
DELETE /api/drives/{id}
```

#### Update drive status

```http
PUT /api/drives/{id}/status?status=OPEN
```

or:

```http
PUT /api/drives/{id}/status?status=CLOSED
```

---

### Students

#### Create student

```http
POST /api/students
```

#### Get students

```http
GET /api/students
```

#### Get student by ID

```http
GET /api/students/{id}
```

#### Update student

```http
PUT /api/students/{id}
```

#### Delete student

```http
DELETE /api/students/{id}
```

---

### Placement Applications

#### Apply for a drive

```http
POST /api/applications/apply?studentId={studentId}&driveId={driveId}
```

#### Get student's applications

```http
GET /api/applications/student/{studentId}?page=0&size=5
```

#### Get applicants for a placement drive

```http
GET /api/applications/drive/{driveId}?page=0&size=10
```

#### Get application by ID

```http
GET /api/applications/{id}
```

#### Update application status

```http
PUT /api/applications/{id}/status?status=ASSESSMENT
```

Supported statuses:

```text
APPLIED
ASSESSMENT
TECHNICAL_INTERVIEW
HR_INTERVIEW
SELECTED
REJECTED
WITHDRAWN
```

---

### Dashboard

#### Coordinator dashboard statistics

```http
GET /api/dashboard/stats
```

Example response:

```json
{
  "totalDrives": 10,
  "openDrives": 6,
  "totalApplications": 75,
  "selectedStudents": 12,
  "interviewStage": 18
}
```

---

## Pagination, Sorting and Filtering

Placement drives support server-side pagination.

Example:

```http
GET /api/drives?page=0&size=5
```

### Sorting

Newest drives first:

```http
GET /api/drives?page=0&size=5&sortBy=createdAt&direction=desc
```

Highest package first:

```http
GET /api/drives?page=0&size=5&sortBy=packageLpa&direction=desc
```

Earliest deadline first:

```http
GET /api/drives?page=0&size=5&sortBy=deadline&direction=asc
```

### Filtering

Company:

```http
GET /api/drives?company=IBM
```

Role:

```http
GET /api/drives?role=Engineer
```

Location:

```http
GET /api/drives?location=Bangalore
```

CGPA:

```http
GET /api/drives?studentCgpa=7.5
```

Combined:

```http
GET /api/drives?role=Engineer&location=Bangalore&studentCgpa=7.5&page=0&size=5&sortBy=packageLpa&direction=desc
```

---

## Eligibility Rules

When a student applies, the backend checks:

### Drive Status

The placement drive must be:

```text
OPEN
```

### Deadline

The application deadline must not have passed.

### Minimum CGPA

Example:

```text
Required: 7.0
Student: 7.4

Eligible ✓
```

### Maximum Backlogs

Example:

```text
Allowed: 0
Student: 1

Not Eligible ✗
```

### Department

Example eligible departments:

```text
CSE
IT
ECE
```

A `MECH` student would not be eligible.

### Duplicate Application

A student cannot apply to the same placement drive twice.

---

## Application Status Workflow

```text
APPLIED
   ↓
ASSESSMENT
   ↓
TECHNICAL_INTERVIEW
   ↓
HR_INTERVIEW
   ↓
SELECTED
```

A student can also be moved to:

```text
REJECTED
WITHDRAWN
```

The coordinator controls recruitment-stage updates.

---

## Error Handling

Example `404` response:

```json
{
  "timestamp": "2026-09-06T01:10:15",
  "status": 404,
  "error": "Not Found",
  "message": "Placement drive not found with id: 9999",
  "path": "/api/drives/9999"
}
```

Example eligibility error:

```json
{
  "timestamp": "2026-09-06T01:11:20",
  "status": 400,
  "error": "Bad Request",
  "message": "Student is not eligible. Minimum CGPA required: 8.0, Student CGPA: 7.4",
  "path": "/api/applications/apply"
}
```

---

## Project Structure

A typical repository layout is:

```text
campus-placement-portal/
│
├── placement-portal/
│   │
│   ├── pom.xml
│   │
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/example/placement_portal/
│           │       ├── config/
│           │       ├── controller/
│           │       ├── exception/
│           │       ├── model/
│           │       ├── repository/
│           │       ├── service/
│           │       └── PlacementPortalApplication.java
│           │
│           └── resources/
│               └── application.properties
│
├── placement-portal-frontend/
│   │
│   ├── package.json
│   └── src/
│       ├── components/
│       │   └── Pagination.jsx
│       ├── pages/
│       │   ├── StudentDashboard.jsx
│       │   └── CoordinatorDashboard.jsx
│       ├── services/
│       │   └── api.js
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
└── README.md
```

Adjust the folder names if your local repository structure differs.

---

## Getting Started

### Prerequisites

Install:

- Java 21
- Maven
- Node.js
- npm
- MySQL Server
- Git

Recommended tools:

- VS Code
- MySQL Workbench
- Postman

---

## Backend Setup

### 1. Create the database

Open MySQL and run:

```sql
CREATE DATABASE placement_portal;
```

### 2. Configure environment variables

The recommended `application.properties` configuration is:

```properties
spring.application.name=placement-portal

spring.datasource.url=jdbc:mysql://localhost:3306/placement_portal
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
```

> Never commit your real MySQL password to GitHub.

### Windows PowerShell

Set your local password:

```powershell
$env:DB_PASSWORD="your_mysql_password"
```

If your MySQL username is not `root`:

```powershell
$env:DB_USERNAME="your_mysql_username"
```

### 3. Run Spring Boot

From the backend folder:

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

## Frontend Setup

Move to the frontend folder:

```bash
cd placement-portal-frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## CORS

During local development, the backend allows the React frontend running at:

```text
http://localhost:5173
```

to access:

```text
http://localhost:8080/api/**
```

---

## Example API Requests

### Create Placement Drive

```http
POST /api/drives
Content-Type: application/json
```

```json
{
  "companyName": "IBM",
  "role": "Associate System Engineer",
  "description": "Entry-level software engineering position.",
  "packageLpa": 4.5,
  "location": "Bangalore",
  "minimumCgpa": 7.0,
  "maxBacklogs": 0,
  "deadline": "2026-09-25",
  "eligibleDepartments": [
    "CSE",
    "IT",
    "ECE"
  ]
}
```

New drives automatically start with:

```text
OPEN
```

---

### Create Student

```http
POST /api/students
Content-Type: application/json
```

```json
{
  "user": {
    "name": "Student Name",
    "email": "student@example.com"
  },
  "department": "CSE",
  "cgpa": 7.8,
  "backlogs": 0,
  "graduationYear": 2027
}
```

---

### Apply to Placement Drive

```http
POST /api/applications/apply?studentId=1&driveId=2
```

No JSON request body is required.

---

## Current Development Status

Implemented:

- [x] Spring Boot backend
- [x] MySQL integration
- [x] Placement drive CRUD
- [x] Student profile CRUD
- [x] Placement application workflow
- [x] Pagination
- [x] Sorting
- [x] Filtering
- [x] Search
- [x] CGPA eligibility validation
- [x] Backlog eligibility validation
- [x] Department eligibility validation
- [x] Deadline validation
- [x] Duplicate application prevention
- [x] Open/closed placement drives
- [x] Recruitment status updates
- [x] Dashboard statistics
- [x] Global exception handling
- [x] React student dashboard
- [x] React coordinator dashboard
- [x] Frontend/backend integration
- [x] Responsive UI
- [ ] Spring Security
- [ ] JWT authentication
- [ ] Role-based backend authorization
- [ ] Automated backend tests
- [ ] Deployment

---

## Future Improvements

### Authentication and Authorization

Planned:

- Spring Security
- JWT authentication
- Student login
- Coordinator login
- Role-based API authorization

Expected flow:

```text
Login
  ↓
JWT
  ↓
Backend validates token
  ↓
STUDENT / COORDINATOR role
  ↓
Authorized API access
```

### Additional Improvements

Possible future features:

- Email notifications
- Placement deadline reminders
- Resume upload
- Company-wise analytics
- Placement reports
- Student eligibility recommendations
- Export applicant data
- JUnit and Mockito tests
- Swagger/OpenAPI documentation
- Docker support
- Cloud deployment

---

## Learning Outcomes

This project demonstrates practical understanding of:

### Spring Boot

- Controllers
- Services
- Repositories
- Dependency injection
- REST APIs
- Request parameters
- Path variables
- HTTP responses

### Spring Data JPA

- `JpaRepository`
- Derived query methods
- Custom JPQL
- Pagination
- Sorting
- Entity relationships
- Collection mapping

### Database

- Relational schema design
- Foreign keys
- Unique constraints
- MySQL integration

### Backend Business Logic

- Eligibility validation
- Deadline validation
- Duplicate prevention
- Status workflows
- Exception handling

### React

- Components
- State
- Effects
- Fetch API
- Forms
- Conditional rendering
- Pagination UI
- Frontend/backend integration

---

## Resume Description

### Campus Placement Portal & Application Tracker  
**React.js | Spring Boot | Spring Data JPA | MySQL**

- Developed a full-stack campus placement portal that enables placement coordinators to publish and manage placement drives while students browse opportunities, apply, and track recruitment progress.
- Implemented RESTful APIs using Spring Boot and Spring Data JPA with CRUD operations, server-side pagination, sorting, filtering, relational mappings, and MySQL persistence.
- Built an eligibility engine that validates CGPA, backlog count, department, application deadline, drive status, and duplicate applications before allowing a student to apply.
- Implemented recruitment-stage tracking across assessment, technical interview, HR interview, selection, and rejection stages.
- Built responsive React dashboards for student applications and coordinator drive/applicant management, including dashboard statistics and application status updates.
- Added custom exception handling and consistent HTTP error responses for validation, eligibility, and resource-not-found scenarios.

---

## Security Note

Authentication has intentionally been kept separate from the current functional version.

The present frontend role switch is for development/testing only and **must not be treated as real authorization**.

Spring Security and JWT-based authentication will be added as the security layer in a later development phase.

---

## Author

Developed as a full-stack learning and portfolio project using:

**React.js + Spring Boot + MySQL**

