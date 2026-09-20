import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import {
  VustActionMenu,
  resolveGlass,
  VustAlert,
  VustButton,
  VustCard,
  VustCheckbox,
  VustDateTimeRangePicker,
  VustDescriptions,
  VustDialog,
  VustGlassProvider,
  VustGlassSurface,
  VustInput,
  VustMenu,
  VustPagination,
  VustSelect,
  VustSelectionBar,
  VustSwitch,
  VustTabs,
  VustTable,
  VustToast,
} from "../../packages/react/src";
import { glassNumber } from "../../packages/react/src/internal/glass-tokens";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("React glass material contract", () => {
  it("normalizes public values and preserves explicit controls", () => {
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
      resolveGlass({ refraction: 5, blur: -1, highlight: Infinity }),
    ).toMatchObject({ refraction: 1, blur: 0, highlight: 0.6 });
  });

  it("rejects invalid physical units and clamps upper bounds", () => {
    expect(
      glassNumber({ "--vdl-glass-blur-max": "2rem" }, "blur-max", "px", 80),
    ).toBe(20);
    expect(
      glassNumber(
        { "--vdl-glass-refraction-max": "1000px" },
        "refraction-max",
        "px",
        100,
      ),
    ).toBe(100);
  });

  it("renders a public surface and updates inherited material in place", async () => {
    vi.stubGlobal("CSS", { supports: () => true });
    const { container, rerender } = render(
      <div data-theme="dark">
        <VustGlassProvider glass={false}>
          <VustGlassSurface as="section" profile="control" aria-label="Shell">
            Content
          </VustGlassSurface>
        </VustGlassProvider>
      </div>,
    );
    const surface = container.querySelector("section")!;
    await waitFor(() => expect(surface.dataset.glassMode).toBe("solid"));
    expect(surface.classList).toContain("vl-glass");
    expect(surface.dataset.glassProfile).toBe("control");
    expect(surface.getAttribute("aria-label")).toBe("Shell");

    rerender(
      <div data-theme="dark">
        <VustGlassProvider glass={{ refraction: 0, opacity: 0.4 }}>
          <VustGlassSurface as="section" profile="control" aria-label="Shell">
            Content
          </VustGlassSurface>
        </VustGlassProvider>
      </div>,
    );
    await waitFor(() => expect(surface.dataset.glassMode).toBe("blur"));
    expect(container.querySelector("section")).toBe(surface);
    expect(surface.style.getPropertyValue("--vl-glass-opacity")).toBe("40%");
  });

  it("supports local opt-out and releases element state on unmount", async () => {
    vi.stubGlobal("CSS", { supports: () => true });
    const { container, unmount } = render(
      <VustGlassProvider glass={{ refraction: 0 }}>
        <VustGlassSurface glass={false}>Solid</VustGlassSurface>
      </VustGlassProvider>,
    );
    const surface = container.querySelector(".vl-glass-surface") as HTMLElement;
    await waitFor(() => expect(surface.dataset.glassMode).toBe("solid"));
    unmount();
    expect(surface.classList).not.toContain("vl-glass");
    expect(surface.dataset.glassMode).toBeUndefined();
    expect(surface.style.getPropertyValue("--vl-glass-filter")).toBe("");
  });

  it("attaches material to the real basic control surfaces", async () => {
    vi.stubGlobal("CSS", { supports: () => true });
    const { container } = render(
      <VustGlassProvider glass={{ refraction: 0, opacity: 0.42 }}>
        <VustButton>Run</VustButton>
        <VustInput value="draft" onChange={() => undefined} />
        <VustSwitch value={false} onChange={() => undefined} />
        <VustCheckbox checked={false} onChange={() => undefined} />
      </VustGlassProvider>,
    );
    await waitFor(() =>
      expect(
        container.querySelectorAll("[data-glass-mode='blur']"),
      ).toHaveLength(4),
    );
    for (const selector of [
      ".vl-button",
      ".vl-input-inner-wrapper",
      ".vl-switch-handle",
      ".vl-checkbox-inner",
    ]) {
      expect(container.querySelector(selector)?.classList).toContain(
        "vl-glass",
      );
    }
  });

  it("uses one material surface for containers and only the active tab", async () => {
    vi.stubGlobal("CSS", { supports: () => true });
    const { container } = render(
      <VustGlassProvider glass={{ refraction: 0 }}>
        <VustCard>Card</VustCard>
        <VustAlert title="Alert" />
        <VustMenu
          value="about"
          items={[
            {
              key: "system",
              label: "System",
              children: [{ key: "about", label: "About" }],
            },
          ]}
        />
        <VustTabs
          value="base"
          tabs={[
            { name: "base", label: "Base" },
            { name: "advanced", label: "Advanced" },
          ]}
        />
      </VustGlassProvider>,
    );
    await waitFor(() =>
      expect(
        container.querySelectorAll("[data-glass-mode='blur']"),
      ).toHaveLength(4),
    );
    expect(container.querySelectorAll(".vl-tabs-item.vl-glass")).toHaveLength(
      1,
    );
  });

  it("applies material to portal surfaces and keeps overlays clear", async () => {
    vi.stubGlobal("CSS", { supports: () => true });
    const { getByRole } = render(
      <VustGlassProvider glass={{ refraction: 0 }}>
        <VustSelect
          value={null}
          options={[{ value: "one", label: "One" }]}
          onChange={() => undefined}
        />
        <VustActionMenu actions={[]} />
        <VustDialog visible title="Dialog" onClose={() => undefined}>
          Body
        </VustDialog>
        <VustToast
          toasts={[
            { id: "toast", type: "info", title: "Notice", message: "Ready" },
          ]}
        />
      </VustGlassProvider>,
    );
    fireEvent.click(getByRole("combobox"));
    fireEvent.click(getByRole("button", { name: "操作" }));
    await waitFor(() => {
      expect(document.querySelector("[role='listbox']")).toHaveAttribute(
        "data-glass-mode",
        "blur",
      );
      expect(document.querySelector("[role='menu']")).toHaveAttribute(
        "data-glass-mode",
        "blur",
      );
      const dialog = document.querySelector("[role='dialog']");
      expect(dialog).not.toHaveAttribute("data-glass-mode");
      expect(
        dialog?.querySelector("[data-slot='glass-layer']"),
      ).toHaveAttribute("data-glass-mode", "blur");
      expect(document.querySelector("[role='status']")).toHaveAttribute(
        "data-glass-mode",
        "blur",
      );
    });
    expect(document.querySelector(".vl-dialog-overlay")).not.toHaveClass(
      "vl-glass",
    );
  });

  it("covers data surfaces and propagates glass to selection controls", async () => {
    vi.stubGlobal("CSS", { supports: () => true });
    const { container } = render(
      <VustGlassProvider glass={{ refraction: 0 }}>
        <VustTable
          data={[{ id: 1, name: "Node" }]}
          columns={[{ prop: "name", label: "Name" }]}
          rowKey="id"
          selectable
        />
        <VustDescriptions items={[{ label: "State", value: "Ready" }]} />
        <VustPagination currentPage={1} totalPages={2} />
        <VustSelectionBar count={1} label="Selected" clearLabel="Clear" />
        <VustDateTimeRangePicker
          value={{ startAt: null, endAt: null }}
          onChange={() => undefined}
        />
      </VustGlassProvider>,
    );
    await waitFor(() => {
      expect(container.querySelector(".vl-table-container")).toHaveAttribute(
        "data-glass-mode",
        "blur",
      );
      expect(container.querySelector(".vl-descriptions-grid")).toHaveAttribute(
        "data-glass-mode",
        "blur",
      );
      expect(container.querySelector(".vl-selection-bar")).toHaveAttribute(
        "data-glass-mode",
        "blur",
      );
    });
    expect(
      container.querySelectorAll(".vl-pagination-btn.vl-glass"),
    ).toHaveLength(4);
    expect(
      container.querySelectorAll(".vl-checkbox-inner.vl-glass"),
    ).toHaveLength(2);
  });
});
