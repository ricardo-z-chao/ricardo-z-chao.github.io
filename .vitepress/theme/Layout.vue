<template>
  <DefaultTheme.Layout>
    <template #layout-bottom>
      <footer
        v-if="showFooter"
        class="border-t border-(--vp-c-gutter) bg-(--vp-c-bg) px-6 py-8"
      >
        <div
          class="mx-auto max-w-(--vp-layout-max-width) text-center text-(--vp-c-text-2)"
        >
          <p>Released under the MIT License.</p>
          <p>Copyright © 2025-present Ricardo.Z.Chao</p>
        </div>
      </footer>
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import DefaultTheme from "vitepress/theme";
import { useRoute } from "vitepress";

const route = useRoute();

const showFooter = computed(() => route.path === "/");
</script>
