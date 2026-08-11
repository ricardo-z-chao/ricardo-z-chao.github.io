import { createContentLoader, type ContentData } from "vitepress";

declare const data: ContentData[];
export { data };

export default createContentLoader(["notes/*.md", "articles/*.md"], {
  transform(rawData) {
    return rawData.filter((item) => item.frontmatter && item.frontmatter.title);
    //TODO .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date));
  },
});
