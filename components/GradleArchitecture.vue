<template>
  <figure class="gradle-architecture my-6">
    <svg
      class="h-auto w-full"
      viewBox="0 0 2100 1200"
      role="img"
      aria-labelledby="gradle-arch-title gradle-arch-desc"
    >
      <title id="gradle-arch-title">Gradle 构建流程架构</title>
      <desc id="gradle-arch-desc">
        Project 中的 settings.gradle 与多个 sub-project 经由 Build Flow
        编排任务，依赖 Cache 与 Dependency Manager，最终产出构建产物（JAR / APK
        / ZIP / WAR）、测试结果， 并发布到 CI Server 与 Repository。
      </desc>

      <!-- 外层虚线容器 -->
      <rect
        x="85"
        y="90"
        width="535"
        height="790"
        rx="14"
        class="dash-container"
      />
      <rect
        x="795"
        y="90"
        width="535"
        height="790"
        rx="14"
        class="dash-container"
      />
      <rect
        x="1505"
        y="90"
        width="535"
        height="790"
        rx="14"
        class="dash-container"
      />

      <!-- 列标题 -->
      <text x="87" y="62" class="column-title">Project</text>
      <text x="797" y="62" class="column-title">Gradle</text>
      <text x="1507" y="62" class="column-title">Output</text>

      <!-- ===== Project 列 ===== -->
      <!-- settings.gradle -->
      <g
        class="anchor"
        role="link"
        tabindex="0"
        :aria-label="`跳转到 ${anchors.settings} 章节`"
        @click="go('settings')"
        @keydown="onKey($event, 'settings')"
      >
        <rect
          x="112"
          y="146"
          width="400"
          height="66"
          rx="12"
          class="anchor-bg"
        />
        <g class="icon" transform="translate(128 152) scale(2.45)">
          <path
            d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
          />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M13 17H8" />
        </g>
        <text x="215" y="196" class="label-muted" font-size="30">
          settings.gradle
        </text>
      </g>

      <!-- 子项目（两个，结构一致） -->
      <g v-for="project in subprojects" :key="project.caption">
        <text :x="115" :y="project.captionY" class="caption" font-size="22">
          {{ project.caption }}
        </text>
        <rect
          x="115"
          :y="project.boxY"
          width="465"
          height="215"
          rx="12"
          class="panel"
        />
        <!-- build.gradle -->
        <g
          class="anchor"
          role="link"
          tabindex="0"
          :aria-label="`跳转到 ${anchors.build} 章节`"
          @click="go('build')"
          @keydown="onKey($event, 'build')"
        >
          <rect
            x="140"
            :y="project.boxY + 15"
            width="390"
            height="76"
            rx="12"
            class="anchor-bg"
          />
          <g
            class="icon"
            :transform="`translate(162 ${project.boxY + 30}) scale(2.08)`"
          >
            <path
              d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
            />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M13 17H8" />
          </g>
          <text x="262" :y="project.boxY + 65" class="label" font-size="27">
            build.gradle
          </text>
          <circle :cx="498" :cy="project.boxY + 52" r="29" class="task-badge" />
          <text
            :x="498"
            :y="project.boxY + 52 + 6.5"
            class="task-badge-text"
            font-size="19"
          >
            Task
          </text>
        </g>
        <!-- source code -->
        <g
          class="icon"
          :transform="`translate(162 ${project.boxY + 135}) scale(2.08)`"
        >
          <path
            d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
          />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="m10 13-2 2 2 2" />
          <path d="m14 13 2 2-2 2" />
        </g>
        <text x="262" :y="project.boxY + 170" class="label" font-size="27">
          source code
        </text>
      </g>

      <!-- ===== Gradle 列 ===== -->
      <!-- Cache -->
      <g
        class="anchor"
        role="link"
        tabindex="0"
        :aria-label="`跳转到 ${anchors.cache} 章节`"
        @click="go('cache')"
        @keydown="onKey($event, 'cache')"
      >
        <rect
          x="830"
          y="150"
          width="440"
          height="105"
          rx="12"
          class="panel anchor-bg"
        />
        <text
          x="1050"
          y="213"
          class="label"
          font-size="29"
          text-anchor="middle"
        >
          Cache
        </text>
      </g>

      <!-- Build Flow（圆柱体） -->
      <path d="M860 380 V 628 A 190 52 0 0 0 1240 628 V 380" class="panel" />
      <ellipse cx="1050" cy="380" rx="190" ry="52" class="panel" />
      <text x="1050" y="512" class="label" font-size="31" text-anchor="middle">
        Build Flow
      </text>
      <g
        v-for="(task, index) in flowTasks"
        :key="index"
        :class="{ anchor: hasAnchor('task') }"
        :role="hasAnchor('task') ? 'link' : undefined"
        :tabindex="hasAnchor('task') ? 0 : undefined"
        :aria-label="
          hasAnchor('task') ? `跳转到 ${anchors.task} 章节` : undefined
        "
        @click="go('task')"
        @keydown="onKey($event, 'task')"
      >
        <circle :cx="task.x" :cy="task.y" r="27" class="task-badge" />
        <circle :cx="task.x" :cy="task.y" r="35" class="anchor-bg" />
        <text
          :x="task.x"
          :y="task.y + 6"
          class="task-badge-text"
          font-size="17"
        >
          Task
        </text>
      </g>

      <!-- Dependency Manager -->
      <rect x="830" y="742" width="440" height="105" rx="12" class="panel" />
      <text x="1050" y="807" class="label" font-size="27" text-anchor="middle">
        Dependency Manager
      </text>

      <!-- ===== Output 列 ===== -->
      <!-- 测试结果 -->
      <rect x="1530" y="158" width="475" height="237" rx="12" class="panel" />
      <g v-for="(name, index) in testNames" :key="name">
        <g
          class="icon icon-check"
          :transform="`translate(1582 ${219 + index * 63}) scale(1.35)`"
        >
          <path d="M20 6 9 17l-5-5" />
        </g>
        <text x="1652" :y="243 + index * 63" class="label" font-size="25">
          {{ name }}
        </text>
      </g>

      <!-- 构建产物 -->
      <rect x="1530" y="420" width="475" height="232" rx="12" class="panel" />
      <text
        v-for="(artifact, index) in artifacts"
        :key="artifact"
        x="1572"
        :y="479 + index * 50"
        class="label mono"
        font-size="21"
      >
        {{ artifact }}
      </text>

      <!-- CI Server -->
      <g class="icon" transform="translate(1538 688) scale(4.2)">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14a9 3 0 0 0 18 0V5" />
        <path d="M3 12a9 3 0 0 0 18 0" />
      </g>
      <circle cx="1652" cy="795" r="26" class="task-badge" />
      <g
        class="icon icon-badge"
        transform="translate(1640.5 783.5) scale(0.95)"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </g>
      <text x="1696" y="722" class="label-muted" font-size="24">CI</text>
      <text x="1696" y="764" class="label-muted" font-size="24">Server</text>

      <!-- Repository（云） -->
      <path
        transform="translate(1812 700) scale(7.4)"
        d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"
        class="panel cloud"
      />
      <text x="1901" y="790" class="label" font-size="23" text-anchor="middle">
        Repository
      </text>

      <!-- ===== 连线（先画线，箭头后画） ===== -->
      <!-- settings.gradle → Build Flow -->
      <path
        d="M485 185 H630 Q676 185 676 231 V445 Q676 505 736 505"
        class="flow-line"
      />
      <!-- sub-project-1 → Build Flow -->
      <path d="M580 452 H606 Q640 452 640 486 V505" class="flow-line" />
      <!-- sub-project-2 → Build Flow -->
      <path
        d="M580 748 H628 Q676 748 676 700 V565 Q676 505 736 505"
        class="flow-line"
      />
      <!-- 三条输入合并为主干 -->
      <path d="M600 505 H830" class="flow-line" />
      <!-- Cache → Build Flow -->
      <path d="M1050 255 V292" class="flow-line" />
      <!-- Dependency Manager → Build Flow -->
      <path d="M1050 742 V704" class="flow-line" />
      <!-- Plugins → Dependency Manager -->
      <path d="M1050 950 V878" class="flow-line" />
      <!-- 主干分支 → Dependencies -->
      <path
        d="M1050 884 H1165 C1305 884 1305 1032 1432 1032 H1505"
        class="flow-line"
      />
      <!-- Build Flow → Output -->
      <path d="M1240 505 H1435" class="flow-line" />

      <!-- 箭头 -->
      <polygon points="858,505 820,487 820,523" class="flow-arrow" />
      <polygon points="1050,323 1031,291 1069,291" class="flow-arrow" />
      <polygon points="1050,676 1031,704 1069,704" class="flow-arrow" />
      <polygon points="1050,872 1031,900 1069,900" class="flow-arrow" />
      <polygon points="1472,505 1434,487 1434,523" class="flow-arrow" />

      <!-- ===== 底部：Plugins / Dependencies ===== -->
      <g
        class="anchor"
        role="link"
        tabindex="0"
        :aria-label="`跳转到 ${anchors.plugins} 章节`"
        @click="go('plugins')"
        @keydown="onKey($event, 'plugins')"
      >
        <rect
          x="795"
          y="950"
          width="535"
          height="180"
          rx="12"
          class="panel anchor-bg"
        />
        <g class="icon" transform="translate(875 1004) scale(2.9)">
          <path
            d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
          />
          <rect x="8" y="2" width="8" height="4" rx="1" />
          <path d="m9 14 2 2 4-4" />
        </g>
        <text x="985" y="1053" class="label" font-size="34">Plugins</text>
        <circle cx="1250" cy="1008" r="27" class="task-badge" />
        <text x="1250" y="1014" class="task-badge-text" font-size="17">
          Task
        </text>
        <circle cx="1250" cy="1088" r="27" class="task-badge" />
        <text x="1250" y="1094" class="task-badge-text" font-size="17">
          Task
        </text>
      </g>

      <g
        class="anchor"
        role="link"
        tabindex="0"
        :aria-label="`跳转到 ${anchors.dependencies} 章节`"
        @click="go('dependencies')"
        @keydown="onKey($event, 'dependencies')"
      >
        <rect
          x="1505"
          y="950"
          width="535"
          height="180"
          rx="12"
          class="panel anchor-bg"
        />
        <g class="icon" transform="translate(1565 1002) scale(3)">
          <path
            d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
          />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="m10 13-2 2 2 2" />
          <path d="m14 13 2 2-2 2" />
        </g>
        <text x="1675" y="1053" class="label" font-size="33">Dependencies</text>
      </g>
    </svg>
  </figure>
