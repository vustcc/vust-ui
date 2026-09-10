import { useState, useEffect } from "react";
import {
  VustButton,
  VustInput,
  VustSwitch,
  VustTag,
  VustIcon,
  VustCard,
  VustCheckbox,
  VustEmpty,
  VustAlert,
  VustLoading,
  VustBreadcrumb,
  VustBreadcrumbItem,
  VustToast,
  VustTooltip,
  VustDescriptions,
  VustFormItem,
  VustTabs,
  VustMenu,
  VustActionMenu,
  VustDialog,
  VustDrawer,
  VustModal,
  VustPagination,
  VustSelect,
  VustTable,
  VustDateTimeRangePicker,
} from "@vustcc/react";
import type { ToastItem, DateTimeRangeValue } from "@vustcc/react";
import "./App.css";

const componentAnchors = [
  ["button", "Button", "按钮"],
  ["input", "Input", "输入框"],
  ["switch", "Switch", "开关"],
  ["tag", "Tag", "标签"],
  ["icon", "Icon", "图标"],
  ["card", "Card", "卡片"],
  ["checkbox", "Checkbox", "复选框"],
  ["alert", "Alert", "警告横幅"],
  ["empty", "Empty", "空状态"],
  ["loading", "Loading", "加载状态"],
  ["breadcrumb", "Breadcrumb", "面包屑"],
  ["tooltip", "Tooltip", "文字提示"],
  ["toast", "Toast", "通知"],
  ["tabs", "Tabs", "标签页"],
  ["action-menu", "ActionMenu", "操作菜单"],
  ["menu", "Menu", "菜单"],
  ["descriptions", "Descriptions", "描述列表"],
  ["form-item", "FormItem", "表单项"],
  ["dialog", "Dialog", "对话框"],
  ["drawer", "Drawer", "抽屉"],
  ["modal", "Modal", "模态框"],
  ["select", "Select", "选择器"],
  ["pagination", "Pagination", "分页"],
  ["date-time-range-picker", "DateTimeRangePicker", "时间范围"],
  ["table", "Table", "表格"],
].map(([id, name, label]) => ({ id, name, label }));

