---
layout: home

hero:
  name: 你好，我是 Ricardo
  tagline: 建设中...
---

<script setup>
import { ref } from 'vue';

const contributions = ref('https://ghchart.rshah.org/Ricardo-Z-Chao');
</script>

<div><img :src="contributions"/></div>
