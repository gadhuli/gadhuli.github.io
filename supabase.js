/* =====================================================
   GADHULI - SUPABASE CONNECTION
   supabase.js
===================================================== */

(function () {
  "use strict";

  const SUPABASE_URL =
    "https://ypmmdytgfuhydzacjbkw.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_ZhmwEV_6UngmzzxcJmETgw_smrA7qDL";

  // Prevent accidental duplicate initialization
  if (window.gadhuliSupabase) {
    console.info("Gadhuli Supabase already initialized.");
    return;
  }

  if (!window.supabase?.createClient) {
    console.error(
      "Supabase JS load হয়নি। আগে Supabase CDN load করো।"
    );
    return;
  }

  let client;

  try {
    client = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );

    window.gadhuliSupabase = client;
    window.gadhuliDB = client;

  } catch (error) {
    console.error("Supabase initialization failed:", error);
    return;
  }

  /* DATABASE CONNECTION CHECK */

  window.gadhuliSupabaseCheck = async function () {
    try {
      const { data, error } = await client
        .from("products")
        .select("id")
        .limit(1);

      if (error) {
        console.error(
          "Products table / permission error:",
          error.message,
          error.code
        );
        return false;
      }

      console.info("Gadhuli database query successful.");
      return true;

    } catch (error) {
      console.error("Database check failed:", error);
      return false;
    }
  };

  /* AUTH HELPERS */

  window.gadhuliAuth = {
    async getUser() {
      try {
        const { data, error } =
          await client.auth.getUser();

        if (error) {
          console.error("Get user failed:", error.message);
          return null;
        }

        return data?.user ?? null;

      } catch (error) {
        console.error("Auth user error:", error);
        return null;
      }
    },

    async getSession() {
      try {
        const { data, error } =
          await client.auth.getSession();

        if (error) {
          console.error("Get session failed:", error.message);
          return null;
        }

        return data?.session ?? null;

      } catch (error) {
        console.error("Auth session error:", error);
        return null;
      }
    },

    async signOut() {
      try {
        const { error } = await client.auth.signOut();

        if (error) {
          console.error("Logout failed:", error.message);
          return false;
        }

        return true;

      } catch (error) {
        console.error("Logout error:", error);
        return false;
      }
    }
  };

  /* AUTH STATE CHANGES */

  client.auth.onAuthStateChange((event, session) => {
    window.dispatchEvent(
      new CustomEvent("gadhuli-auth-change", {
        detail: {
          event,
          session
        }
      })
    );
  });

  /* READY EVENT */

  window.dispatchEvent(
    new CustomEvent("gadhuli-supabase-ready", {
      detail: {
        connected: true,
        client
      }
    })
  );

  console.info("Gadhuli Supabase client initialized.");
})();
