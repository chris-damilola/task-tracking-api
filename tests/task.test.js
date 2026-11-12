import { test, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";

import app from "../src/app.js";
import prisma from "../src/config/database.js";

let managerId;
let employeeId;
let taskId;

let managerToken;
let employeeToken;

const password = "TestPassword123!";

const managerEmail = `manager-${randomUUID()}@example.com`;
const employeeEmail = `employee-${randomUUID()}@example.com`;

after(async () => {
  if (taskId) {
    await prisma.task.deleteMany({
      where: { id: taskId },
    });
  }

  if (managerId) {
    await prisma.user.deleteMany({
      where: { id: managerId },
    });
  }

  if (employeeId) {
    await prisma.user.deleteMany({
      where: { id: employeeId },
    });
  }
});

test("Task Management API tests", async (t) => {
  // SETUP: Create manager and employee
  await t.test("Should create test manager and employee", async () => {
    const hashedPassword = await bcrypt.hash(password, 12);

    const manager = await prisma.user.create({
      data: {
        name: "Test Manager",
        email: managerEmail,
        password: hashedPassword,
        role: "MANAGER",
      },
    });

    managerId = manager.id;

    const employee = await prisma.user.create({
      data: {
        name: "Test Task Employee",
        email: employeeEmail,
        password: hashedPassword,
        role: "EMPLOYEE",
      },
    });

    employeeId = employee.id;
  });

  // LOGIN MANAGER
  await t.test("Should login test manager", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: managerEmail,
      password,
    });

    assert.equal(response.status, 200);

    managerToken = response.body.token || response.body.data?.token;

    assert.ok(managerToken);
  });

  // LOGIN EMPLOYEE
  await t.test("Should login test employee", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: employeeEmail,
      password,
    });

    assert.equal(response.status, 200);

    employeeToken = response.body.token || response.body.data?.token;

    assert.ok(employeeToken);
  });

  // REJECT TASK WITHOUT TITLE
  await t.test("Should reject task without title", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        description: "Task without a title",
        priority: "HIGH",
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  // REJECT INVALID TASK PRIORITY
  await t.test("Should reject invalid task priority", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        title: "Invalid Priority Task",
        priority: "SUPER_HIGH",
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  // REJECT INVALID DUE DATE
  await t.test("Should reject invalid task due date", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        title: "Invalid Date Task",
        priority: "HIGH",
        dueDate: "not-a-valid-date",
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  // REJECT INVALID ESTIMATED HOURS
  await t.test("Should reject invalid estimated hours", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        title: "Invalid Hours Task",
        estimatedHours: -5,
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });
  // TEST 1: CREATE TASK
  await t.test("Should create a new task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        title: "Automated Testing Task",
        description: "Testing task creation using Supertest.",
        priority: "HIGH",
        assignedToId: employeeId,
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);

    const task = response.body.data?.task || response.body.data;

    taskId = task?.id;

    assert.ok(taskId);
  });

  await t.test("Should reject task update with empty title", async () => {
    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        title: "",
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  await t.test(
    "Should reject invalid priority during task update",
    async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          priority: "EXTREME",
        });

      assert.equal(response.status, 400);
      assert.equal(response.body.success, false);
    },
  );

  await t.test("Should reject invalid task status", async () => {
    const response = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set("Authorization", `Bearer ${employeeToken}`)
      .send({
        status: "STARTED",
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  await t.test("Should return 404 for nonexistent task", async () => {
    const nonexistentTaskId = randomUUID();

    const response = await request(app)
      .get(`/api/tasks/${nonexistentTaskId}`)
      .set("Authorization", `Bearer ${managerToken}`);

    assert.equal(response.status, 404);
    assert.equal(response.body.success, false);
  });

  // TEST 2: GET TASK
  await t.test("Should retrieve a task by ID", async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${managerToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });

  // TEST 3: GET ALL TASKS
  await t.test("Should retrieve accessible tasks", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${managerToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });

  // TEST 4: UPDATE TASK
  await t.test("Should update task information", async () => {
    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        title: "Updated Automated Testing Task",
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });

  // TEST 5: UPDATE TASK STATUS
  await t.test(
    "Should allow assigned employee to update task status",
    async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskId}/status`)
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({
          status: "IN_PROGRESS",
        });

      assert.equal(response.status, 200);
      assert.equal(response.body.success, true);
    },
  );

  // TEST 6: EMPLOYEE CANNOT UPDATE TASK DETAILS
  await t.test(
    "Should prevent employee from editing task details",
    async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({
          title: "Unauthorized Update",
        });

      assert.equal(response.status, 403);
      assert.equal(response.body.success, false);
    },
  );

  // TEST 7: GET MY ASSIGNED TASKS
  await t.test("Should retrieve employee assigned tasks", async () => {
    const response = await request(app)
      .get("/api/tasks/my/assigned")
      .set("Authorization", `Bearer ${employeeToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });

  // TEST 8: REJECT UNAUTHENTICATED REQUEST
  await t.test("Should reject requests without authentication", async () => {
    const response = await request(app).get(`/api/tasks/${taskId}`);

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
  });

  // TEST 9: DELETE TASK
  await t.test("Should delete task", async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${managerToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);

    taskId = null;
  });
});
