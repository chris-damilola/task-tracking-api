import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { randomUUID } from "node:crypto";

import app from "../src/app.js";
import prisma from "../src/config/database.js";

let testEmail;
let testPassword = "TestPassword123!";
let authToken;
let registeredUserId;

before(() => {
  testEmail = `test-${randomUUID()}@example.com`;
});

after(async () => {
  // Remove the test user after testing.
  if (registeredUserId) {
    await prisma.user.deleteMany({
      where: {
        id: registeredUserId,
      },
    });
  }
});

test("Authentication API tests", async (t) => {
  // TEST 1: Register a new employee
  await t.test("Should register a new employee", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test Employee",
      email: testEmail,
      password: testPassword,
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);

    registeredUserId = response.body.user?.id || response.body.data?.user?.id;

    assert.ok(registeredUserId);
  });

  // TEST 2: Prevent duplicate email registration
  await t.test("Should reject duplicate email registration", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Another Employee",
      email: testEmail,
      password: testPassword,
    });

    assert.equal(response.status, 409);
    assert.equal(response.body.success, false);
  });

  // TEST 3: Reject invalid registration details
  await t.test("Should reject invalid registration details", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "A",
      email: "invalid-email",
      password: "123",
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  await t.test("Should reject registration with invalid email", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test Employee",
      email: "invalid-email",
      password: "TestPassword123!",
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  await t.test("Should reject registration with a short password", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Employee",
        email: `short-password-${randomUUID()}@example.com`,
        password: "123",
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  await t.test("Should reject registration without a name", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: `no-name-${randomUUID()}@example.com`,
        password: "TestPassword123!",
      });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
  });

  // TEST 4: Login with correct credentials
  await t.test("Should login successfully", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: testPassword,
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);

    authToken = response.body.token || response.body.data?.token;

    assert.ok(authToken, "Login should return a JWT token");
  });

  // TEST 5: Reject incorrect password
  await t.test("Should reject incorrect password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "WrongPassword123!",
    });

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
  });

  // TEST 6: Access protected profile
  await t.test("Should return authenticated user details", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${authToken}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });

  // TEST 7: Reject request without token
  await t.test(
    "Should reject access without authentication token",
    async () => {
      const response = await request(app).get("/api/auth/me");

      assert.equal(response.status, 401);
      assert.equal(response.body.success, false);
    },
  );
});
