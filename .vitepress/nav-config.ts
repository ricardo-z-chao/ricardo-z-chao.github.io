import type { DefaultTheme } from "vitepress";
import { categoryInfo } from "./category";
import type { CategoryDetail } from "./category";

const config = (function (): DefaultTheme.NavItemWithLink[] {
  const config: DefaultTheme.NavItemWithLink[] = [];
  for (const category in categoryInfo) {
    const key = category as keyof typeof categoryInfo;
    const categoryDetail: CategoryDetail = categoryInfo[key];
    config.push({
      text: categoryDetail.name,
      link: categoryDetail.route,
    });
  }
  return config;
})();

export default config;
