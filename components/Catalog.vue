<template>
  <ul>
    <li v-for="content of contents" :key="content.url">
      <a :href="content.url">{{ content.frontmatter.title }}</a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { data as catalog } from "@vitepress/catalog.data";
import type { ContentData } from "vitepress";
import type { Category } from "@vitepress/category";

const props = defineProps<{
  category: Category;
}>();

let contents = ref([] as ContentData[]);

onMounted(() => {
  contents.value = catalog.filter((e) =>
    e.url.startsWith(`/${props.category}`),
  );
});
</script>
