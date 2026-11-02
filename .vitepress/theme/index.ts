import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Mermaid from "@components/Mermaid.vue";
import Catalog from "@components/Catalog.vue";
import "@/styles/globals.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("Mermaid", Mermaid).component("Catalog", Catalog);
  },
} satisfies Theme;
