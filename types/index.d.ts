declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

type Category = "notes" | "articles";

type CategoryDetail = {
  name: string;
  route: string;
};
