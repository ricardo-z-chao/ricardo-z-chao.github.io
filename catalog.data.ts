import { createContentLoader } from 'vitepress'
import { Category } from './constants/category-const';

export default createContentLoader([`${Category.ARTICLE}/*.md`, `${Category.NOTE}/*.md`], {
  transform: (rawData) => rawData.filter(item => item.frontmatter && item.frontmatter.title)
});