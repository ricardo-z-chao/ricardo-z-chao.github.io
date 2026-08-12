<template>
  <!-- 笔记 -->
  <NoteCatalog v-if="props.category === Category.Notes" :rawNoteData="rawNoteData" />
  <!-- 最新文章 -->
  <ArticleCatalog v-else-if="props.category === Category.Articles" :rawArticleData="rawArticleData" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { data as rawContents } from "@vitepress/catalog.data";
import type { ContentData } from "vitepress";
import { Category } from "@vitepress/const";
import NoteCatalog from "./NoteCatalog.vue";
import ArticleCatalog from "./ArticleCatalog.vue";

const props = defineProps<{
  category: Category;
}>();

let rawNoteData = ref<ContentData[]>([]);
let rawArticleData = ref<ContentData[]>([]);

rawNoteData.value = rawContents.filter(e => e.url.startsWith(`/${Category.Notes}`));
rawArticleData.value = rawContents.filter(e => e.url.startsWith(`/${Category.Articles}`));
</script>
