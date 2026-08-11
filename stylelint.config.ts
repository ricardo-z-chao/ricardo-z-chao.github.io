import type { Config } from "stylelint";

export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-html/vue",
    "stylelint-config-html/html",
  ],
  ignoreFiles: ["**/dist/**/*"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "custom-variant",
          "theme",
          "apply",
          "layer",
          "responsive",
          "variants",
        ],
      },
    ],
  },
} satisfies Config;
