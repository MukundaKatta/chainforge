import { describe, it, expect } from "vitest";
import { Chainforge } from "../src/core.js";
describe("Chainforge", () => {
  it("init", () => { expect(new Chainforge().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Chainforge(); await c.generate(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Chainforge(); await c.generate(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
