# Internal Task & Ticket Tracking API with AI Assistance

A backend-powered task and ticket management system designed to help organizations create, assign, track, and manage tasks efficiently. The platform provides role-based access control, task assignment, progress monitoring, collaboration through comments, and AI-powered assistance using Google's Gemini API.

Built with **Node.js, Express.js, PostgreSQL, Prisma ORM, and Google Gemini AI**, this project aims to provide a secure, scalable, and intelligent task management solution for internal teams.

## Project Overview

The Internal Task & Ticket Tracking API is a RESTful backend application developed to simplify task management and improve collaboration within organizations.

In many organizations, managing employee responsibilities, tracking task progress, assigning work, and monitoring deadlines can become difficult without a centralized system.

This project addresses that challenge by providing an API that allows administrators and managers to create tasks, assign responsibilities to employees, monitor progress, and maintain a record of activities.

It also introduces Artificial Intelligence through Google's Gemini API to provide intelligent assistance, helping teams understand task discussions, evaluate priorities, and make better decisions.

The system follows a role-based access control approach to ensure that users can only perform actions permitted by their assigned roles.

## Project Objectives

The primary objectives of this project are to:

- Build a centralized task and ticket management system.
- Provide secure user authentication and authorization.
- Implement role-based access control for administrators, managers, and employees.
- Allow managers to create and assign tasks to employees.
- Enable employees to monitor and update their assigned tasks.
- Track task progress, deadlines, and priorities.
- Support collaboration through task comments.
- Maintain activity records for important task operations.
- Integrate Google Gemini AI to provide intelligent task assistance.
- Build a scalable and maintainable backend architecture.

## Key Features

### 1. User Authentication and Authorization

- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Protected API routes.
- Role-based authorization.
- Account activation and deactivation.
- Current authenticated user profile.

### 2. User Management

- Retrieve registered users.
- Retrieve individual user information.
- Update user profile information.
- Change user roles (administrator only).
- Deactivate and reactivate user accounts.
- Restrict access to sensitive user information.

### 3. Task Management

- Create new tasks.
- Retrieve all accessible tasks.
- Retrieve individual task details.
- Update task information.
- Delete tasks.
- Set task priorities.
- Define task deadlines.
- Estimate task completion hours.
- Search and filter tasks.
- Paginate task results.

### 4. Task Assignment and Workload Management

- Assign tasks to employees.
- Reassign tasks when necessary.
- Retrieve tasks assigned to the authenticated employee.
- Filter assigned tasks by status and priority.
- Monitor employee workloads.
- View task distribution across different statuses.

### 5. Task Collaboration

- Add comments to tasks.
- Retrieve task discussions.
- Edit comments created by the authenticated user.
- Delete comments according to authorization rules.
- Associate comments with their authors and related tasks.
- Record comment creation in task activity history.

### 6. Task Activity Tracking

The system maintains activity records for important task operations, including:

- Task creation.
- Task assignment.
- Task status changes.
- Task priority changes.
- Task updates.
- Comment creation.

### 7. AI-Powered Task Assistance

Using Google's Gemini AI, the system is designed to provide:

- Automatic summarization of lengthy task discussions.
- Intelligent task status recommendations.
- Task priority suggestions.
- Estimated task effort recommendations.
- AI-generated insights to support better task management decisions.

AI recommendations are intended to assist users, not automatically make important task-management decisions without user confirmation.

---

## Technology Stack

| Technology           | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| Node.js              | JavaScript runtime environment                 |
| Express.js           | Backend framework for building RESTful APIs    |
| PostgreSQL           | Relational database management system          |
| Prisma ORM           | Database modeling, queries, and migrations     |
| Google Gemini AI     | AI-powered task assistance                     |
| JSON Web Token (JWT) | User authentication                            |
| bcryptjs             | Password hashing                               |
| dotenv               | Environment variable management                |
| CORS                 | Cross-Origin Resource Sharing                  |
| Nodemon              | Automatic server restarting during development |
| Postman              | API testing and debugging                      |

---

## User Roles and Permissions

The system supports three primary user roles.

| Role     | Responsibilities                                                                       |
| -------- | -------------------------------------------------------------------------------------- |
| ADMIN    | Manages users, controls access, oversees tasks, and manages administrative operations. |
| MANAGER  | Creates tasks, assigns employees, monitors progress, and manages tasks they own.       |
| EMPLOYEE | Views assigned tasks, updates task statuses, and collaborates through comments.        |

### Role-Based Access Control

**ADMIN**

- View and manage users.
- Change user roles.
- Activate and deactivate accounts.
- View all tasks.
- Create, update, assign, and delete tasks.
- Monitor employee workloads.

