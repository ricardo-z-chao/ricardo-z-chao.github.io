import * as packageJson from "../package.json";

export const githubURL = packageJson.repository.url;

export enum Category {
  Notes = "notes",
  Articles = "articles",
}

export type CategoryDetail = {
  name: string;
  route: string;
};

export const categoryInfo: Record<Category, CategoryDetail> = {
  [Category.Notes]: {
    name: "笔记",
    route: `/${Category.Notes}/`,
  },
  [Category.Articles]: {
    name: "最新文章",
    route: `/${Category.Articles}/`,
  },
};

export enum NoteType {
  Java = "Java",
  Database = "数据库",
  JavaScript = "JavaScript",
  Other = "其他",
}
