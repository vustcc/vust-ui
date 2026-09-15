# @vustcc/vue

VUST Vue 3 基础组件库，实现 VUST Design Language（VDL）的通用交互和视觉规范。

适用表面默认采用 Liquid Glass，支持 `glass` 属性和 `VustGlassProvider` 统一调节。
参见 [Vue Liquid Glass 接口、组件范围与验证说明](../../docs/components/liquid-glass-vue.md)。
滑块和偏好存储由消费项目实现；React 移植另行进行。

## 安装

```bash
pnpm add @vustcc/vue @vustcc/icons @vustcc/tokens
```

项目需要安装 Vue 3：

```bash
pnpm add vue
```

## 样式

在全局样式入口导入主题变量和组件样式：

```css
@import "@vustcc/tokens/index.css";
@import "@vustcc/vue/style.css";
```

## 使用

组件采用按需导入：

```vue
<script setup lang="ts">
import { VustButton, VustFormItem, VustIcon, VustInput } from "@vustcc/vue";

const keyword = defineModel<string>({ default: "" });
</script>

<template>
  <VustFormItem
    label="关键词"
    for="search-keyword"
    label-id="search-keyword-label"
    hint="输入名称或标识"
    hint-id="search-keyword-hint"
  >
    <VustInput
      id="search-keyword"
      v-model="keyword"
      name="keyword"
      aria-labelledby="search-keyword-label"
      aria-describedby="search-keyword-hint"
      placeholder="搜索"
    />
  </VustFormItem>
  <VustButton type="primary">
    <VustIcon name="search" :size="16" />
    查询
  </VustButton>
</template>
```

`VustInput`、`VustCheckbox` 和 `VustSelect` 未提供 `id` 时会自动生成；参与原生表单提交时应提供 `name`。复杂控件可通过 `aria-labelledby` 和 `aria-describedby` 显式关联 `VustFormItem` 的标签、提示与错误节点。

受控组件的 `modelValue` 为必填；变化通过 `update:modelValue` 和必要的 `change` 事件返回。Vue 模板继续使用 `readonly`、`maxlength`、`autocomplete`、`for` 和 `class` 等惯用名称，业务参数、默认值及配置对象字段与 React 契约保持一致。

## 组件范围

- 操作：按钮、操作菜单
- 输入：输入框、选择器、开关、复选框、日期时间范围
- 数据：表格、分页、标签、描述列表
- 容器：卡片、对话框、抽屉、模态框
- 反馈：告警、通知、加载、空状态、提示
- 导航：菜单、标签页、面包屑

完整用途、交互、无障碍语义及跨框架映射参见[共享组件契约](https://github.com/vustcc/vust-ui/tree/dev/docs/components)。实际 Props、事件和类型声明以发布包中的 TypeScript 类型为准。

## 约束

- 组件不依赖业务 API、Pinia Store 或 Vue Router。
- 视觉变量由 `@vustcc/tokens` 提供。
- 图标由 `@vustcc/icons` 提供。
- `vue` 是 peer dependency，不会被组件库重复打包。
