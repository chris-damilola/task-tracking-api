# Internal Task & Ticket Tracking API with Gemini AI Assistance

A secure, role-based task and ticket tracking REST API built with **Node.js, Express.js, PostgreSQL, Prisma ORM, and Google Gemini AI**.

The system helps organizations manage internal tasks, assign responsibilities, monitor employee workloads, track progress, and improve team collaboration. It also integrates Google Gemini AI to provide intelligent task summaries, status recommendations, priority recommendations, and effort estimations.

## Project Overview

The Internal Task & Ticket Tracking API is a backend application designed to simplify task management and improve productivity within organizations.

It provides a centralized system where managers can create tasks, assign employees, monitor progress, and manage team workloads, while employees can access assigned tasks, update their progress, and collaborate through comments.

The application also integrates Google's Gemini AI to analyze task information and provide intelligent recommendations that support better decision-making.

Unlike traditional task management systems, this application combines task management, team collaboration, role-based access control, and AI-powered assistance in one backend solution.

---

## Key Features

### 1. Authentication and User Management

- Employee registration.
- Secure user login.
- JWT-based authentication.
- Password hashing with bcrypt.
- Retrieve authenticated user details.
- Update user profile information.
- Role management.
- User activation and deactivation.
- Protected routes and authorization middleware.

### 2. Task Management

- Create new tasks.
- Retrieve all accessible tasks.
- Retrieve individual task details.
- Update task information.
- Delete tasks.
- Assign priorities.
- Set task deadlines.
- Estimate task completion hours.
- Update task statuses.
- Search and filter tasks.
- Pagination support.

### 3. Task Assignment and Workload Management

- Assign tasks to employees.
- Reassign tasks when necessary.
- Retrieve tasks assigned to the authenticated employee.
- Monitor employee workloads.
- Group tasks by their current status.
- Restrict assignment operations based on user roles.

### 4. Team Collaboration

- Add comments to tasks.
- Retrieve task discussions.
- Edit comments.
- Delete comments.
- Restrict comment modifications based on ownership.
- Track task activities.

### 5. AI-Powered Assistance

Powered by Google Gemini AI.

- Generate summaries of task discussions.
- Recommend appropriate task statuses.
- Recommend task priorities.
- Estimate task completion effort.
- Provide explanations for AI recommendations.

**Important:** AI-generated recommendations do not automatically modify task records. Users retain control over task updates and decisions.

### 6. API Documentation

- Interactive Swagger/OpenAPI documentation.
- Documented request parameters.
- Request body specifications.
- Authentication support through Bearer tokens.
- Documented API responses.
- Interactive endpoint testing.

### 7. Automated Testing

- Authentication tests.
- User management tests.
- Task management tests.
- Task assignment tests.
- Collaboration tests.
- AI endpoint security tests.
- Health check tests.
- Request validation tests.

---

## Technology Stack

| Technology          | Purpose                         |
| ------------------- | ------------------------------- |
| Node.js             | JavaScript runtime              |
| Express.js          | Backend web framework           |
| PostgreSQL          | Relational database             |
| Prisma ORM          | Database access and management  |
| Google Gemini AI    | AI-powered task assistance      |
| JWT                 | Authentication                  |
| bcryptjs            | Password hashing                |
| Zod                 | Request validation              |
| Helmet              | HTTP security headers           |
| express-rate-limit  | API rate limiting               |
| Pino                | Application logging             |
| Supertest           | API integration testing         |
| Node.js Test Runner | Automated testing               |
| Swagger UI          | Interactive API documentation   |
| dotenv              | Environment variable management |

---

## System Architecture

The application follows a modular MVC-inspired architecture.

The main components include:

- **Routes:** Define API endpoints.
- **Controllers:** Handle incoming requests and responses.
- **Middleware:** Manage authentication, authorization, validation, and security.
- **Services:** Handle reusable business logic and external integrations.
- **Configuration:** Manage database connections, logging, and AI configuration.
- **Prisma:** Communicates with PostgreSQL.
- **Gemini AI:** Processes task information and generates recommendations.

### Request Flow

```text
             CLIENT
                |
                v
          EXPRESS SERVER
                |
                v
          ROUTE HANDLERS
                |
                v
           MIDDLEWARE
                |
        -------------------
        |                 |
   Authentication     Validation
        |                 |
        -------------------
                |
                v
           CONTROLLERS
                |
        -------------------
        |                 |
        v                 v
    PRISMA ORM        GEMINI AI
        |                 |
        v                 |
     POSTGRESQL           |
        |                 |
        -------------------
                |
                v
          JSON RESPONSE
                |
                v
             CLIENT
```

---

## User Roles and Permissions

The application supports three user roles.

