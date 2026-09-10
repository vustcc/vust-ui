# @vustcc/tokens

VUST Design Language（VDL）主题变量包，为 VUST 前端项目提供统一的颜色、字体、间距、圆角、阴影和层级定义。

## 安装

```bash
pnpm add @vustcc/tokens
```

## 使用

在应用的全局样式入口导入：

```css
@import "@vustcc/tokens/index.css";
```

业务样式通过 `--vdl-*` 变量引用：

```css
.panel {
  color: var(--vdl-text-primary);
  background: var(--vdl-bg-panel);
  border: 1px solid var(--vdl-border-default);
  border-radius: var(--vdl-radius-md);
  padding: var(--vdl-space-4);
}
```

## 主题

默认主题为浅色，无需设置主题属性。需要显式声明时使用：

```html
<html data-theme="light"></html>
```

切换到深色主题：

```html
<html data-theme="dark"></html>
```

消费项目专属的图片、字体和其他静态资源路径不属于公共 Token，应由消费项目自行定义。

## 主要变量

- 背景：`--vdl-bg-*`
- 文本：`--vdl-text-*`
- 品牌与状态：`--vdl-primary`、`--vdl-success`、`--vdl-warning`、`--vdl-danger`
- 边框：`--vdl-border-*`
- 字体：`--vdl-font-*`
- 间距：`--vdl-space-*`
- 圆角：`--vdl-radius-*`
- 层级：`--vdl-z-index-*`
