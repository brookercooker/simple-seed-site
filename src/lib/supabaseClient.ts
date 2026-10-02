import { createClient } from "@supabase/supabase-js";

// Isolated Supabase project created just for this pipeline test -- separate from any
// Nova Lighting data. Values are set as Cloudflare env vars for both the production and
// preview environments; see pipeline-test-plan.md in the Nova Lighting project for the
// actual VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY values.
const url = import.meta.env.VITE_SUPABASE_URL as string;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!url || !publishableKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY -- set them as Cloudflare " +
      "environment variables (Production and Preview) and in your local .env.",
  );
}

export const supabase = createClient(url, publishableKey);
