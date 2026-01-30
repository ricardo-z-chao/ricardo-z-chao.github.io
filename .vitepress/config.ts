import { defineConfig } from "vitepress";
import mermaidPlugin from "../plugins/markdown-it-mermaid";
import markdownItMathjax3 from "markdown-it-mathjax3";
import navConfig from "./nav-config";
import sidebarConfig from "./sidebar-config";
import { githubURL } from "./const";
import path from "node:path";

export default defineConfig({
  title: "我的主页",
  srcDir: "src",
  cleanUrls: true,
  lastUpdated: true,
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname),
        "@components": path.resolve(__dirname, "../components"),
      },
    },
  },
  markdown: {
    image: {
      lazyLoading: true,
    },
    config: (md) => {
      md.use(mermaidPlugin).use(markdownItMathjax3);
    },
  },
  themeConfig: {
    nav: navConfig,
    sidebar: sidebarConfig,
    search: {
      provider: "local",
    },
    lastUpdated: {
      text: "最后更新于",
    },
    outline: {
      level: [1, 3],
    },
    logo: "/favicon.ico",
    socialLinks: [{ icon: "github", link: githubURL }],
    footer: {
      message: `Released under the <a href="${githubURL}/introduction/blob/master/LICENSE">MIT License</a>.`,
      copyright: `Copyright © 2025-present <a href="${githubURL}">Ricardo.Z.Chao</a>`,
    },
  },
});
