<template>
  <div class="flex w-full max-w-md flex-col gap-6">
    <ItemGroup class="gap-4">
      <Item
        v-for="article in data"
        :key="article.title"
        variant="outline"
        as-child
        role="listitem"
      >
        <div>
          <ItemContent>
            <ItemTitle class="line-clamp-1">
              <a :href="article.url">
                {{ article.title }}
              </a>
            </ItemTitle>
          </ItemContent>
          <ItemContent class="flex-none text-center">
            <ItemDescription
              >最近修改于：{{ article.createAt }}</ItemDescription
            >
          </ItemContent>
        </div>
      </Item>
    </ItemGroup>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import type { ContentData } from "vitepress";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";

const props = defineProps<{
  rawArticleData: ContentData[];
}>();

type NoteData = {
  title: string;
  url: string;
  createAt: string;
};

const data = reactive([] as NoteData[]);

data.push(
  ...props.rawArticleData.map((article) => ({
    title: article.frontmatter.title,
    url: article.url,
    createAt: article.frontmatter.createAt, // TODO 时间处理
  })),
);
</script>
