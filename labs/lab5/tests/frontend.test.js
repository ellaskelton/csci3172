/**
 * Frontend UI tests – Music Discovery (JSDOM)
 * Run with: npm test
 */
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(
  path.resolve(__dirname, "../frontend/index.html"),
  "utf8"
);

describe("Music Discovery UI", () => {
  let document;

  beforeEach(() => {
    const dom = new JSDOM(html);
    document = dom.window.document;
  });

  it("should have an artist search input", () => {
    const input = document.querySelector("#artist-query");
    expect(input).not.toBeNull();
    expect(input.getAttribute("type")).toBe("search");
  });

  it("should have a Search button", () => {
    const button = document.querySelector("#search-form button");
    expect(button).not.toBeNull();
    expect(button.textContent.trim()).toBe("Search");
  });

  it("should have a search form", () => {
    const form = document.querySelector("#search-form");
    expect(form).not.toBeNull();
  });

  it("should have results and related sections", () => {
    expect(document.querySelector("#results-section")).not.toBeNull();
    expect(document.querySelector("#related-section")).not.toBeNull();
  });
});
