# Changelog

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，并遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added

- 主题同步载荷新增可选的 `glassEnabled`，并通过根节点的 `data-glass` 属性应用材质偏好。

### Changed

- `SuiteThemeState` 始终提供布尔型 `glassEnabled`；旧载荷或独立运行缺省时按开启处理。

## [0.1.0-alpha.1] - 2026-09-10

### Added

- 首次发布 `@vustcc/suite-sdk` 套件集成 SDK。
- 提供套件端桥接、主控端桥接、主题同步、语言同步和消息订阅能力。
- 支持套件导航请求、统一通知和独立运行时降级。
