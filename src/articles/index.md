<script lang="ts" setup>
import Catalog from '@components/Catalog.vue'
import { categoryInfo } from '@/category'
</script>

# 文章目录

<Catalog :category="categoryInfo.articles"/>