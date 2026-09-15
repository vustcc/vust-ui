import { describe, expect, it, afterEach, vi } from "vitest";
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { defineComponent, ref } from "vue";
import {
  VustButton,
  VustCard,
  VustGlassProvider,
  VustInput,
  VustTabs,
} from "../../packages/vue/src";
import { resolveGlass } from "../../packages/vue/src/glass";

enableAutoUnmount(afterEach);
afterEach(() => vi.unstubAllGlobals());
const frame = () => new Promise((resolve) => setTimeout(resolve, 35));

describe("Vue glass material contract", () => {
  it("normalizes public values, keeps explicit overrides and handles invalid numbers", () => {
    expect(resolveGlass(false).enabled).toBe(false);
    expect(resolveGlass(undefined).enabled).toBe(true);
    expect(resolveGlass({ intensity: 0 })).toMatchObject({
      refraction: 0,
      blur: 0,
      opacity: 1,
      highlight: 0,
    });
    expect(resolveGlass({ intensity: 0, refraction: 0.7 })).toMatchObject({
      refraction: 0.7,
      opacity: 1,
    });
    expect(
      resolveGlass({
        refraction: 5,
        blur: -1,
        opacity: NaN,
        highlight: Infinity,
      }),
    ).toMatchObject({ refraction: 1, blur: 0, highlight: 0.6 });
    expect(resolveGlass({ opacity: NaN }).opacity).toBeCloseTo(0.3);
  });

  it("does not cast an omitted glass prop to false", () => {
    const wrapper = mount(VustButton);
    expect(wrapper.props("glass")).toBeUndefined();
    expect(wrapper.classes()).toContain("vl-glass");
  });

  it("keeps the material class through Vue state updates", async () => {
    const wrapper = mount(VustButton);
    await wrapper.setProps({ loading: true, glass: { opacity: 0.4 } });
    expect(wrapper.classes()).toContain("vl-glass");
    expect(wrapper.attributes("disabled")).toBeDefined();
  });

  it("only mounts material on the active tab", async () => {
    const wrapper = mount(VustTabs, {
      props: {
        modelValue: "a",
        tabs: [
          { name: "a", label: "A" },
          { name: "b", label: "B" },
        ],
      },
    });
    expect(wrapper.findAll(".vl-glass")).toHaveLength(1);
    await wrapper.setProps({ modelValue: "b" });
    expect(wrapper.findAll(".vl-glass")).toHaveLength(1);
    expect(wrapper.get(".vl-glass").text()).toBe("B");
  });

  it("updates material without replacing the input or losing its draft", async () => {
    const wrapper = mount(VustInput, {
      attachTo: document.body,
      props: { modelValue: "draft" },
    });
    const input = wrapper.get("input").element;
    input.focus();
    await wrapper.setProps({ glass: false });
    await frame();
    expect(wrapper.get("input").element).toBe(input);
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe("draft");
  });

  it("inherits Provider updates without leaking a component override into its slot", async () => {
    vi.stubGlobal("CSS", { supports: () => true });
    const value = ref<boolean | { intensity: number }>(false);
    const Host = defineComponent({
      components: { VustGlassProvider, VustButton, VustCard },
      setup: () => ({ value }),
      template:
        '<VustGlassProvider :glass="value"><VustCard :glass="true"><VustButton>Child</VustButton></VustCard></VustGlassProvider>',
    });
    const wrapper = mount(Host);
    await frame();
    const card = wrapper.getComponent(VustCard);
    const button = wrapper.getComponent(VustButton);
    expect(card.attributes("data-glass-mode")).toBe("blur");
    expect(button.attributes("data-glass-mode")).toBe("solid");
    value.value = { intensity: 0.5 };
    await frame();
    expect(button.attributes("data-glass-mode")).toBe("blur");
    expect(button.element.style.getPropertyValue("--vl-glass-opacity")).toBe(
      "65%",
    );
    expect(card.element.style.getPropertyValue("--vl-glass-opacity")).toBe(
      "30%",
    );
  });
});
