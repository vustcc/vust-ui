import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { glassTokens } from "../../packages/tokens/dist/glass.js";
import { glassNumber } from "../../packages/vue/src/internal/glass-tokens";
import { resolveGlass } from "../../packages/vue/src/glass";

describe("shared material tokens consumed by Vue", () => {
  it("ships the same default declarations to CSS and JS consumers", () => {
    const css = readFileSync(resolve("packages/tokens/dist/glass.css"), "utf8");
    const source = readFileSync(
      resolve("packages/tokens/src/glass.css"),
      "utf8",
    );
    expect(css).toBe(source);
    const defaults = css.match(/:root\s*\{([^}]+)\}/)![1];
    const declarations = Object.fromEntries(
      [...defaults.matchAll(/(--vdl-glass-[\w-]+)\s*:\s*([^;]+);/g)].map(
        ([, key, value]) => [key, value.trim()],
      ),
    );
    expect(glassTokens).toEqual(declarations);
  });

  it("resolves inherited profile defaults before explicit component controls", () => {
    const tokens = {
      ...glassTokens,
      "--vdl-glass-control-opacity": "0.3",
      "--vdl-glass-control-refraction": "0.8",
    };
    expect(resolveGlass(undefined, "control", tokens).opacity).toBeCloseTo(0.3);
    expect(resolveGlass(undefined, "control", tokens).refraction).toBe(0.8);
    expect(resolveGlass({ intensity: 0.5 }, "control", tokens)).toMatchObject({
      opacity: 0.65,
      refraction: 0.4,
    });
    expect(
      resolveGlass({ opacity: 0.9, refraction: 0 }, "control", tokens),
    ).toMatchObject({ opacity: 0.9, refraction: 0 });
  });

  it("uses generated defaults for invalid units and bounds physical effects", () => {
    expect(
      glassNumber({ "--vdl-glass-blur-max": "2rem" }, "blur-max", "px", 80),
    ).toBe(parseFloat(glassTokens["--vdl-glass-blur-max"]));
    expect(
      glassNumber(
        { "--vdl-glass-refraction-max": "NaN" },
        "refraction-max",
        "px",
        100,
      ),
    ).toBe(parseFloat(glassTokens["--vdl-glass-refraction-max"]));
    expect(
      glassNumber({ "--vdl-glass-blur-max": "1000px" }, "blur-max", "px", 80),
    ).toBe(80);
    expect(
      glassNumber({ "--vdl-glass-control-opacity": "0" }, "control-opacity"),
    ).toBe(0);
  });
});
