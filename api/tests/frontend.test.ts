import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../web");

describe("frontend separado", () => {
  it("não concentra mais a aplicação em um único HTML", () => {
    const html = readFileSync(path.join(web, "index.html"), "utf8");
    const css = readFileSync(path.join(web, "css/app.css"), "utf8");
    const js = readFileSync(path.join(web, "js/app.js"), "utf8");
    expect(html).toContain('href="css/app.css"');
    expect(html).toContain('src="js/app.js"');
    expect(html).toContain("serviceWorker.register('sw.js')");
    expect(existsSync(path.join(web, "sw.js"))).toBe(true);
    expect(html).not.toContain("<style>");
    expect(css).toContain("--blue");
    expect(js).toContain("function renderDashboard");
    expect(js).toContain("prodfy_sync_v1");
    expect(js).toContain("/api/production/sync");
    expect(js).not.toContain("assets/photos/");
    expect(js).not.toContain("Carlos Almeida");
    expect(js).not.toContain("data:image/jpeg;base64");
    expect(existsSync(path.join(web, "assets/photos/01.jpg"))).toBe(false);
    expect(existsSync(path.join(web, "conta.html"))).toBe(true);
    expect(existsSync(path.join(web, "js/config.js"))).toBe(true);
  });
});