**MANAGER**

- View employees.
- Create tasks.
- Assign tasks to employees.
- Update and manage tasks they created.
- Monitor the workload of employees working on their tasks.

**EMPLOYEE**

- View their assigned tasks.
- View individual task details they have access to.
- Update the status of assigned tasks.
- Add comments to accessible tasks.
- Manage their own profile.

All protected operations require valid authentication and appropriate authorization.

---

## Task Management Workflow

The general task management process follows these steps:

1. An administrator creates user accounts or employees register through the application.
2. An administrator assigns appropriate roles to users.
3. A manager logs into the system.
4. The manager creates a task with a title, description, priority, and deadline.
5. The manager assigns the task to an employee.
6. The employee logs into the system and views their assigned tasks.
7. The employee updates the task status as work progresses.
8. Team members collaborate through task comments.
9. The system records important activities.
10. Gemini AI can assist with summarizing discussions and recommending task priorities or statuses.

### Available Task Statuses

| Status      | Description                                      |
| ----------- | ------------------------------------------------ |
| TODO        | Task has been created but work has not started.  |
| IN_PROGRESS | Employee is currently working on the task.       |
| IN_REVIEW   | Task is awaiting review or approval.             |
| BLOCKED     | Progress is prevented by an issue or dependency. |
| COMPLETED   | Task has been completed.                         |

### Available Task Priorities

| Priority | Description                          |
| -------- | ------------------------------------ |
| LOW      | Task has minimal urgency.            |
| MEDIUM   | Task has normal priority.            |
| HIGH     | Task requires significant attention. |
| URGENT   | Task requires immediate attention.   |

---

## Project Structure

The project uses a modular folder structure to keep the application organized and maintainable.

```text
task-tracking-API/
│
├── generated/
│   └── prisma/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── taskController.js
│   │   └── commentController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── taskRoutes.js
│   │   └── commentRoutes.js
│   │
│   ├── services/
│   │   └── geminiService.js
│   │
│   ├── validators/
│   │
│   ├── utils/
│   │
│   └── app.js
│
├── tests/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── prisma7.config.ts
├── server.js
└── README.md
```

_Note: The structure represents the intended application architecture. Some folders and files will be added as the remaining development stages are completed._

---

## Database Design

The application uses PostgreSQL as its primary database, with Prisma ORM managing database operations.

The initial database design contains four main models.

### 1. User

Stores information about registered users.

Important fields:

- `id`
- `name`
- `email`
- `password`
- `role`
- `isActive`
- `createdAt`
- `updatedAt`

### 2. Task

Stores information about tasks created within the organization.

Important fields:

- `id`
- `title`
- `description`
- `status`
- `priority`
- `dueDate`
- `estimatedHours`
- `createdById`
- `assignedToId`
- `createdAt`
- `updatedAt`

### 3. Comment

Stores comments associated with tasks.

Important fields:

- `id`
- `content`
- `taskId`
- `authorId`
- `createdAt`
- `updatedAt`

### 4. TaskActivity

Maintains a record of important activities performed on tasks.

Important fields:

- `id`
- `action`
- `details`
- `taskId`
- `actorId`
- `createdAt`

### Database Relationships

- One user can create multiple tasks.
- One user can be assigned multiple tasks.
- One task can have multiple comments.
- One user can create multiple comments.
- One task can have multiple activity records.
- One user can perform multiple task activities.

These relationships help maintain data consistency and support efficient task tracking.

---

## Installation and Setup

Follow these steps to run the project locally.

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm
- PostgreSQL
- pgAdmin 4 (optional, for managing PostgreSQL databases)
- Git
- Postman

### Step 1: Clone the Repository

```bash
git clone https://github.com/chris-damilola/task-tracking-api.git
```

Navigate into the project directory:

```bash
cd task-tracking-API
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory.

Copy the structure from `.env.example` and provide your local configuration.

### Step 4: Create the PostgreSQL Database

Open PostgreSQL or pgAdmin and create a database named:

```text
task_tracking_db
```

### Step 5: Configure Prisma

Ensure your Prisma schema and Prisma configuration file are correctly configured.

Run:

```bash
npx prisma validate
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Apply database migrations:

```bash
npx prisma migrate dev
```

### Step 6: Create the Administrator Account

Configure the temporary administrator environment variables in your `.env` file and run:

```bash
npm run create-admin
```

Remove the temporary administrator password variables from `.env` after the account has been created.

### Step 7: Start the Development Server

```bash
npm run dev
```

The application should start on:

```text
http://localhost:5000
```

---

## Environment Variables

The application requires environment variables for database access, authentication, and AI integration.

