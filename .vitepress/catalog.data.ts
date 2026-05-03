import { createContentLoader, type ContentData } from "vitepress";

declare const data: ContentData[];
export { data };

export default createContentLoader(
  ["notes/*.md", "articles/*.md", "spring/*.md"],
  {
    transform: (rawData) =>
      rawData.filter((item) => item.frontmatter && item.frontmatter.title),
  },
);
