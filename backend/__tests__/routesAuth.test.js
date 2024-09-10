"use strict";

const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("../routes/auth");
const User = require("../models/user");

const app = express();
app.use(bodyParser.json());
app.use("/auth", authRoutes);

describe("Auth Routes", () => {
    describe("POST /auth/register", () => {
        test("should register a new user", async () => {
            const userData = {
                username: "testuser",
                password: "password123",
                firstName: "Test",
                lastName: "User",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData)
                .expect(201);

            expect(response.body.token).toBeTruthy();

            // Optional: You can check the database to see if the user was created
            const user = await User.findByUsername(userData.username);
            expect(user).toBeTruthy();
        });

        test("should return an error for duplicate username", async () => {
            const userData = {
                username: "testuser",
                password: "password123",
                firstName: "Test",
                lastName: "User",
            };

            await User.register(userData);

            const response = await request(app)
                .post("/auth/register")
                .send(userData)
                .expect(400);

            expect(response.body.error).toBe("Username already exists");
        });
    });

    describe("POST /auth/token", () => {
        test("should authenticate and return a token", async () => {
            const userData = {
                username: "testuser",
                password: "password123",
            };

            await User.register(userData);

            const response = await request(app)
                .post("/auth/token")
                .send(userData)
                .expect(200);

            expect(response.body.token).toBeTruthy();
        });

        test("should return an error for invalid credentials", async () => {
            const userData = {
                username: "testuser",
                password: "wrongpassword",
            };

            const response = await request(app)
                .post("/auth/token")
                .send(userData)
                .expect(401);

            expect(response.body.error).toBe("Invalid credentials");
        });
    });
});
