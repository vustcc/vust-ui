# Vue Liquid Glass 验证记录

日期：2026-09-14。仅验证 Vue；React 未移植。

## 工程与浏览器结果

- `pnpm check:vue` 通过：Vue 类型检查、库构建、31 项单元测试、Vue playground 消费构建。
- `pnpm test:e2e:vue`：46 项通过，6 项按浏览器能力跳过，无失败或 flaky。
- 跳过项为 Firefox/WebKit 的 SVG 折射专项、CDP 减少透明度模拟和 Chromium 性能测量；两者的模糊降级、主题、浮层、输入和窄屏用例已执行。
- Chrome/Edge 的 Button、Card、Select 浮层在模糊关闭时均存在背景像素位移，Button 的前景文字区域像素不变。
- 已覆盖 Provider 响应更新、局部关闭、浮层携带局部 Token、输入焦点与草稿保留、活动 Tabs、关闭和卸载资源释放。
- 深浅色截图、320px 弹窗截图已复核；主题测试检查实际背景色，而非仅检查属性。

- 共享 Token 验证：CSS 与 JS 默认值同源、全局/局部覆盖、无 Provider 覆盖、Token 到 SVG 位移尺度、浮层同步及无效值回退均通过。
- tokens 发布文件检查通过，包含主 CSS、材质 CSS、生成的 JS 与类型；未发布。原有 Token 声明与此前版本一致，仅新增材质导入。

## 性能观测

Windows，AMD Ryzen 7 8845HS w/ Radeon 780M Graphics，16 个逻辑 CPU；headless 模式。场景为 24 个额外按钮与现有控件，总计 35 个 SVG 滤镜，120 次逐帧调参并伴随滚动，包含缩放及 resize。

| 浏览器     | 版本          | rAF 间隔 P50 |     P95 |  最大值 | Long Task | 静止材质 DOM 变更 |
| ---------- | ------------- | -----------: | ------: | ------: | --------: | ----------------: |
| vue-chrome | 153.0.8010.36 |      31.2 ms | 31.7 ms | 32.0 ms |         0 |                 0 |
| vue-edge   | 153.0.4234.32 |      31.2 ms | 31.8 ms | 32.3 ms |         0 |                 0 |

本表更新为共享 Token 迁移后的复测结果。

这些是当前机器单次自动化观测，不是 GPU 渲染耗时、低端设备预算或稳定 60fps 保证。WebKit 验证不等同于 iPhone Safari 真机认证。

## 重现与边界

执行 `pnpm test:e2e:vue` 后，完整结果与截图附件在 `playwright-report/vue/`，JSON 报告在 `artifacts/glass/results.json`。Firefox 151.0 / Playwright WebKit 26.5 用于降级验证；Chrome / Edge 使用本机安装版本。

材质接口和生效区域见 [Vue Liquid Glass](./liquid-glass-vue.md)。默认外观已落地，后续用户视觉验收与 React 移植分别进行。
