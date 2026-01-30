import type { DefaultTheme } from "vitepress";
import { categoryInfo } from "./category";

function navConfig(): DefaultTheme.NavItemWithLink[] {
  let config: DefaultTheme.NavItemWithLink[] = [];
  for (const category in categoryInfo) {
    const key = category as keyof typeof categoryInfo;
    const categoryDetail: CategoryDetail = categoryInfo[key];
    config.push({
      text: categoryDetail.name,
      link: categoryDetail.route,
    });
  }
  return config;
}

let config = navConfig();

export default config;
