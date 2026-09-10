import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  VustActionMenu,
  VustAlert,
  VustBreadcrumb,
  VustBreadcrumbItem,
  VustButton,
  VustCard,
  VustDateTimeRangePicker,
  VustDescriptions,
  VustDialog,
  VustDrawer,
  VustEmpty,
  VustIcon,
  VustMenu,
  VustPagination,
  VustTabs,
  VustTag,
  VustTooltip,
} from "../../packages/react/src";

afterEach(cleanup);

describe("React 扩展组件行为", () => {
  it("ActionMenu 支持键盘打开和执行", async () => {
    const handler = vi.fn();
    render(<VustActionMenu actions={[{ label: "执行", handler }]} />);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    await userEvent.click(await screen.findByRole("menuitem"));
    expect(handler).toHaveBeenCalledOnce();
  });

  it("ActionMenu 同一时刻只展开一个并在定位后显示", () => {
    render(
      <>
        <VustActionMenu
          label="操作一"
          actions={[{ label: "执行一", handler: vi.fn() }]}
        />
        <VustActionMenu
          label="操作二"
          actions={[{ label: "执行二", handler: vi.fn() }]}
        />
      </>,
    );

    const first = screen.getByRole("button", { name: "操作一" });
    const second = screen.getByRole("button", { name: "操作二" });
    fireEvent.click(first);
    expect(screen.getByRole("menu")).toHaveClass("is-positioned");
    fireEvent.click(second);

    expect(screen.getAllByRole("menu")).toHaveLength(1);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });

  it("Tooltip 渲染提示语义", async () => {
    render(
      <VustTooltip text="帮助" delay={0}>
        <button>目标</button>
      </VustTooltip>,
    );
    fireEvent.mouseEnter(
      screen.getByRole("button", { name: "目标" }).parentElement!,
    );
    await waitFor(() =>
      expect(screen.getByRole("tooltip")).toHaveTextContent("帮助"),
    );
  });

  it("Dialog 与 Drawer 响应 Escape", async () => {
    const closeDialog = vi.fn();
    const view = render(
      <VustDialog visible title="对话框" onClose={closeDialog}>
        内容
      </VustDialog>,
    );
    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeDialog).toHaveBeenCalledOnce();
    view.unmount();
    const closeDrawer = vi.fn();
    render(
      <VustDrawer visible title="抽屉" onClose={closeDrawer}>
        内容
      </VustDrawer>,
    );
    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeDrawer).toHaveBeenCalledOnce();
  });

  it("嵌套模态关闭一层后继续保持滚动锁", async () => {
    const view = render(
      <>
        <VustDialog visible title="外层">
          内容
        </VustDialog>
        <VustDrawer visible title="内层">
          内容
        </VustDrawer>
      </>,
    );
    await waitFor(() => expect(document.body.style.overflow).toBe("hidden"));
    view.rerender(
      <VustDrawer visible title="内层">
        内容
      </VustDrawer>,
    );
    expect(document.body.style.overflow).toBe("hidden");
    view.unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("Tabs、Menu 与 Pagination 支持键盘或原生按钮交互", async () => {
    const onTab = vi.fn();
    const view = render(
      <VustTabs
        value="a"
        onChange={onTab}
        tabs={[
          { name: "a", label: "A" },
          { name: "b", label: "B" },
        ]}
      />,
    );
    fireEvent.keyDown(screen.getAllByRole("tab")[0], { key: "ArrowRight" });
    expect(onTab).toHaveBeenCalledWith("b");
    view.unmount();
    render(
      <VustMenu
        value="a"
        onChange={vi.fn()}
        items={[
          {
            key: "group",
            label: "分组",
            children: [
              { key: "a", label: "A" },
              { key: "b", label: "B" },
            ],
          },
        ]}
      />,
    );
    const menuButtons = screen.getAllByRole("button");
    menuButtons[0].focus();
    fireEvent.keyDown(menuButtons[0], { key: "ArrowDown" });
    expect(menuButtons[1]).toHaveFocus();
    cleanup();
    const onPage = vi.fn();
    render(
      <VustPagination currentPage={1} totalPages={3} onPageChange={onPage} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPage).toHaveBeenCalledWith(2);
  });

  it("DateTimeRangePicker 提供可操作触发器", () => {
    render(
      <VustDateTimeRangePicker
        value={{ startAt: null, endAt: null }}
        onChange={vi.fn()}
        placeholder="选择时间"
        startLabel="开始"
        endLabel="结束"
        shortcutsLabel="快捷"
        calendarLabel="日历"
        timeLabel="时间"
        clearLabel="清除"
        confirmLabel="确认"
        cancelLabel="取消"
        locale="zh"
        weekDays={["一", "二", "三", "四", "五", "六", "日"]}
        shortcuts={[]}
      />,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("展示组件渲染公开状态", async () => {
    const view = render(<VustButton loading>保存</VustButton>);
    expect(screen.getByRole("button")).toBeDisabled();
    view.rerender(<VustTag type="success">正常</VustTag>);
    expect(screen.getByText("正常")).toHaveClass("vl-tag");
    view.rerender(<VustCard>内容</VustCard>);
    expect(screen.getByText("内容")).toBeInTheDocument();
    const onClose = vi.fn();
    view.rerender(<VustAlert title="警告" closable onClose={onClose} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalledOnce();
    view.rerender(<VustEmpty description="暂无" />);
    expect(screen.getByText("暂无")).toBeInTheDocument();
    view.rerender(
      <VustDescriptions items={[{ label: "名称", value: "节点" }]} />,
    );
    expect(screen.getByText("节点")).toBeInTheDocument();
    view.rerender(<VustIcon name="info" decorative={false} label="信息" />);
    expect(screen.getByLabelText("信息")).toBeInTheDocument();
    view.rerender(
      <VustBreadcrumb>
        <VustBreadcrumbItem>首页</VustBreadcrumbItem>
      </VustBreadcrumb>,
    );
    expect(screen.getByText("首页")).toBeInTheDocument();
  });
});
