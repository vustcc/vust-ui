# Changelog

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，并遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added

- 新增 `--vdl-glass-*` 共享材质预设和光学参数，由主 CSS 入口自动导入。
- 新增 `glass.css` 独立入口与 `glass` JS/类型入口；JS 默认值从同一 CSS 源生成。
- 新增公共材质底色、边缘、阴影语义与 `data-glass="disabled"` 实色降级契约。
- 新增公共滚动条玻璃材质、交互态、强制颜色适配与独立 CSS 入口。

## [0.1.0-alpha.1] - 2026-09-10

### Added

- 首次发布 `@vustcc/tokens` VDL 主题 Token。
- 提供浅色与深色主题的颜色、文字、边框、状态和背景变量。
- 提供字体、间距、圆角、阴影、层级及桌面布局变量。
- CSS 自定义属性统一使用 `--vdl-*` 前缀。
