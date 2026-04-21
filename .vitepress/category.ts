export type Category = "notes" | "articles" | "spring";

export type CategoryDetail = {
  name: string;
  route: string;
};

export const categoryInfo: Record<Category, CategoryDetail> = {
  notes: {
    name: "笔记",
    route: "/notes",
  },
  articles: {
    name: "文章",
    route: "/articles",
  },
  spring: {
    name: "Spring",
    route: "/spring",
  },
};
