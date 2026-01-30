<template>
  <div v-html="svgRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import mermaid from "mermaid";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

const render = async (id: string, code: string) => {
  mermaid.initialize({ startOnLoad: false });
  const { svg } = await mermaid.render(id, code);
  return svg;
};

onMounted(async () => {
  svgRef.value = await render(props.id, decodeURIComponent(props.code));
});

const svgRef = ref("");
</script>
