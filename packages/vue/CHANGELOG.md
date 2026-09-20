# Changelog

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，并遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [Unreleased]

## [0.1.0-alpha.2] - 2026-09-20

### Added

- 为适用组件增加可响应式调节的 Liquid Glass 默认材质与 `glass` 接口。
- 增加 `VustGlassProvider`，统一管理材质并同步 Teleport 浮层的主题与公共 Token。
- 增加无业务布局的 `VustGlassSurface`，供产品壳层和套件自绘区域复用公共材质。

### Fixed

- 修复激活标签页玻璃底板紧贴文字或切换时尺寸跳动的问题。
- 修复表格选择控件的材质状态，以及取消选择后行背景未清除的问题。

## [0.1.0-alpha.1] - 2026-09-10

### Added

- 首次发布 `@vustcc/vue` Vue 3 基础组件库。
- 提供按钮、输入、选择、开关、复选框、日期范围和表单组件。
- 提供表格、分页、标签、描述列表、卡片和空状态组件。
- 提供弹窗、抽屉、模态框、菜单、标签页和面包屑组件。
- 提供提示、通知、加载、告警和统一 SVG 图标组件。
- 所有组件使用 `Vust*` 导出名和 VDL Token。
