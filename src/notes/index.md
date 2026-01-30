<script lang="ts" setup>
import Catalog from '@components/Catalog.vue'
import { categoryInfo } from '@/category'
</script>

# 笔记目录

<Catalog :category="categoryInfo.notes"/>