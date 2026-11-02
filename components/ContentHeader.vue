<template>
  <div
    class="my-6 overflow-hidden rounded-lg border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg-soft)] text-sm"
    v-if="hasIntro || (references && references.length > 0)"
  >
    <div
      v-if="hasIntro"
      class="flex gap-3 bg-[var(--vp-c-bg-alt)] p-4"
      :class="{
        'border-b border-[var(--vp-c-divider)]':
          references && references.length > 0,
      }"
    >
      <div class="mt-0.5 h-5 w-5 shrink-0 text-[var(--vp-c-brand)]">
        <CircleAlert class="h-full w-full" />
      </div>
      <div class="text-[var(--vp-c-text-1)] leading-relaxed">
        <slot></slot>
      </div>
    </div>
    <div class="px-4 py-3" v-if="references && references.length > 0">
      <div
        class="mb-2 flex items-center gap-1.5 font-semibold text-[var(--vp-c-text-2)]"
      >
        <Book class="h-4 w-4" />
        参考文章
      </div>
      <div
        v-for="(reference, index) in references"
        :key="index"
        class="flex items-center gap-2 py-1 text-[var(--vp-c-text-2)]"
      >
        <LinkIcon class="h-4 w-4" />
        <a
          :href="reference.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-[var(--vp-c-brand)] transition-colors hover:text-[var(--vp-c-brand-dark)] hover:underline"
        >
          {{ reference.text }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { Book, CircleAlert, LinkIcon } from "@lucide/vue";

defineProps({
  references: {
    type: Array,
    default: () => [],
  },
});

const slots = useSlots();

const hasIntro = computed(() => {
  if (!slots.default) return false;
  const nodes = slots.default();
  return nodes.some((node) => {
    if (typeof node.children === "string") {
      return node.children.trim().length > 0;
    }
    return true;
  });
});
</script>