Example `.env.example`:

```env
# Application
PORT=5000
NODE_ENV=development

# PostgreSQL Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_tracking_db?schema=public"

# JWT Authentication
JWT_SECRET="YOUR_LONG_RANDOM_SECRET"
JWT_EXPIRES_IN="1d"

# Google Gemini AI
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Temporary Administrator Setup
ADMIN_NAME="System Administrator"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="CHANGE_THIS_PASSWORD"
```

**Important Security Notes:**

- Never upload your actual `.env` file to GitHub.
- Never expose your PostgreSQL password.
- Never publish your JWT secret.
- Never expose your Gemini API key.
- Use strong, unique secrets in production.
- Remove temporary administrator credentials after account creation.

---

## Running the Application

### Development Mode

```bash
npm run dev
```

Uses Nodemon to restart the server automatically when files change.

### Production Mode

```bash
npm start
```

### Prisma Commands

Validate the Prisma schema:

```bash
npx prisma validate
```

Generate Prisma Client:

```bash
npx prisma generate
```

Create and apply a migration:

```bash
npx prisma migrate dev --name migration_name
```

Deploy existing migrations:

```bash
npx prisma migrate deploy
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

## API Documentation

**Base URL**

```text
http://localhost:5000/api
```

All protected endpoints require a valid JWT access token.

Add the following header in Postman:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 1. Authentication Endpoints

| Method | Endpoint         | Description                         | Access        |
| ------ | ---------------- | ----------------------------------- | ------------- |
| POST   | `/auth/register` | Register a new employee             | Public        |
| POST   | `/auth/login`    | Authenticate a user                 | Public        |
| GET    | `/auth/me`       | Retrieve authenticated user details | Authenticated |

### 2. User Management Endpoints

| Method | Endpoint                | Description             | Access           |
| ------ | ----------------------- | ----------------------- | ---------------- |
| GET    | `/users`                | Retrieve users          | Admin, Manager   |
| GET    | `/users/:id`            | Retrieve a user by ID   | Authorized users |
| PATCH  | `/users/:id`            | Update user information | Authorized users |
| PATCH  | `/users/:id/role`       | Change user role        | Admin            |
| PATCH  | `/users/:id/deactivate` | Deactivate an account   | Admin            |
| PATCH  | `/users/:id/reactivate` | Reactivate an account   | Admin            |

### 3. Task Management Endpoints

| Method | Endpoint            | Description               | Access           |
| ------ | ------------------- | ------------------------- | ---------------- |
| POST   | `/tasks`            | Create a new task         | Admin, Manager   |
| GET    | `/tasks`            | Retrieve accessible tasks | Authenticated    |
| GET    | `/tasks/:id`        | Retrieve a specific task  | Authorized users |
| PATCH  | `/tasks/:id`        | Update task details       | Admin, Manager   |
| PATCH  | `/tasks/:id/status` | Update task status        | Authorized users |
| DELETE | `/tasks/:id`        | Delete a task             | Admin, Manager   |

### 4. Task Assignment and Workload Endpoints

| Method | Endpoint                  | Description                                       | Access         |
| ------ | ------------------------- | ------------------------------------------------- | -------------- |
| PATCH  | `/tasks/:id/assign`       | Assign or reassign a task                         | Admin, Manager |
| GET    | `/tasks/my/assigned`      | Retrieve tasks assigned to the logged-in employee | Authenticated  |
| GET    | `/tasks/workload/:userId` | Retrieve an employee's workload                   | Admin, Manager |

### 5. Task Comment Endpoints

The following endpoints are part of the planned collaboration module:

| Method | Endpoint                  | Description             |
| ------ | ------------------------- | ----------------------- |
| POST   | `/tasks/:taskId/comments` | Add a comment to a task |
| GET    | `/tasks/:taskId/comments` | Retrieve task comments  |
| PATCH  | `/comments/:commentId`    | Update a comment        |
| DELETE | `/comments/:commentId`    | Delete a comment        |

### Example: Register a User

**Request**

```http
POST /api/auth/register
```

**Request Body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

### Example: Create a Task

**Request**

```http
POST /api/tasks
```

**Request Body**

```json
{
  "title": "Implement Authentication",
  "description": "Develop secure user authentication and authorization endpoints.",
  "priority": "HIGH",
  "dueDate": "2026-12-15T23:59:59.000Z",
  "estimatedHours": 12,
  "assignedToId": "EMPLOYEE_UUID"
}
```

### Example: Update Task Status

**Request**

```http
PATCH /api/tasks/TASK_UUID/status
```

**Request Body**

```json
{
  "status": "IN_PROGRESS"
}
```

### Example: Assign a Task

**Request**

```http
PATCH /api/tasks/TASK_UUID/assign
```

**Request Body**

```json
{
  "assignedToId": "EMPLOYEE_UUID"
}
```

_Replace the example UUID values with actual IDs returned by your API._

---

## Authentication

The application uses JSON Web Tokens (JWT) to protect private endpoints.

The authentication process follows these steps:

1. A user registers or logs into the application.
2. The server validates the user's credentials.
3. The password is verified using bcrypt.
4. The server generates a signed JWT.
5. The client receives the token.
6. The client includes the token in the Authorization header when accessing protected endpoints.
7. Authentication middleware verifies the token and retrieves the user's current account information.
8. Authorization middleware checks whether the user's role permits the requested operation.

Public registration creates employee accounts by default. Administrative privileges are managed through the administrator account and authorized role-management operations.

---

## AI-Powered Features

One of the major goals of this project is to integrate Google's Gemini AI to make task management more intelligent.

### 1. Task Discussion Summarization

Long task discussions can become difficult to follow.

Gemini AI will analyze the comments associated with a task and generate a concise summary highlighting:

- Main discussion points.
- Important decisions.
- Outstanding issues.
- Blockers.
- Recommended next actions.

### 2. Intelligent Task Status Recommendation

Gemini AI will analyze task descriptions, comments, and progress information to suggest an appropriate task status.

For example, it may recommend:

- TODO
- IN_PROGRESS
- IN_REVIEW
- BLOCKED
- COMPLETED

The recommendation will require user confirmation before the task status is changed.

### 3. Task Priority Recommendation

Gemini AI will evaluate task information and suggest an appropriate priority based on factors such as:

- Task urgency.
- Business importance.
- Deadline.
- Potential impact.
- Reported blockers.

### 4. Task Effort Estimation

Gemini AI will analyze task descriptions and requirements to suggest an estimated completion time.

These estimates are intended to support planning and should not be treated as guaranteed delivery times.

---

## Error Handling

The application uses centralized error-handling middleware to provide consistent API responses.

Example error response:

```json
{
  "success": false,
  "message": "Internal server error"
}
```

Common HTTP status codes include:

| Status Code | Meaning                                        |
| ----------- | ---------------------------------------------- |
| 200         | Request successful                             |
| 201         | Resource created successfully                  |
| 400         | Bad request                                    |
| 401         | Authentication required or invalid credentials |
| 403         | Access forbidden                               |
| 404         | Resource not found                             |
| 409         | Resource conflict                              |
| 500         | Internal server error                          |

---

## Testing

Postman is used to test the API endpoints during development.

Testing covers:

- User registration.
- User login.
- JWT authentication.
- Role-based authorization.
- User management.
- Task creation and retrieval.
- Task updates and deletion.
- Task assignment.
- Employee workload retrieval.
- Task filtering and pagination.
- Task comments.
- AI-powered operations.

The project also includes a `tests` directory for automated testing as the test suite is developed.

---

## Security Considerations

Security is an important part of the application's design.

The project incorporates or plans to incorporate the following measures:

- Password hashing with bcrypt.
- JWT-based authentication.
- Role-based access control.
- Protected API endpoints.
- Account activation and deactivation.
- Environment-based secret management.
- Database relationship constraints.
- Restricted access to user information.
- Centralized error handling.

Additional production-hardening measures will include request validation, rate limiting, secure HTTP headers, restricted CORS configuration, and appropriate API monitoring.

---

## Future Improvements

Potential improvements include:

- Real-time notifications.
- Email notifications for task assignments and deadlines.
- File attachments for tasks.
- Task labels and categories.
- Task dependency management.
- Advanced analytics and reporting dashboards.
- Team and department management.
- Advanced search capabilities.
- Swagger/OpenAPI documentation.
- Comprehensive automated testing.
- Docker containerization.
- Cloud deployment and CI/CD automation.
- Enhanced AI-powered productivity insights.

---

## Author

**Backend Developer**

This project is being developed as a practical backend engineering project to demonstrate skills in:

- RESTful API development.
- Node.js and Express.js.
- PostgreSQL database management.
- Prisma ORM.
- Authentication and authorization.
- Database relationships and migrations.
- Backend architecture and software design.
- AI API integration.
- API testing and debugging.

---

## Project Status

**Development Status:** In Progress

The core backend foundation, database design, authentication, user management, task management, and task assignment modules are being developed in stages. Collaboration features and Gemini AI integration are part of the remaining development roadmap.

---

### Acknowledgements

Built with a focus on clean code, modular architecture, secure API development, and practical application of backend engineering concepts.