</template>

<script setup lang="ts">
import { computed } from "vue";

type AnchorKey =
  | "settings"
  | "build"
  | "cache"
  | "task"
  | "plugins"
  | "dependencies";

/**
 * 可点击区域 → 目标章节的 `id`。
 * 默认按 VitePress 标题 slug 规则推导（小写、空格转连字符），
 * 需要精确控制时可通过 `anchors` prop 覆盖。
 */
const DEFAULT_ANCHORS: Record<AnchorKey, string> = {
  settings: "settings-gradle",
  build: "build-gradle",
  cache: "cache",
  task: "tasks",
  plugins: "plugins",
  dependencies: "dependencies",
};

const props = withDefaults(
  defineProps<{
    /** 覆盖默认锚点，如 { task: "task" } */
    anchors?: Partial<Record<AnchorKey, string>>;
  }>(),
  { anchors: () => ({}) },
);

const anchors = computed<Record<AnchorKey, string>>(() => {
  const merged = { ...DEFAULT_ANCHORS, ...props.anchors };
  return Object.fromEntries(
    Object.entries(merged)
      .filter(([, value]) => Boolean(value))
      .map(([key, value]) => [key, value as string]),
  ) as Record<AnchorKey, string>;
});

function hasAnchor(key: AnchorKey) {
  return Boolean(anchors.value[key]);
}

