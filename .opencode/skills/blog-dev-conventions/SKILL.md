---
name: blog-dev-conventions
description: 本博客项目（VitePress + Vue 3 + Tailwind v4 + shadcn-vue）的组件与样式开发规范。在新增或修改 components/ 业务组件、components/ui/ UI 原语（含 shadcn-vue CLI 添加）、全局注册组件、styles/globals.css 设计 token / 暗色模式、Tailwind 类用法、cn()/cva 变体时使用。触发词：开发博客站点功能、加组件、改组件、改主题、写样式、shadcn-vue add、components/ui、globals.css。
---

# 博客站点开发规范

本仓库是 VitePress 个人博客。任何涉及组件与样式的改动都先遵循本规范。

## 技术栈与目录职责

- VitePress 1.x + Vue 3（`<script setup>`）+ TypeScript + Tailwind CSS v4（`@tailwindcss/postcss`）+ shadcn-vue（reka-ui + cva）
- 目录职责：
  - `components/*.vue` — 网站业务组件，PascalCase、一文件一组件、直接平铺
  - `components/ui/<name>/` — shadcn-vue UI 原语，每个原语一个目录，含 `index.ts`
  - `lib/utils.ts` — `cn()`（clsx + tailwind-merge）
  - `styles/globals.css` — 全局样式与设计 token 的唯一入口
  - `.vitepress/theme/index.ts` — 全局组件注册（`enhanceApp` 里 `app.component(...)`）
  - `.vitepress/const.ts` — 站点常量（如 `Category` 枚举）
- 路径别名：`@/*` → 仓库根目录（**不是** `src/`），另有 `@components/*`、`@vitepress/*`、`@lib/*`
- 图标库：`@lucide/vue`（注意不是 `@lucide/vue-next`）

## 新增业务组件（components/*.vue）

1. 文件名 PascalCase，与组件名一致，平铺放 `components/`，不为单个组件建目录
2. 一律 `<script setup lang="ts">`；禁止新增不带 `lang="ts"` 的组件（`ContentHeader.vue` 是历史例外，新代码不要照抄）
3. Props 用类型声明 + `withDefaults`，例如：

   ```vue
   const props = withDefaults(defineProps<{ category: Category; size?: "sm" | "md" }>(), {
     size: "md",
   });
   ```

   Emits 用 `defineEmits<{ change: [value: string] }>()`
4. 需要在 markdown 中直接使用的组件，必须在 `.vitepress/theme/index.ts` 的 `enhanceApp` 中注册，如 `app.component("Catalog", Catalog)`
5. 样式优先用 Tailwind 工具类；class 合并一律 `cn()`，不用模板字符串拼接
6. import 大致顺序：vue 核心 → 第三方库 → 类型导入 → 别名导入（`@/`、`@components/`）→ 相对导入

## 新增 / 修改 UI 原语（components/ui/）

1. **优先使用 shadcn-vue CLI** 生成，不要从零手写：

   ```bash
   pnpm dlx shadcn-vue@latest add <name>
   ```

   `components.json` 已配置：`new-york` 风格、`styles/globals.css`、`baseColor: neutral`、`cssVariables: true`、lucide 图标、`@/components/ui` 输出路径。不要改动这些配置，除非用户明确要求。
2. 生成后按项目既有模式核对 / 调整：
   - 用 reka-ui 的 `Primitive` 组合，根节点带 `data-slot` 属性（如 `data-slot="item"`），并透传 `data-*` 变量
   - 变体用 `cva()` 定义（含 `defaultVariants`），放在 `index.ts` 并导出 `xxxVariants` 与 `VariantProps` 类型
   - `asChild` 通过 `Primitive as-child` 实现，不自行实现插槽切换逻辑
   - class 合并用 `cn()`
   - `index.ts` 统一 re-export（组件 + variants + 类型），消费方从 `@/components/ui/<name>` 导入，不从深层 `.vue` 文件导入
3. 手写原语时同样遵循以上模式，参考 `components/ui/item/Item.vue` 与 `components/ui/item/index.ts`
4. 图标走 lucide（`@lucide/vue`），尺寸用 `class="size-4"` 等工具类，不写死 width/height 属性

## 样式与主题（styles/globals.css）

1. `styles/globals.css` 是唯一的全局样式入口，`@import "tailwindcss";` 必须是第一行，`tw-animate-css` 次之
2. 颜色用 oklch CSS 变量定义；**新增任何设计 token 必须三处同步**：
   - `:root`（亮色值）
   - `.dark`（暗色值）
   - `@theme inline` 中的 `--color-*` / `--radius-*` 映射（供 Tailwind 使用）
3. 暗色模式靠 `.dark` class 切换，`@custom-variant dark (&:is(.dark *));` 已配置，不要改成 `prefers-color-scheme`
4. 半径基于 `--radius`（0.625rem）推导：`rounded-sm/md/lg/xl` 已在 `@theme inline` 映射，直接使用即可
5. `@layer base` 只放全局基础行为（如 `border-border`、`bg-background text-foreground`），不放组件样式
6. **按场景选择颜色变量**：
   - 站内 UI / 组件级样式 → shadcn token + Tailwind 工具类（`bg-card`、`text-muted-foreground`、`border-border` …）
   - 文章正文中与 VitePress 默认主题贴合的组件 → 可以用 `var(--vp-c-*)` 任意值（参考 `ContentHeader.vue`）
   - 同一个组件内只用一种体系，不要混搭到难以维护
7. 避免写 `<style>` 块；工具类无法表达时才用，scoped 局部样式即可
8. stylelint 已忽略 `@custom-variant` / `@theme` / `@apply` / `@layer` 等 at-rule，无需重复添加配置

## 完成验证

改动组件 / 样式后依次运行：

```bash
pnpm typecheck    # vue-tsc 类型检查
pnpm lint:ts      # eslint
pnpm lint:css     # stylelint
pnpm docs:build   # 确认 VitePress 能完整构建
```

四条全部通过才算完成；任一失败先修复再汇报。

## 提交前检查清单

- [ ] 新组件带 `lang="ts"`，props/emits 类型化，class 用 `cn()` 合并
- [ ] UI 原语带 `data-slot`、`cva` 变体、`index.ts` 统一导出
- [ ] 新设计 token 在 `:root` / `.dark` / `@theme inline` 三处同步
- [ ] 需要 markdown 中可用的组件已在 `.vitepress/theme/index.ts` 注册
- [ ] 未写死颜色值（应为 CSS 变量或 token 工具类）
- [ ] 验证命令全部通过
