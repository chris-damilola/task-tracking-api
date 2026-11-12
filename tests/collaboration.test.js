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
let commentId;

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

test("Task Collaboration API tests", async (t) => {
  // SETUP: CREATE TEST USERS
  await t.test("Should create manager and employee", async () => {
    const hashedPassword = await bcrypt.hash(password, 12);

    const manager = await prisma.user.create({
      data: {
        name: "Collaboration Manager",
        email: managerEmail,
        password: hashedPassword,
        role: "MANAGER",
      },
    });

    managerId = manager.id;

    const employee = await prisma.user.create({
      data: {
        name: "Collaboration Employee",
        email: employeeEmail,
        password: hashedPassword,
        role: "EMPLOYEE",
      },
    });

    employeeId = employee.id;
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

  // LOGIN EMPLOYEE
  await t.test("Should login employee", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: employeeEmail,
      password,
    });

    assert.equal(response.status, 200);

    employeeToken = response.body.token || response.body.data?.token;

    assert.ok(employeeToken);
  });

  // CREATE TASK
  await t.test("Should create an unassigned task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        title: "Collaboration Testing Task",
        description: "Testing task assignment and comments.",
        priority: "MEDIUM",
      });

    assert.equal(response.status, 201);

    const task = response.body.data?.task || response.body.data;

    taskId = task?.id;

    assert.ok(taskId);
  });

  // ASSIGN TASK
  await t.test("Should assign task to employee", async () => {
    const response = await request(app)
      .patch(`/api/tasks/${taskId}/assign`)
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        assignedToId: employeeId,
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });

  // GET EMPLOYEE WORKLOAD
  await t.test("Should retrieve employee workload", async () => {
    const response = await request(app)
      .get(`/api/tasks/workload/${employeeId}`)
      .set("Authorization", `Bearer ${managerToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });

  // EMPLOYEE CANNOT ASSIGN TASKS
  await t.test("Should prevent employee from assigning tasks", async () => {
    const response = await request(app)
      .patch(`/api/tasks/${taskId}/assign`)
      .set("Authorization", `Bearer ${employeeToken}`)
      .send({
        assignedToId: employeeId,
      });

    assert.equal(response.status, 403);
    assert.equal(response.body.success, false);
  });

  // REJECT EMPTY COMMENT
  await t.test("Should reject empty comment", async () => {
    const response = await request(app)
      .post(`/api/tasks/${taskId}/comments`)
      .set("Authorization", `Bearer ${employeeToken}`)
      .send({
        content: "",
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  // REJECT WHITESPACE-ONLY COMMENT
  await t.test("Should reject whitespace-only comment", async () => {
    const response = await request(app)
      .post(`/api/tasks/${taskId}/comments`)
      .set("Authorization", `Bearer ${employeeToken}`)
      .send({
        content: "     ",
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  // REJECT COMMENT EXCEEDING 5000 CHARACTERS
  await t.test("Should reject comment exceeding 5000 characters", async () => {
    const response = await request(app)
      .post(`/api/tasks/${taskId}/comments`)
      .set("Authorization", `Bearer ${employeeToken}`)
      .send({
        content: "A".repeat(5001),
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  // CREATE COMMENT
  await t.test("Should allow assigned employee to comment", async () => {
    const response = await request(app)
      .post(`/api/tasks/${taskId}/comments`)
      .set("Authorization", `Bearer ${employeeToken}`)
      .send({
        content: "I have started working on this task.",
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);

    const comment = response.body.data?.comment || response.body.data;

    commentId = comment?.id;

    assert.ok(commentId);
  });

  // GET COMMENTS
  await t.test("Should retrieve task comments", async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}/comments`)
      .set("Authorization", `Bearer ${employeeToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });

  // UPDATE COMMENT
  await t.test("Should allow author to update comment", async () => {
    const response = await request(app)
      .patch(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${employeeToken}`)
      .send({
        content: "I have completed the first part of this task.",
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });

  // DELETE COMMENT
  await t.test("Should allow author to delete comment", async () => {
    const response = await request(app)
      .delete(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${employeeToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);

    commentId = null;
  });

  // EMPLOYEE CAN VIEW ASSIGNED TASKS
  await t.test("Should retrieve assigned tasks", async () => {
    const response = await request(app)
      .get("/api/tasks/my/assigned")
      .set("Authorization", `Bearer ${employeeToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });
});