function go(key: AnchorKey) {
  const id = anchors.value[key];
  if (!id || typeof window === "undefined") return;
  // 用原生 hash 赋值，VitePress 的 router 会处理滚动与历史记录
  window.location.hash = `#${id}`;
}

function onKey(event: KeyboardEvent, key: AnchorKey) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    go(key);
  }
}

const subprojects = [
  { caption: "sub-project-1", captionY: 325, boxY: 345 },
  { caption: "sub-project-2", captionY: 625, boxY: 645 },
] as const;

const flowTasks = [
  { x: 905, y: 578 },
  { x: 1002, y: 596 },
  { x: 1098, y: 596 },
  { x: 1195, y: 578 },
] as const;

const testNames = ["Test A", "Test B", "Test C"] as const;

const artifacts = [
  "Project_App.JAR",
  "Android_App.APK",
  "Gradle_Plugin.ZIP",
  "Web_App.WAR",
] as const;
</script>

<style scoped>
.dash-container {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 2.5;
  stroke-dasharray: 13 10;
}

.panel {
  fill: var(--vp-c-bg-soft);
  stroke: var(--vp-c-divider);
  stroke-width: 2;
}

.cloud {
  stroke-width: 0.28;
}

.column-title {
  fill: var(--vp-c-text-2);
  font-size: 34px;
  font-weight: 700;
}

