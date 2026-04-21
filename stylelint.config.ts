import type { Config } from "stylelint";

export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-html/vue",
    "stylelint-config-html/html",
  ],
  ignoreFiles: ["**/dist/**/*"],
} satisfies Config;
