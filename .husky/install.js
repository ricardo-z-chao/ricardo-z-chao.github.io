/**
 * Skip husky install on the CI
 */

import * as process from "process";

if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
  process.exit(0);
}
const husky = (await import("husky")).default;
husky();
