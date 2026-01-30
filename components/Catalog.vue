<template>
  <ul>
    <li v-for="content of contents">
      <a :href="content.url">{{ content.frontmatter.title }}</a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { data as catalog } from "@/catalog.data";
import type { ContentData } from "vitepress";

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