| Feature               | Admin     | Manager           | Employee       |
| --------------------- | --------- | ----------------- | -------------- |
| Register account      | Yes       | Yes               | Yes            |
| Login                 | Yes       | Yes               | Yes            |
| View user accounts    | All users | Employees         | Own profile    |
| Update profile        | Yes       | Yes               | Yes            |
| Manage user roles     | Yes       | No                | No             |
| Deactivate users      | Yes       | No                | No             |
| Create tasks          | Yes       | Yes               | No             |
| View accessible tasks | All tasks | Created tasks     | Assigned tasks |
| Update task details   | Yes       | Own created tasks | No             |
| Assign tasks          | Yes       | Own created tasks | No             |
| Update task status    | Yes       | Accessible tasks  | Assigned tasks |
| Delete tasks          | Yes       | Own created tasks | No             |
| Comment on tasks      | Yes       | Accessible tasks  | Assigned tasks |
| Use AI assistance     | Yes       | Accessible tasks  | Assigned tasks |

Authorization is enforced on the backend rather than relying on frontend restrictions.

---

## AI-Powered Features

The application integrates Google Gemini AI through the `@google/genai` SDK.

Four AI capabilities are provided.

### 1. Task Discussion Summarization

Analyzes task details and discussion comments to generate:

- A concise task summary.
- Key discussion points.
- Identified blockers.
- Suggested next actions.

### 2. Task Status Recommendation

Analyzes task information and comments to recommend one of the following statuses:

- TODO
- IN_PROGRESS
- IN_REVIEW
- BLOCKED
- COMPLETED

### 3. Task Priority Recommendation

Evaluates task information to recommend an appropriate priority:

- LOW
- MEDIUM
- HIGH
- URGENT

### 4. Task Effort Estimation

Analyzes task requirements and discussions to estimate the number of hours needed to complete a task.

AI recommendations include explanations and are not automatically applied to the database.

---

## Project Structure

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
│   ├── config/
│   │   ├── database.js
│   │   ├── gemini.js
│   │   ├── logger.js
│   │   └── swagger.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── taskController.js
│   │   ├── commentController.js
│   │   └── aiController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── validate.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
|   |   ├── notFound.js
│   │   └── requestLogger.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
|   |   ├── healthRoutes.js
│   │   ├── userRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── commentRoutes.js
│   │   └── aiRoutes.js
│   │
│   ├── services/
│   │   └── geminiService.js
│   │
│   ├── validators/
|   |   └── schema.js
│   │
│   │
│   ├── app.js
│   └── check-db.js
│
├── tests/
│   ├── health.test.js
│   ├── auth.test.js
│   ├── user.test.js
│   ├── task.test.js
│   ├── collaboration.test.js
│   └── ai.test.js
│
├── .env
├── .env.example
├── .env.test
├── .gitignore
├── package.json
├── create-admin.js
├── package-lock.json
├── prisma7.config.ts
├── server.js
└── README.md
```

_Note: Adjust the file tree to match your final repository. Remove any files that do not exist and include any additional files you have created._

---

## Database Models

The application uses PostgreSQL with Prisma ORM.

### 1. User

Stores user information, authentication credentials, roles, and account status.

Important fields:

- id
- name
- email
- password
- role
- isActive
- createdAt
- updatedAt

### 2. Task

Stores task information, assignment details, priority, and progress.

Important fields:

- id
- title
- description
- status
- priority
- dueDate
- estimatedHours
- createdById
- assignedToId
- createdAt
- updatedAt

### 3. Comment

Stores discussions and comments associated with tasks.

Important fields:

- id
- content
- taskId
- authorId
- createdAt
- updatedAt

### 4. TaskActivity

Maintains a record of important task activities.

Examples include:

- TASK_CREATED
- TASK_ASSIGNED
- STATUS_CHANGED
- PRIORITY_CHANGED
- TASK_UPDATED
- COMMENT_ADDED

---

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Ensure you have installed:

- Node.js
- npm
- PostgreSQL
- Git
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/chris-damilola/task-tracking-api.git
```

### 2. Navigate into the project

```bash
cd task-tracking-API
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create your environment file

Create a `.env` file in the root directory.

Use `.env.example` as your reference.

### 5. Configure your database

Create a PostgreSQL database named:

```text
task_tracking_db
```

Configure your database connection string in `.env`.

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Run database migrations

```bash
npx prisma migrate dev
```

This creates the database tables based on your Prisma schema and applies pending migrations.

### 8. Start the development server

```bash
npm run dev
```

The application should start at:

```text
http://localhost:5000
```

---

## Environment Variables

The application requires environment variables for database connectivity, authentication, and AI integration.

Example `.env.example`:

```env
PORT=5000

NODE_ENV=development

DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/task_tracking_db?schema=public"

