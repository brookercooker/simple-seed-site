import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * This test harness has no staff login UI -- the chat_requests RLS policy requires an
 * authenticated session (created_by = auth.uid()) regardless, so this establishes one via
 * Supabase's anonymous auth: a real authenticated session, no sign-in form needed. Requires
 * "Anonymous Sign-ins" enabled in the Supabase project's Auth settings.
 *
 * This is a placeholder for the real Site Manager-style staff login the architecture doc
 * assumes -- fine for testing the pipeline's mechanics, not a pattern to carry over to
 * Nova Lighting itself, where "staff" needs to mean something.
 */
export function useStaffSession() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function ensureSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        if (!cancelled) setReady(true);
        return;
      }

      const { error: signInError } = await supabase.auth.signInAnonymously();
      if (cancelled) return;

      if (signInError) {
        setError(signInError.message);
        return;
      }
      setReady(true);
    }

    ensureSession();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ready, error };
}
