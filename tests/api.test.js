/**
 * Backend API tests – Music Discovery (Express routes)
 * Run with: npm test
 */
import request from "supertest";
import { jest } from "@jest/globals";
import { api } from "../netlify/functions/api.js";

describe("Music Discovery API", () => {
  afterEach(() => {
    // Clean up any mocks on global.fetch between tests
    if (global.fetch && jest.isMockFunction(global.fetch)) {
      jest.restoreAllMocks();
    }
  });

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

  it("should return 400 for GET /api/related without name", async () => {
    const res = await request(api).get("/api/related");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/query parameter: name/i);
  });

  it("should map MusicBrainz search results to simplified items", async () => {
    // Mock MusicBrainz response
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        artists: [
          {
            id: "artist-1",
            name: "Test Artist",
            disambiguation: "rock band",
            country: "US",
          },
        ],
      }),
      text: async () => "",
    });

    const res = await request(api).get("/api/search?q=Test+Artist&limit=5");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0]).toEqual({
      id: "artist-1",
      name: "Test Artist",
      disambiguation: "rock band",
      country: "US",
    });
  });

  it("should return an array of related artists from /api/related", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        artists: [
          { id: "a1", name: "Similar One", disambiguation: "", country: "" },
          { id: "a2", name: "Similar Two", disambiguation: "pop", country: "CA" },
        ],
      }),
      text: async () => "",
    });

    const res = await request(api).get("/api/related?name=Example");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("name", "Similar One");
    expect(res.body[1]).toHaveProperty("disambiguation", "pop");
  });
});