JWT_SECRET="your_long_random_secret"

JWT_EXPIRES_IN="1d"

GEMINI_API_KEY="your_gemini_api_key"

GEMINI_MODEL="gemini-3.5-flash-lite"

CORS_ORIGINS="http://localhost:3000"
```

### Environment Variable Description

| Variable       | Description                       |
| -------------- | --------------------------------- |
| PORT           | Application port                  |
| NODE_ENV       | Application environment           |
| DATABASE_URL   | PostgreSQL connection string      |
| JWT_SECRET     | Secret used to sign JWT tokens    |
| JWT_EXPIRES_IN | JWT expiration duration           |
| GEMINI_API_KEY | Google Gemini API key             |
| GEMINI_MODEL   | Gemini model used for AI requests |
| CORS_ORIGINS   | Allowed frontend origins          |

**Security Notice:**

- Never commit your actual `.env` file.
- Never expose your Gemini API key.
- Never expose your JWT secret.
- Use strong, unique secrets in production.
- Configure production environment variables through your hosting provider.

---

## Database Setup

This project uses Prisma ORM with PostgreSQL.

Useful Prisma commands:

| Command                              | Purpose                                  |
| ------------------------------------ | ---------------------------------------- |
| `npx prisma validate`                | Validate Prisma schema                   |
| `npx prisma generate`                | Generate Prisma Client                   |
| `npx prisma migrate dev --name init` | Create and apply a development migration |
| `npx prisma migrate deploy`          | Apply existing migrations in production  |
| `npx prisma studio`                  | Open Prisma Studio                       |
| `npx prisma migrate status`          | Check migration status                   |

For production, use:

```bash
npx prisma migrate deploy
```

Avoid using `prisma migrate dev` against your production database.

---

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Health Check

```http
GET /api/health
```

Expected successful response:

```json
{
  "success": true,
  "message": "Database connection is healthy.",
  "database": "connected"
}
```

The exact response message may differ slightly depending on your implementation.

---

## API Documentation

The application uses Swagger UI to provide interactive API documentation.

Once the server is running, visit:

```text
http://localhost:5000/api-docs
```

Swagger allows developers to:

- Explore available endpoints.
- View request and response structures.
- Understand authentication requirements.
- Provide request parameters.
- Test API endpoints directly.
- Authorize requests using JWT Bearer tokens.

---

## API Endpoints

All endpoints use the `/api` prefix unless otherwise stated.

### Authentication

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/register` | Register a new employee     |
| POST   | `/api/auth/login`    | Authenticate a user         |
| GET    | `/api/auth/me`       | Retrieve authenticated user |

### User Management

| Method | Endpoint                    | Description               |
| ------ | --------------------------- | ------------------------- |
| GET    | `/api/users`                | Retrieve accessible users |
| GET    | `/api/users/:id`            | Retrieve a user           |
| PATCH  | `/api/users/:id`            | Update user profile       |
| PATCH  | `/api/users/:id/role`       | Update user role          |
| PATCH  | `/api/users/:id/deactivate` | Deactivate user           |
| PATCH  | `/api/users/:id/reactivate` | Reactivate user           |

### Task Management

| Method | Endpoint                      | Description                |
| ------ | ----------------------------- | -------------------------- |
| POST   | `/api/tasks`                  | Create a task              |
| GET    | `/api/tasks`                  | Retrieve accessible tasks  |
| GET    | `/api/tasks/:id`              | Retrieve a task            |
| PATCH  | `/api/tasks/:id`              | Update task details        |
| PATCH  | `/api/tasks/:id/status`       | Update task status         |
| DELETE | `/api/tasks/:id`              | Delete a task              |
| GET    | `/api/tasks/my/assigned`      | Retrieve assigned tasks    |
| PATCH  | `/api/tasks/:id/assign`       | Assign a task              |
| GET    | `/api/tasks/workload/:userId` | Retrieve employee workload |

### Comments and Collaboration

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| POST   | `/api/tasks/:taskId/comments` | Add a task comment     |
| GET    | `/api/tasks/:taskId/comments` | Retrieve task comments |
| PATCH  | `/api/comments/:commentId`    | Update a comment       |
| DELETE | `/api/comments/:commentId`    | Delete a comment       |

### AI Assistance

| Method | Endpoint                                   | Description               |
| ------ | ------------------------------------------ | ------------------------- |
| POST   | `/api/ai/tasks/:taskId/summarize`          | Summarize task discussion |
| POST   | `/api/ai/tasks/:taskId/recommend-status`   | Recommend task status     |
| POST   | `/api/ai/tasks/:taskId/recommend-priority` | Recommend task priority   |
| POST   | `/api/ai/tasks/:taskId/estimate-effort`    | Estimate task effort      |

### Health Check

