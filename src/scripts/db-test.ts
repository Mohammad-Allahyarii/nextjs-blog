import { db } from "@/src/lib/db";

db.$queryRaw`SELECT 1`
  .then((r) => console.log("OK", r))
  .catch((e) => console.error("FAIL", e))
  .finally(() => process.exit());