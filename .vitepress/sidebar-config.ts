import type { DefaultTheme } from "vitepress";
import { categoryInfo } from "./category";
import matter from "gray-matter";
import { readdirSync, readFileSync } from "node:fs";

function sidebarConfig(): DefaultTheme.SidebarMulti {
  let config: DefaultTheme.SidebarMulti = {};
  let categoryMap: Map<Category, DefaultTheme.SidebarItem[]> = new Map();
  for (const category in categoryInfo) {
    const enumCategory = category as Category;
    let files = readdirSync(`src/${enumCategory}`);
    for (const file of files) {
      let content = readFileSync(`src/${enumCategory}/${file}`);
      const { data } = matter(content);
      if (categoryMap.has(enumCategory)) {
        categoryMap.get(enumCategory)?.push({
          text: data.title,
          link: `/${enumCategory}/${file.replace(".md", "")}`,
        });
      } else {
        categoryMap.set(enumCategory, [
          {
            text: data.title,
            link: `/${enumCategory}/${file.replace(".md", "")}`,
          },
        ]);
      }
    }
  }
  for (const [category, items] of categoryMap.entries()) {
    config[`/${category}/`] = items;
  }
  return config;
}

let config = sidebarConfig();

export default config;
