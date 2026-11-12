import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { randomUUID } from "node:crypto";

import app from "../src/app.js";
import prisma from "../src/config/database.js";

let testEmail;
let testPassword = "TestPassword123!";
let authToken;
let userId;

before(() => {
  testEmail = `user-test-${randomUUID()}@example.com`;
});

after(async () => {
  if (userId) {
    await prisma.user.deleteMany({
      where: { id: userId },
    });
  }
});

test("User Management API tests", async (t) => {
  // TEST 1: Register a test employee
  await t.test("Should create a test employee", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "User Test Employee",
      email: testEmail,
      password: testPassword,
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);

    userId = response.body.user?.id || response.body.data?.user?.id;

    assert.ok(userId);
  });

  // TEST 2: Login
  await t.test("Should login the test employee", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: testPassword,
    });

    assert.equal(response.status, 200);

    authToken = response.body.token || response.body.data?.token;

    assert.ok(authToken);
  });

  // TEST 3: Get own user profile
  await t.test("Should retrieve own user profile", async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${authToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });

  // TEST 4: Update own profile
  await t.test("Should update own profile", async () => {
    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Updated Test Employee",
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });

  // TEST 5: Reject access without token
  await t.test("Should reject access without token", async () => {
    const response = await request(app).get(`/api/users/${userId}`);

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
  });

  // TEST 6: Employee cannot view all users
  await t.test("Should prevent employees from viewing all users", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${authToken}`);

    assert.equal(response.status, 403);
    assert.equal(response.body.success, false);
  });
});