function App() {
  const [activeAnchor, setActiveAnchor] = useState(componentAnchors[0].id);
  const [textVal, setTextVal] = useState("Hello VUST UI");
  const [switchVal, setSwitchVal] = useState(true);
  const [checkboxVal, setCheckboxVal] = useState(false);
  const [loadingVal, setLoadingVal] = useState(false);

  // Dialog / Drawer / Modal trigger states
  const [dialogVisible, setDialogVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Pagination & Select states
  const [currentPageVal, setCurrentPageVal] = useState(1);
  const [totalPagesVal] = useState(10);
  const [selectVal, setSelectVal] = useState("opt1");
  const selectOptions = [
    {
      value: "opt1",
      label: "主要通信节点 (Primary)",
      hint: "运行主力防火墙策略",
    },
    { value: "opt2", label: "备用节点 A (Backup A)" },
    {
      value: "opt3",
      label: "只读节点 B (Readonly B)",
      disabled: true,
      hint: "处于离线维护状态",
    },
  ];

  // Table mock data and columns
  const tableData = [
    {
      id: "1",
      name: "网络边界防火墙 A",
      ip: "10.0.1.100",
      status: "active",
      traffic: "1.2 Gbps",
    },
    {
      id: "2",
      name: "数据中心路由器 B",
      ip: "10.0.2.1",
      status: "active",
      traffic: "850 Mbps",
    },
    {
      id: "3",
      name: "入侵检测系统 C",
      ip: "10.0.5.50",
      status: "maintenance",
      traffic: "0 bps",
    },
  ];

  const tableColumns = [
    { prop: "name", label: "节点名称", width: "200px" },
    { prop: "ip", label: "节点 IP", width: "150px" },
    { prop: "traffic", label: "当前流量", width: "120px" },
    { slot: "status", label: "运行状态", width: "120px" },
    { slot: "actions", label: "操作", width: "100px" },
  ];

  // Date picker states
  const [rangeVal, setRangeVal] = useState<DateTimeRangeValue>({
    startAt: new Date(2025, 4, 20, 9, 30).getTime(),
    endAt: new Date(2025, 4, 20, 10, 30).getTime(),
  });

  const shortcutOptions = [
    { label: "最近 15 分钟", value: "15m" as const },
    { label: "最近 1 小时", value: "1h" as const },
    { label: "最近 24 小时", value: "24h" as const },
    { label: "最近 7 天", value: "7d" as const },
    { label: "今天", value: "today" as const },
  ];

  const weekDaysList = ["日", "一", "二", "三", "四", "五", "六"];

  // Tabs active state
  const [activeTab, setActiveTab] = useState("tab1");
  const tabsList = [
    { label: "基础配置", name: "tab1" },
    { label: "高级设置", name: "tab2" },
    { label: "只读历史", name: "tab3", disabled: true },
  ];

  // Menu active state & categories
  const [activeMenu, setActiveMenu] = useState("item1");
  const menuItems = [
    {
      key: "group1",
      label: "核心资源",
      children: [
        { key: "item1", label: "容器管理" },
        { key: "item2", label: "镜像仓库" },
      ],
    },
    {
      key: "group2",
      label: "高级功能",
      children: [
        { key: "item3", label: "负载均衡" },
        { key: "item4", label: "审计日志" },
      ],
    },
  ];

  // Descriptions items & mock data
  const descItems = [
    { label: "服务名称", value: "Security Core Services" },
    { label: "当前版本", value: "v2.4.12-release" },
    { label: "状态", slot: "status" },
    { label: "节点数", value: 8, span: 1 },
    {
      label: "备注信息",
      value:
        "This cluster runs core node authentication and firewall dispatch policies.",
      span: 2,
    },
  ];
  const descData = {
    statusText: "正常运行",
  };

  // ActionMenu actions list
  const actionsList = [
    {
      label: "启动服务",
      icon: "status-running",
      className: "app-btn-start",
      handler: () => {
        addToast("success", "指令已发送", "服务启动指令下发成功。");
      },
    },
    {
      label: "暂停服务",
      icon: "settings",
      className: "app-btn-stop",
      handler: () => {
        addToast("warning", "指令已发送", "服务暂停指令下发成功。");
      },
    },
    {
      label: "删除容器",
      icon: "trash",
      className: "app-btn-delete",
      handler: () => {
        addToast("error", "删除警告", "此操作无法撤销。");
      },
    },
  ];

  function triggerLoading() {
    setLoadingVal(true);
    setTimeout(() => {
      setLoadingVal(false);
    }, 2000);
  }

  // Toast demonstration state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function addToast(type: ToastItem["type"], title: string, message: string) {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto-remove in 3s
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  // Theme switching logic
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const hash = window.location.hash.slice(1).replace("component-", "");
    if (componentAnchors.some((item) => item.id === hash))
      setActiveAnchor(hash);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        const id = visible?.target.id.replace("component-", "");
        if (!id) return;
        setActiveAnchor(id);
        window.history.replaceState(null, "", `#component-${id}`);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );
    componentAnchors.forEach((item) => {
      const target = document.getElementById(`component-${item.id}`);
      if (target) observer.observe(target);
    });
    return () => observer.disconnect();
  }, []);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <div className="playground-wrapper">
      <header className="playground-header">
        <div>
          <h2>VUST UI React Playground</h2>
          <p>调试设计语言 tokens、自研图标及基础 UI 组件 (React 19)</p>
        </div>
        <VustButton type="primary" onClick={toggleTheme}>
          切换为 {theme === "dark" ? "明亮" : "暗黑"} 主题
        </VustButton>
      </header>

      <div className="playground-layout">
        <aside
          className="component-anchor-sidebar"
          data-ui="component-anchor-menu"
        >
          <div className="component-anchor-title">组件目录</div>
          <nav className="component-anchor-nav">
            {componentAnchors.map((item) => (
              <a
                key={item.id}
                href={`#component-${item.id}`}
                className={activeAnchor === item.id ? "active" : undefined}
                onClick={() => setActiveAnchor(item.id)}
              >
                <span>{item.name}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        <main className="playground-content">
          {/* Buttons section */}
          <section
            id="component-button"
            className="card component-anchor-target"
          >
            <h3>Buttons 按钮</h3>
            <div className="row">
              <VustButton type="primary">主要按钮 (Primary)</VustButton>
              <VustButton type="secondary">次要按钮 (Secondary)</VustButton>
              <VustButton type="danger">危险按钮 (Danger)</VustButton>
              <VustButton type="warning">警告按钮 (Warning)</VustButton>
              <VustButton type="info">信息按钮 (Info)</VustButton>
            </div>
            <div className="row">
              <VustButton type="primary" size="small">
                小型按钮
              </VustButton>
              <VustButton type="primary">默认按钮</VustButton>
              <VustButton type="primary" size="large">
                大型按钮
              </VustButton>
              <VustButton type="primary" disabled>
                禁用按钮
              </VustButton>
              <VustButton type="primary" loading>
                加载中
              </VustButton>
            </div>
          </section>

          {/* Input section */}
          <section
            id="component-input"
            className="card component-anchor-target"
          >
            <h3>Inputs 输入框</h3>
            <div
              className="row"
              style={{
                flexDirection: "column",
                alignItems: "stretch",
                maxWidth: "400px",
              }}
            >
              <div className="form-item">
                <label>常规文本输入框</label>
                <VustInput
                  value={textVal}
                  onChange={setTextVal}
                  placeholder="请输入内容"
                />
                <span className="hint">当前输入值: {textVal}</span>
              </div>

              <div className="form-item">
                <label>密码输入框</label>
                <VustInput
                  value={textVal}
                  onChange={setTextVal}
                  type="password"
                  showPassword
                  placeholder="请输入密码"
                />
              </div>

              <div className="form-item">
                <label>多行文本输入框</label>
                <VustInput
                  value={textVal}
                  onChange={setTextVal}
                  type="textarea"
                  rows={3}
                  placeholder="请输入详细描述"
                />
              </div>
            </div>
          </section>

          {/* Switch section */}
          <section
            id="component-switch"
            className="card component-anchor-target"
          >
            <h3>Switches 开关</h3>
            <div className="row">
              <VustSwitch
                value={switchVal}
                onChange={setSwitchVal}
                activeText="系统功能开关"
              />
              <VustSwitch value={false} disabled activeText="禁用未激活" />
              <VustSwitch value={true} disabled activeText="禁用激活" />
            </div>
          </section>

          {/* Tags section */}
          <section id="component-tag" className="card component-anchor-target">
            <h3>Tags 标签</h3>
            <div className="row">
              <VustTag type="default">默认标签</VustTag>
              <VustTag type="primary">主要标签</VustTag>
              <VustTag type="success">成功标签</VustTag>
              <VustTag type="warning">警告标签</VustTag>
              <VustTag type="danger">危险标签</VustTag>
              <VustTag type="info">信息标签</VustTag>
            </div>
          </section>

          {/* Icons section */}
          <section id="component-icon" className="card component-anchor-target">
            <h3>Icons 矢量图标</h3>
            <div className="row icons-grid">
              <div className="icon-item">
                <VustIcon name="desktop" size={24} />
                <span>desktop</span>
              </div>
              <div className="icon-item">
                <VustIcon name="settings" size={24} />
                <span>settings</span>
              </div>
              <div className="icon-item">
                <VustIcon name="lock" size={24} />
                <span>lock</span>
              </div>
              <div className="icon-item">
                <VustIcon name="trash" size={24} />
                <span>trash</span>
              </div>
              <div className="icon-item">
                <VustIcon name="fallback" size={24} />
                <span>fallback</span>
              </div>
              <div className="icon-item">
                <VustIcon name="copy" size={24} />
                <span>copy</span>
              </div>
              <div className="icon-item">
                <VustIcon name="error" size={24} />
                <span>error</span>
              </div>
              <div className="icon-item">
                <VustIcon name="status-running" size={24} />
                <span>running</span>
              </div>
            </div>
          </section>

          {/* Cards section */}
          <section id="component-card" className="card component-anchor-target">
            <h3>Cards 卡片</h3>
            <div className="row" style={{ alignItems: "stretch" }}>
              <VustCard
                style={{ width: "280px" }}
                shadow="always"
                header="总是显示阴影 (always)"
              >
                <div>这是卡片主体内容，遵循 VDL 设计规范。</div>
              </VustCard>
              <VustCard
                style={{ width: "280px" }}
                shadow="hover"
                header="悬浮显示阴影 (hover)"
              >
                <div>鼠标悬浮时才显示卡片投影效果。</div>
              </VustCard>
              <VustCard
                style={{ width: "280px" }}
                shadow="never"
                header="从不显示阴影 (never)"
              >
                <div>纯扁平无阴影样式的卡片容器。</div>
              </VustCard>
            </div>
          </section>

          {/* Checkbox section */}
          <section
            id="component-checkbox"
            className="card component-anchor-target"
          >
            <h3>Checkboxes 复选框</h3>
            <div className="row">
              <VustCheckbox checked={checkboxVal} onChange={setCheckboxVal}>
                默认复选框 (值: {String(checkboxVal)})
              </VustCheckbox>
              <VustCheckbox checked={true} disabled>
                禁用已勾选
              </VustCheckbox>
              <VustCheckbox checked={false} disabled>
                禁用未勾选
              </VustCheckbox>
            </div>
          </section>

          {/* Alert section */}
          <section
            id="component-alert"
            className="card component-anchor-target"
          >
            <h3>Alerts 警告横幅</h3>
            <div
              className="row"
              style={{
                flexDirection: "column",
                alignItems: "stretch",
                gap: "16px",
              }}
            >
              <VustAlert
                type="info"
                showIcon
                title="提示信息"
                description="这是一条普通的提示信息横幅。"
              />
              <VustAlert
                type="success"
                showIcon
                title="成功提示"
                description="操作已成功完成，系统已更新。"
                closable
              />
              <VustAlert
                type="warning"
                showIcon
                title="警告提示"
                description="此操作可能影响系统的正常运行，请谨慎操作。"
              />
              <VustAlert
                type="error"
                showIcon
                title="错误提示"
                description="系统连接超时，请检查网络设置后重试。"
                closable
              />
            </div>
          </section>

          {/* Loading and Empty section */}
          <section className="card">
            <h3>Loading & Empty 加载与空状态</h3>
            <div
              className="row"
              style={{ justifyContent: "space-around", width: "100%" }}
            >
              <div id="component-empty" className="component-anchor-target">
                <VustCard style={{ width: "320px" }} header="空状态示例">
                  <VustEmpty
                    description="自定义暂无数据文案"
                    extra={
                      <VustButton type="primary" size="small">
                        重新加载
                      </VustButton>
                    }
                  />
                </VustCard>
              </div>

              <div id="component-loading" className="component-anchor-target">
                <VustCard style={{ width: "320px" }} header="加载中遮罩">
                  <VustLoading loading={loadingVal} text="正在拼命加载中...">
                    <div style={{ padding: "40px 20px", textAlign: "center" }}>
                      <p>点击下方按钮体验局部 Loading 遮罩</p>
                      <VustButton
                        type="primary"
                        size="small"
                        onClick={triggerLoading}
                      >
                        触发 2 秒 Loading
                      </VustButton>
                    </div>
                  </VustLoading>
                </VustCard>
              </div>

              <VustCard style={{ width: "320px" }} header="覆盖层级回归">
                <div
                  data-ui="qa-loading-cover"
                  style={{
                    position: "relative",
                    height: "96px",
                    overflow: "hidden",
                    border: "1px solid var(--vdl-border-default)",
                    borderRadius: "var(--vdl-radius-md)",
                    background: "var(--vdl-bg-muted)",
                  }}
                >
                  <div
                    data-slot="sticky-content"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 30,
                      height: "40px",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--vdl-text-primary)",
                      background: "var(--vdl-bg-panel)",
                    }}
                  >
                    高层级粘性内容
                  </div>
                  <VustLoading loading cover text="正在加载..." />
                </div>
              </VustCard>
            </div>
          </section>

          {/* Navigation & Popups */}
          <section className="card">
            <h3>
              Navigation & Popups (Breadcrumb, Tooltip, Toast)
              面包屑、提示、通知
            </h3>

            {/* Breadcrumb section */}
            <div
              id="component-breadcrumb"
              className="row component-anchor-target"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "13px",
                  color: "var(--vdl-text-secondary)",
                  fontWeight: 500,
                }}
              >
                面包屑导航
              </label>
              <VustBreadcrumb>
                <VustBreadcrumbItem>首页</VustBreadcrumbItem>
                <VustBreadcrumbItem>系统管理</VustBreadcrumbItem>
                <VustBreadcrumbItem>安全配置</VustBreadcrumbItem>
              </VustBreadcrumb>
            </div>

            <hr
              style={{
                border: "none",
                borderTop: "1px solid var(--vdl-border-default)",
                width: "100%",
                margin: "8px 0",
              }}
            />

            {/* Tooltip section */}
            <div
              id="component-tooltip"
              className="row component-anchor-target"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <label
                style={{
                  fontSize: "13px",
                  color: "var(--vdl-text-secondary)",
                  fontWeight: 500,
                }}
              >
                文字提示 (Tooltip)
              </label>
              <div className="row">
                <VustTooltip
                  data-ui="qa-tooltip"
                  text="这里是上方的提示内容"
                  position="top"
                >
                  <VustButton size="small">上方提示</VustButton>
                </VustTooltip>
                <VustTooltip text="这里是下方的提示内容" position="bottom">
                  <VustButton size="small">下方提示</VustButton>
                </VustTooltip>
                <VustTooltip text="这里是左侧的提示内容" position="left">
                  <VustButton size="small">左侧提示</VustButton>
                </VustTooltip>
                <VustTooltip text="这里是右侧的提示内容" position="right">
                  <VustButton size="small">右侧提示</VustButton>
                </VustTooltip>
              </div>
            </div>

            <hr
              style={{
                border: "none",
                borderTop: "1px solid var(--vdl-border-default)",
                width: "100%",
                margin: "8px 0",
              }}
            />

            {/* Toast section */}
            <div
              id="component-toast"
              className="row component-anchor-target"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <label
                style={{
                  fontSize: "13px",
                  color: "var(--vdl-text-secondary)",
                  fontWeight: 500,
                }}
              >
                通知提示 (Toast)
              </label>
              <div className="row">
                <VustButton
                  type="primary"
                  size="small"
                  onClick={() =>
                    addToast(
                      "success",
                      "成功通知",
                      "这是一条操作成功的消息提示，3秒后自动消失。",
                    )
                  }
                >
                  触发成功通知
                </VustButton>
                <VustButton
                  type="danger"
                  size="small"
                  onClick={() =>
                    addToast(
                      "error",
                      "错误通知",
                      "系统遭遇异常，请查看审计日志。",
                    )
                  }
                >
                  触发错误通知
                </VustButton>
                <VustButton
                  type="warning"
                  size="small"
                  onClick={() =>
                    addToast(
                      "warning",
                      "警告通知",
                      "磁盘空间不足，请及时清理缓存文件。",
                    )
                  }
                >
                  触发警告通知
                </VustButton>
                <VustButton
                  type="info"
                  size="small"
                  onClick={() =>
                    addToast(
                      "info",
                      "常规通知",
                      "系统于今晚 24:00 进行常规维护升级。",
                    )
                  }
                >
                  触发常规通知
                </VustButton>
              </div>
              {/* Real time toast renderer */}
              <VustToast toasts={toasts} onClose={removeToast} />
            </div>
          </section>

          {/* Layout & Controls */}
          <section className="card">
            <h3>Layout & Controls 布局与控制组件</h3>

            {/* Tabs & ActionMenu demo */}
            <div
              className="row"
              style={{
                justifyContent: "space-between",
                width: "100%",
                alignItems: "flex-end",
              }}
            >
              <div
                id="component-tabs"
                className="component-anchor-target"
                style={{ flex: 1, maxWidth: "500px" }}
              >
                <VustTabs
                  data-ui="qa-tabs"
                  value={activeTab}
                  onChange={setActiveTab}
                  tabs={tabsList}
                />
              </div>
              <div
                id="component-action-menu"
                className="component-anchor-target"
              >
                <VustActionMenu
                  data-ui="qa-action-menu"
                  actions={actionsList}
                  label="管理操作"
                />
              </div>
            </div>

            <div style={{ padding: "12px 0" }}>
              {activeTab === "tab1" && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--vdl-text-secondary)",
                  }}
                >
                  [基础配置] 标签页激活。下方是详情列表与表单展示：
                </p>
              )}
              {activeTab === "tab2" && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--vdl-text-secondary)",
                  }}
                >
                  [高级设置] 标签页激活。可以在此处设置高吞吐防火墙规则。
                </p>
              )}
            </div>

            <div
              className="row"
              style={{ alignItems: "flex-start", gap: "24px", width: "100%" }}
            >
              {/* Menu demo on left */}
              <div
                id="component-menu"
                className="component-anchor-target"
                style={{
                  width: "200px",
                  flexShrink: 0,
                  backgroundColor: "var(--vdl-bg-panel)",
                  border: "1px solid var(--vdl-border-default)",
                  borderRadius: "var(--vdl-radius-md)",
                  padding: "12px",
                }}
              >
                <VustMenu
                  data-ui="qa-menu"
                  value={activeMenu}
                  onChange={setActiveMenu}
                  items={menuItems}
                />
              </div>

              {/* Descriptions & Form demo on right */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div
                  id="component-descriptions"
                  className="component-anchor-target"
                >
                  <VustCard
                    shadow="never"
                    style={{ padding: "16px" }}
                    header="服务状态详情列表 (Descriptions)"
                  >
                    <VustDescriptions
                      items={descItems}
                      data={descData}
                      column={2}
                      border
                      slots={{
                        status: () => (
                          <VustTag type="success">
                            {descData.statusText}
                          </VustTag>
                        ),
                      }}
                    />
                  </VustCard>
                </div>

                <div
                  id="component-form-item"
                  className="component-anchor-target"
                >
                  <VustCard
                    shadow="never"
                    style={{ padding: "16px" }}
                    header="表单项配置 (FormItem)"
                  >
                    <VustFormItem
                      data-ui="qa-form-error"
                      label="目标节点地址"
                      required
                      hint="请填写合法的 IPv4/IPv6 节点通信地址"
                      error="示例错误：请输入合法的节点地址"
                    >
                      <VustInput
                        value={textVal}
                        onChange={setTextVal}
                        placeholder="例如 192.168.1.100"
                      />
                    </VustFormItem>
                    <VustFormItem
                      label="启用节点自动备份"
                      hint="每天凌晨 02:00 自动冷备份"
                    >
                      <VustSwitch value={true} />
                    </VustFormItem>
                  </VustCard>
                </div>
              </div>
            </div>
          </section>

          {/* Overlays & Popups */}
          <section className="card">
            <h3>Overlays & Popups 弹窗、抽屉与模态框</h3>
            <div className="row">
              <span id="component-dialog" className="component-anchor-target">
                <VustButton
                  data-ui="qa-open-dialog"
                  type="primary"
                  onClick={() => setDialogVisible(true)}
                >
                  打开对话框 (Dialog)
                </VustButton>
              </span>
              <span id="component-drawer" className="component-anchor-target">
                <VustButton
                  data-ui="qa-open-drawer"
                  type="secondary"
                  onClick={() => setDrawerVisible(true)}
                >
                  打开右侧抽屉 (Drawer)
                </VustButton>
              </span>
              <span id="component-modal" className="component-anchor-target">
                <VustButton type="danger" onClick={() => setModalVisible(true)}>
                  打开模态框 (Modal)
                </VustButton>
              </span>
            </div>

            {/* Dialog demonstration */}
            <VustDialog
              data-ui="qa-dialog"
              visible={dialogVisible}
              title="安全审计详情"
              width="550px"
              onClose={() => setDialogVisible(false)}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <p>
                  这里是对话框的主体内容，支持溢出自动滚动。您可以在这里放置复杂的表单或详情数据：
                </p>
                <VustDescriptions
                  items={[
                    { label: "审计对象", value: "API Gateway /auth" },
                    { label: "威胁等级", value: "CRITICAL" },
                    { label: "拦截策略", value: "DROP CONNECTION" },
                  ]}
                  column={1}
                  border
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "flex-end",
                  marginTop: "16px",
                }}
              >
                <VustButton
                  size="small"
                  onClick={() => setDialogVisible(false)}
                >
                  关闭
                </VustButton>
                <VustButton
                  type="primary"
                  size="small"
                  onClick={() => {
                    addToast("success", "审计确认", "审计数据已存档");
                    setDialogVisible(false);
                  }}
                >
                  确认并封禁
                </VustButton>
              </div>
            </VustDialog>

            {/* Drawer demonstration */}
            <VustDrawer
              data-ui="qa-drawer"
              visible={drawerVisible}
              title="集群高级策略配置"
              width="450px"
              onClose={() => setDrawerVisible(false)}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <p>
                  侧边抽屉通常用于复杂表单的配置，如网关策略、负载均衡参数等。
                </p>
                <VustFormItem
                  label="通信加密级别"
                  hint="建议在生产环境启用 TLS 1.3"
                >
                  <div
                    style={{
                      border: "1px solid var(--vdl-border-default)",
                      borderRadius: "var(--vdl-radius-md)",
                      padding: "8px 12px",
                      fontSize: "13px",
                      backgroundColor: "var(--vdl-bg-muted)",
                      color: "var(--vdl-text-muted)",
                    }}
                  >
                    TLS 1.3 (默认)
                  </div>
                </VustFormItem>
                <VustFormItem
                  label="最大并发连接数"
                  hint="超过此连接数将进行流量限速"
                >
                  <VustInput
                    value={textVal}
                    onChange={setTextVal}
                    placeholder="例如 10000"
                  />
                </VustFormItem>
                <VustFormItem label="启用 IP 白名单机制">
                  <VustSwitch value={switchVal} onChange={setSwitchVal} />
                </VustFormItem>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "flex-end",
                  marginTop: "16px",
                }}
              >
                <VustButton
                  size="small"
                  onClick={() => setDrawerVisible(false)}
                >
                  取消
                </VustButton>
                <VustButton
                  type="primary"
                  size="small"
                  onClick={() => {
                    addToast("success", "保存成功", "高级配置已生效");
                    setDrawerVisible(false);
                  }}
                >
                  保存策略
                </VustButton>
              </div>
            </VustDrawer>

            {/* Modal demonstration */}
            <VustModal
              visible={modalVisible}
              title="系统警告"
              message="您确定要彻底删除该容器及其绑定的数据卷吗？此操作属于敏感高危操作，可能会导致宿主机数据丢失，且无法撤销。"
              type="danger"
              confirmText="强制删除"
              cancelText="暂不删除"
              onConfirm={() => {
                addToast("error", "删除成功", "容器已强制销毁");
                setModalVisible(false);
              }}
              onCancel={() => setModalVisible(false)}
            />
          </section>

          {/* Selection & Pagination */}
          <section className="card">
            <h3>Selection & Pagination 下拉选择与分页</h3>

            <div
              className="row"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "20px",
                width: "100%",
              }}
            >
              {/* Select demo */}
              <div
                id="component-select"
                className="component-anchor-target"
                style={{ width: "100%", maxWidth: "320px" }}
              >
                <VustFormItem
                  label="通信通道选择"
                  hint="请选择当前要审计的网络通信通道"
                >
                  <VustSelect
                    data-ui="qa-select"
                    value={selectVal}
                    onChange={(val) => setSelectVal(val as string)}
                    options={selectOptions}
                    onOptionDisabled={(opt) =>
                      addToast("warning", "选项禁用", `${opt.label} 当前不可选`)
                    }
                  />
                </VustFormItem>
                <span
                  style={{ fontSize: "12px", color: "var(--vdl-text-muted)" }}
                >
                  当前选中值: <VustTag type="primary">{selectVal}</VustTag>
                </span>
              </div>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--vdl-border-default)",
                  width: "100%",
                  margin: "8px 0",
                }}
              />

              {/* Pagination demo */}
              <div
                id="component-pagination"
                className="component-anchor-target"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <label
                  style={{
                    fontSize: "13px",
                    color: "var(--vdl-text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  数据分页导航
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <VustPagination
                    data-ui="qa-pagination"
                    currentPage={currentPageVal}
                    totalPages={totalPagesVal}
                    onPageChange={(page) => {
                      setCurrentPageVal(page);
                      addToast("info", "页面切换", `已导航至第 ${page} 页`);
                    }}
                  />
                  <span
                    style={{ fontSize: "12px", color: "var(--vdl-text-muted)" }}
                  >
                    当前页数:{" "}
                    <VustTag type="success">
                      {currentPageVal} / {totalPagesVal}
                    </VustTag>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Tables & DatePickers */}
          <section className="card">
            <h3>Tables & DatePickers 表格与日期时间选择器</h3>

            <div
              className="row"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "24px",
                width: "100%",
              }}
            >
              {/* Date picker demo */}
              <div
                id="component-date-time-range-picker"
                className="component-anchor-target"
                style={{ width: "100%", maxWidth: "450px" }}
              >
                <VustFormItem
                  label="统计时间范围 (DateTimeRangePicker)"
                  hint="点击输入框选择自定义的时间窗口"
                >
                  <VustDateTimeRangePicker
                    data-ui="qa-date-time-range"
                    value={rangeVal}
                    onChange={setRangeVal}
                    placeholder="请选择时间范围"
                    startLabel="起始时间"
                    endLabel="结束时间"
                    shortcutsLabel="快捷范围"
                    calendarLabel="日历选择"
                    timeLabel="具体时间"
                    clearLabel="清空"
                    confirmLabel="确认"
                    cancelLabel="取消"
                    locale="zh"
                    weekDays={weekDaysList}
                    shortcuts={shortcutOptions}
                    onApply={() =>
                      addToast("success", "时间范围已应用", "已选中范围。")
                    }
                  />
                </VustFormItem>
              </div>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--vdl-border-default)",
                  width: "100%",
                  margin: "8px 0",
                }}
              />

              {/* Table demo */}
              <div
                id="component-table"
                className="component-anchor-target"
                style={{ width: "100%" }}
              >
                <label
                  style={{
                    fontSize: "13px",
                    color: "var(--vdl-text-secondary)",
                    fontWeight: 500,
                    display: "block",
                    marginBottom: "12px",
                  }}
                >
                  自研数据表格 (VustTable)
                </label>
                <VustTable
                  data-ui="qa-table"
                  data={tableData}
                  columns={tableColumns}
                  border
                  slots={{
                    status: ({ row }) => (
                      <VustTag
                        type={row.status === "active" ? "success" : "warning"}
                      >
                        {row.status === "active" ? "正常运行" : "正在维护"}
                      </VustTag>
                    ),
                    actions: ({ row }) => (
                      <VustButton
                        type="primary"
                        size="small"
                        onClick={() =>
                          addToast("info", "节点操作", `正在连接到 ${row.name}`)
                        }
                      >
                        管理
                      </VustButton>
                    ),
                  }}
                />
              </div>

              {/* Empty table demo */}
              <div style={{ width: "100%" }}>
                <label
                  style={{
                    fontSize: "13px",
                    color: "var(--vdl-text-secondary)",
                    fontWeight: 500,
                    display: "block",
                    marginBottom: "12px",
                  }}
                >
                  表格无数据占位状态 (VustTable Empty)
                </label>
                <VustTable
                  data={[]}
                  columns={tableColumns}
                  border
                  emptyText="当前网段内未发现可用的安全通信节点。"
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
