<template>
  <Accordion type="single" collapsible>
    <AccordionItem
      v-for="([key, contents], index) in data"
      :key="index"
      :value="String(index)"
    >
      <AccordionTrigger>{{ key }}</AccordionTrigger>
      <AccordionContent>
        <Item
          class="mt-4"
          variant="outline"
          size="sm"
          as-child
          v-for="content in contents"
          :key="content.url"
        >
          <div>
            <ItemContent>
              <a :href="content.url">
                <ItemTitle>{{ content.frontmatter.title }}</ItemTitle>
              </a>
            </ItemContent>
            <ItemContent>
              <ItemDescription
                >最近修改于：{{ content.frontmatter.createAt }}</ItemDescription
              >
            </ItemContent>
          </div>
        </Item>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import type { ContentData } from "vitepress";
import { NoteType } from "@vitepress/const";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

const props = defineProps<{
  rawNoteData: ContentData[];
}>();

const data = reactive(new Map<NoteType, ContentData[]>());

for (const type of Object.values(NoteType)) {
  data.set(type, []);
}
for (const note of props.rawNoteData) {
  const type: NoteType = note.frontmatter.type;
  data.get(data.has(type) ? type : NoteType.Other)?.push(note);
}
</script>
