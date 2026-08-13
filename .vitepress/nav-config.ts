import type { DefaultTheme } from "vitepress";
import { Category, categoryInfo } from "./const";

const config: DefaultTheme.NavItemWithLink[] = [];

for (const key in categoryInfo) {
  const categoryDetail = categoryInfo[key as Category];
  config.push({
    text: categoryDetail.name,
    link: categoryDetail.route,
  });
}

export default config;
