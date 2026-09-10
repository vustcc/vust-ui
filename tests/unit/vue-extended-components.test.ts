import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import VustActionMenu from "../../packages/vue/src/components/VustActionMenu.vue";
import VustAlert from "../../packages/vue/src/components/VustAlert.vue";
import VustBreadcrumb from "../../packages/vue/src/components/VustBreadcrumb.vue";
import VustBreadcrumbItem from "../../packages/vue/src/components/VustBreadcrumbItem.vue";
import VustButton from "../../packages/vue/src/components/VustButton.vue";
import VustCard from "../../packages/vue/src/components/VustCard.vue";
import VustDateTimeRangePicker from "../../packages/vue/src/components/VustDateTimeRangePicker.vue";
import VustDescriptions from "../../packages/vue/src/components/VustDescriptions.vue";
import VustDialog from "../../packages/vue/src/components/VustDialog.vue";
import VustDrawer from "../../packages/vue/src/components/VustDrawer.vue";
import VustEmpty from "../../packages/vue/src/components/VustEmpty.vue";
import VustIcon from "../../packages/vue/src/components/VustIcon.vue";
import VustMenu from "../../packages/vue/src/components/VustMenu.vue";
import VustPagination from "../../packages/vue/src/components/VustPagination.vue";
import VustTabs from "../../packages/vue/src/components/VustTabs.vue";
import VustTag from "../../packages/vue/src/components/VustTag.vue";
import VustTooltip from "../../packages/vue/src/components/VustTooltip.vue";

enableAutoUnmount(afterEach);

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

describe("Vue 扩展组件行为", () => {
  it("ActionMenu 支持键盘打开和执行", async () => {
    const handler = vi.fn();
    const wrapper = mount(VustActionMenu, {
      attachTo: document.body,
      props: { actions: [{ label: "执行", handler }] },
    });
    await wrapper.get(".vl-action-btn").trigger("keydown", { key: "Enter" });
    document.querySelector<HTMLButtonElement>('[role="menuitem"]')!.click();
    expect(handler).toHaveBeenCalledOnce();
  });

  it("ActionMenu 同一时刻只展开一个并在定位后显示", async () => {
    const first = mount(VustActionMenu, {
      attachTo: document.body,
      props: {
        label: "操作一",
        actions: [{ label: "执行一", handler: vi.fn() }],
      },
    });
    const second = mount(VustActionMenu, {
      attachTo: document.body,
      props: {
        label: "操作二",
        actions: [{ label: "执行二", handler: vi.fn() }],
      },
    });

    await first.get(".vl-action-btn").trigger("click");
    expect(document.querySelector(".vl-dropdown")?.classList).toContain(
      "is-positioned",
    );
    await second.get(".vl-action-btn").trigger("click");

    expect(document.querySelectorAll('[role="menu"]')).toHaveLength(1);
    expect(first.get(".vl-action-btn").attributes("aria-expanded")).toBe(
      "false",
    );
    expect(second.get(".vl-action-btn").attributes("aria-expanded")).toBe(
      "true",
    );
  });

  it("Tooltip 渲染提示语义", async () => {
    const wrapper = mount(VustTooltip, {
      attachTo: document.body,
      props: { text: "帮助", delay: 0 },
      slots: { default: "<button>目标</button>" },
    });
    await wrapper.get(".vl-tooltip-wrapper").trigger("mouseenter");
    await new Promise((resolve) => setTimeout(resolve));
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain(
      "帮助",
    );
  });

  it("Dialog 与 Drawer 响应 Escape", async () => {
    const dialog = mount(VustDialog, {
      attachTo: document.body,
      props: { visible: true, title: "对话框" },
    });
    await new Promise((resolve) => setTimeout(resolve));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(dialog.emitted("close")).toHaveLength(1);
    dialog.unmount();
    const drawer = mount(VustDrawer, {
      attachTo: document.body,
      props: { modelValue: true, title: "抽屉" },
    });
    await new Promise((resolve) => setTimeout(resolve));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(drawer.emitted("update:modelValue")?.at(-1)).toEqual([false]);
  });

  it("嵌套模态关闭一层后继续保持滚动锁", async () => {
    const dialog = mount(VustDialog, {
      attachTo: document.body,
      props: { visible: true, title: "外层" },
    });
    const drawer = mount(VustDrawer, {
      attachTo: document.body,
      props: { modelValue: true, title: "内层" },
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(document.body.style.overflow).toBe("hidden");
    drawer.unmount();
    expect(document.body.style.overflow).toBe("hidden");
    dialog.unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("Tabs、Menu 与 Pagination 支持键盘或原生按钮交互", async () => {
    const tabs = mount(VustTabs, {
      props: {
        modelValue: "a",
        tabs: [
          { name: "a", label: "A" },
          { name: "b", label: "B" },
        ],
      },
    });
    await tabs.get('[role="tab"]').trigger("keydown", { key: "ArrowRight" });
    expect(tabs.emitted("update:modelValue")?.at(-1)).toEqual(["b"]);
    const menu = mount(VustMenu, {
      attachTo: document.body,
      props: {
        modelValue: "a",
        items: [
          {
            key: "group",
            label: "分组",
            children: [
              { key: "a", label: "A" },
              { key: "b", label: "B" },
            ],
          },
        ],
      },
    });
    menu.findAll("button")[0].element.focus();
    await menu.findAll("button")[0].trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(menu.findAll("button")[1].element);
    const pagination = mount(VustPagination, {
      props: { currentPage: 1, totalPages: 3 },
    });
    await pagination.findAll("button").at(-1)!.trigger("click");
    expect(pagination.emitted("page-change")?.at(-1)).toEqual([2]);
  });

  it("DateTimeRangePicker 提供可操作触发器", () => {
    const wrapper = mount(VustDateTimeRangePicker, {
      props: {
        modelValue: { startAt: null, endAt: null },
        placeholder: "选择时间",
        startLabel: "开始",
        endLabel: "结束",
        shortcutsLabel: "快捷",
        calendarLabel: "日历",
        timeLabel: "时间",
        clearLabel: "清除",
        confirmLabel: "确认",
        cancelLabel: "取消",
        locale: "zh",
        weekDays: ["一", "二", "三", "四", "五", "六", "日"],
        shortcuts: [],
      },
    });
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("展示组件渲染公开状态", async () => {
    expect(
      mount(VustButton, {
        props: { loading: true },
        slots: { default: "保存" },
      })
        .get("button")
        .attributes("disabled"),
    ).toBeDefined();
    expect(
      mount(VustTag, {
        props: { type: "success" },
        slots: { default: "正常" },
      }).classes(),
    ).toContain("vl-tag");
    expect(mount(VustCard, { slots: { default: "内容" } }).text()).toContain(
      "内容",
    );
    const alert = mount(VustAlert, {
      props: { title: "警告", closable: true },
    });
    await alert.get("button").trigger("click");
    expect(alert.emitted("close")).toHaveLength(1);
    expect(
      mount(VustEmpty, { props: { description: "暂无" } }).text(),
    ).toContain("暂无");
    expect(
      mount(VustDescriptions, {
        props: { items: [{ label: "名称", value: "节点" }] },
      }).text(),
    ).toContain("节点");
    expect(
      mount(VustIcon, {
        props: { name: "info", decorative: false, label: "信息" },
      }).attributes("aria-label"),
    ).toBe("信息");
    expect(
      mount(VustBreadcrumb, {
        slots: { default: [VustBreadcrumbItem] },
      }).exists(),
    ).toBe(true);
  });
});
