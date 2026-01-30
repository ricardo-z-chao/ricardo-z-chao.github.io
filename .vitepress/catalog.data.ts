import { createContentLoader } from "vitepress";

export default createContentLoader(["notes/*.md", "articles/*.md"], {
  transform: (rawData) =>
    rawData.filter((item) => item.frontmatter && item.frontmatter.title),
});
