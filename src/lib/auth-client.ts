import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import type { auth } from "@/src/lib/auth";
import { ac, roles } from "@/src/lib/permissions";

export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
    adminClient({ ac, roles }),
    inferAdditionalFields<typeof auth>(),
  ],
});