.caption {
  fill: var(--vp-c-text-2);
  font-weight: 600;
  opacity: 0.75;
}

.label {
  fill: var(--vp-c-text-1);
}

.label-muted {
  fill: var(--vp-c-text-2);
}

.mono {
  font-family: var(--vp-font-family-mono);
}

.task-badge {
  fill: var(--vp-c-text-2);
}

.task-badge-text {
  fill: var(--vp-c-bg);
  font-weight: 500;
  text-anchor: middle;
}

.icon {
  fill: none;
  stroke: var(--vp-c-text-1);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

.icon-check {
  stroke-width: 3;
}

.icon-badge {
  stroke: var(--vp-c-bg);
  stroke-width: 2.4;
}

.flow-line {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.flow-arrow {
  fill: var(--vp-c-text-3);
}

/* 可点击锚点 */
.anchor {
  cursor: pointer;
  outline: none;
}

/* 流动虚线边框（蚂蚁线） */
.anchor .anchor-bg {
  fill: transparent;
  stroke: var(--vp-c-text-3);
  stroke-width: 2;
  stroke-dasharray: 9 7;
  animation: anchor-marching 1.6s linear infinite;
  vector-effect: non-scaling-stroke;
  transition:
    fill 0.18s ease,
    stroke 0.18s ease,
    stroke-width 0.18s ease;
}

.anchor:hover .anchor-bg,
.anchor:focus-visible .anchor-bg {
  fill: var(--vp-c-bg-alt);
  stroke: var(--vp-c-brand-1);
  stroke-width: 2.5;
  animation-duration: 0.7s;
}

/* 圆形徽章的虚线需要更短，避免在小尺寸下糊成一片 */
circle.anchor-bg {
  stroke-dasharray: 5 4;
}

@keyframes anchor-marching {
  to {
    stroke-dashoffset: -32;
  }
}

@media (prefers-reduced-motion: reduce) {
  .anchor .anchor-bg {
    animation: none;
  }
}

.anchor .label,
.anchor .label-muted,
.anchor .task-badge,
.anchor .icon {
  transition:
    fill 0.18s ease,
    stroke 0.18s ease;
}

.anchor:hover .label,
.anchor:hover .label-muted,
.anchor:focus-visible .label,
.anchor:focus-visible .label-muted {
  fill: var(--vp-c-brand-1);
}

.anchor:hover .task-badge,
.anchor:focus-visible .task-badge {
  fill: var(--vp-c-brand-1);
}

.anchor:hover .icon,
.anchor:focus-visible .icon {
  stroke: var(--vp-c-brand-1);
}
</style>