| Method | Endpoint      | Description                   |
| ------ | ------------- | ----------------------------- |
| GET    | `/api/health` | Check API and database health |

For detailed request bodies, response examples, and authorization requirements, visit the Swagger documentation.

---

## Authentication

The application uses JSON Web Tokens (JWT) for authentication.

### Authentication Workflow

1. A user registers an account.
2. The password is hashed using bcrypt.
3. The user logs in with their email and password.
4. The API verifies the credentials.
5. A JWT is generated and returned.
6. The client includes the token in subsequent protected requests.

### Authorization Header

Protected endpoints require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The authentication middleware verifies the token and retrieves the user's current account details before granting access.

---

## Security Features

Security is an important part of this application.

The following security measures are implemented:

- **Password Hashing:** bcryptjs protects stored passwords.
- **JWT Authentication:** Protects private API endpoints.
- **Role-Based Access Control:** Restricts operations based on user roles.
- **Resource Ownership Checks:** Prevents unauthorized access to tasks and comments.
- **Zod Validation:** Validates incoming request data.
- **Helmet:** Adds security-related HTTP headers.
- **Rate Limiting:** Restricts excessive API requests.
- **CORS Configuration:** Controls permitted cross-origin requests.
- **Centralized Error Handling:** Provides consistent error responses.
- **Secure Environment Variables:** Keeps sensitive credentials outside source code.
- **AI Request Protection:** Limits access to protected AI endpoints and controls request frequency.

---

## Testing

The project uses Node.js's built-in test runner and Supertest for automated API testing.

### Run the test suite

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Test Coverage

The automated test suite covers:

| Test File               | Description                                     |
| ----------------------- | ----------------------------------------------- |
| `health.test.js`        | API and database health checks                  |
| `auth.test.js`          | Registration, login, and authentication         |
| `user.test.js`          | User management and permissions                 |
| `task.test.js`          | Task creation, retrieval, updates, and deletion |
| `collaboration.test.js` | Task assignments, workload, and comments        |
| `ai.test.js`            | AI endpoint authentication and authorization    |

The project uses a separate test database to prevent automated tests from modifying development data.

Before running tests, ensure your `.env.test` file is configured and the test database migrations have been applied.

---

## Error Handling

The application uses centralized error handling to provide consistent API responses.

Examples of common HTTP status codes:

| Status Code | Meaning                             |
| ----------- | ----------------------------------- |
| 200         | Request successful                  |
| 201         | Resource created successfully       |
| 400         | Invalid request or validation error |
| 401         | Authentication required             |
| 403         | Access forbidden                    |
| 404         | Resource not found                  |
| 409         | Resource conflict                   |
| 429         | Too many requests                   |
| 500         | Internal server error               |
| 502         | External AI service error           |

---

## Deployment

The application is prepared for deployment to a production hosting platform such as Render.

A production deployment requires:

1. Push the project to GitHub.
2. Create a hosted PostgreSQL database.
3. Create a web service on Render.
4. Connect the GitHub repository.
5. Configure production environment variables.
6. Configure the production database connection.
7. Apply Prisma migrations.
8. Deploy the application.
9. Test the deployed API health endpoint.
10. Verify Swagger documentation and protected endpoints.

### Recommended Render Configuration

| Setting       | Value                                |
| ------------- | ------------------------------------ |
| Runtime       | Node.js                              |
| Build Command | `npm install && npx prisma generate` |
| Start Command | `npm start`                          |

Set the following environment variables in Render:

- `NODE_ENV=production`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `CORS_ORIGINS`

Use the actual hosted PostgreSQL connection string and a strong production JWT secret.

Apply migrations as part of your production deployment process using:

```bash
npx prisma migrate deploy
```

Do not deploy until your production environment variables and database configuration have been verified.

---

## Future Improvements

Potential future enhancements include:

- Frontend dashboard integration.
- Real-time task notifications.
- Email notifications for task assignments and deadlines.
- File attachments for tasks.
- Advanced task filtering and sorting.
- Team and department management.
- Task history and audit log improvements.
- AI-powered workload optimization.
- Advanced analytics and reporting.
- Docker containerization.
- CI/CD automation with GitHub Actions.
- Refresh token authentication.

---

## Author

**Backend Developer**

Developed as an internal task and ticket tracking system with AI-powered assistance.

### Technologies and Skills Demonstrated

- REST API Development
- Node.js and Express.js
- PostgreSQL Database Design
- Prisma ORM
- Authentication and Authorization
- Role-Based Access Control
- API Security
- Input Validation
- AI API Integration
- Automated Testing
- API Documentation
- Backend Architecture

---

## License

This project is licensed under the ISC License.

---

**Built with Node.js, Express, PostgreSQL, Prisma, and Google Gemini AI.**
