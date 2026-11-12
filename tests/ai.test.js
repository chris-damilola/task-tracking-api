import { test, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";

import app from "../src/app.js";
import prisma from "../src/config/database.js";

let managerId;
let employeeId;
let unrelatedEmployeeId;
let taskId;

let managerToken;
let unrelatedEmployeeToken;

const password = "TestPassword123!";

const managerEmail = `ai-manager-${randomUUID()}@example.com`;
const employeeEmail = `ai-employee-${randomUUID()}@example.com`;
const unrelatedEmployeeEmail = `ai-unrelated-${randomUUID()}@example.com`;

const endpoints = [
  "summarize",
  "recommend-status",
  "recommend-priority",
  "estimate-effort",
];

// CLEAN UP TEST DATA
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

  if (unrelatedEmployeeId) {
    await prisma.user.deleteMany({
      where: { id: unrelatedEmployeeId },
    });
  }
});

test("Gemini AI API security tests", async (t) => {
  // CREATE TEST USERS
  await t.test("Should create manager and two employees", async () => {
    const hashedPassword = await bcrypt.hash(password, 12);

    const manager = await prisma.user.create({
      data: {
        name: "AI Test Manager",
        email: managerEmail,
        password: hashedPassword,
        role: "MANAGER",
      },
    });

    managerId = manager.id;

    const employee = await prisma.user.create({
      data: {
        name: "AI Assigned Employee",
        email: employeeEmail,
        password: hashedPassword,
        role: "EMPLOYEE",
      },
    });

    employeeId = employee.id;

    const unrelatedEmployee = await prisma.user.create({
      data: {
        name: "AI Unassigned Employee",
        email: unrelatedEmployeeEmail,
        password: hashedPassword,
        role: "EMPLOYEE",
      },
    });

    unrelatedEmployeeId = unrelatedEmployee.id;
  });

  // LOGIN MANAGER
  await t.test("Should login manager", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: managerEmail,
      password,
    });

    assert.equal(response.status, 200);

    managerToken = response.body.token || response.body.data?.token;

    assert.ok(managerToken);
  });

  // LOGIN UNASSIGNED EMPLOYEE
  await t.test("Should login unrelated employee", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: unrelatedEmployeeEmail,
      password,
    });

    assert.equal(response.status, 200);

    unrelatedEmployeeToken = response.body.token || response.body.data?.token;

    assert.ok(unrelatedEmployeeToken);
  });

  // CREATE TASK ASSIGNED TO THE FIRST EMPLOYEE
  await t.test("Should create AI test task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        title: "AI Testing Task",
        description: "Testing Gemini AI endpoint authorization.",
        priority: "MEDIUM",
        assignedToId: employeeId,
      });

    assert.equal(response.status, 201);

    const task = response.body.data?.task || response.body.data;

    taskId = task?.id;

    assert.ok(taskId);
  });

  // TEST ALL FOUR AI ENDPOINTS WITHOUT TOKEN
  for (const endpoint of endpoints) {
    await t.test(
      `Should reject unauthenticated ${endpoint} request`,
      async () => {
        const response = await request(app).post(
          `/api/ai/tasks/${taskId}/${endpoint}`,
        );

        assert.equal(response.status, 401);
        assert.equal(response.body.success, false);
      },
    );
  }

  // TEST INVALID TASK ID
  await t.test("Should reject invalid task ID", async () => {
    const response = await request(app)
      .post("/api/ai/tasks/invalid-id/summarize")
      .set("Authorization", `Bearer ${managerToken}`);

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  // TEST ALL FOUR AI ENDPOINTS WITH AN UNASSIGNED EMPLOYEE
  for (const endpoint of endpoints) {
    await t.test(
      `Should reject unassigned employee from ${endpoint}`,
      async () => {
        const response = await request(app)
          .post(`/api/ai/tasks/${taskId}/${endpoint}`)
          .set("Authorization", `Bearer ${unrelatedEmployeeToken}`);

        assert.equal(response.status, 403);
        assert.equal(response.body.success, false);
      },
    );
  }
});
