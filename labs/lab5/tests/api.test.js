/**
 * Backend API tests – Music Discovery (Express routes)
 * Run with: npm test
 */
import request from "supertest";
import { api } from "../netlify/functions/api.js";

describe("Music Discovery API", () => {
  it("should return health ok for GET /api/health", async () => {
    const res = await request(api).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("ok", true);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 400 for GET /api/search without q", async () => {
    const res = await request(api).get("/api/search");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/query parameter: q/i);
  });

  it("should return 400 for GET /api/related without id", async () => {
    const res = await request(api).get("/api/related");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/query parameter: id/i);
  });
});
