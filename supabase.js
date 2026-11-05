
/* GADHULI shared Supabase client. Load Supabase CDN before this file. */
(function () {
  "use strict";

  const URL = "https://ypmmdytgfuhydzacjbkw.supabase.co";
  const KEY = "sb_publishable_ZhmwEV_6UngmzzxcJmETgw_smrA7qDL";

  if (window.gadhuliSupabase) {
    window.gadhuliDB = window.gadhuliSupabase;
    return;
  }

  if (!window.supabase?.createClient) {
    console.error("Supabase JS SDK not loaded before supabase.js");
    return;
  }

  try {
    const client = window.supabase.createClient(URL, KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    window.gadhuliSupabase = client;
    window.gadhuliDB = client;

    window.gadhuliSupabaseCheck = async () => {
      try {
        const { error } = await client
          .from("products")
          .select("id")
          .limit(1);

        if (error) {
          console.error(error.message, error.code);
          return false;
        }

        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    };

    window.gadhuliAuth = {
      async getUser() {
        const { data, error } = await client.auth.getUser();

        if (error) {
          console.error(error);
          return null;
        }

        return data?.user || null;
      },

      async getSession() {
        const { data, error } = await client.auth.getSession();

        if (error) {
          console.error(error);
          return null;
        }

        return data?.session || null;
      },

      async signOut() {
        const { error } = await client.auth.signOut();

        if (error) {
          console.error(error);
          return false;
        }

        return true;
      }
    };

    client.auth.onAuthStateChange((event, session) => {
      window.dispatchEvent(
        new CustomEvent("gadhuli-auth-change", {
          detail: { event, session }
        })
      );
    });

    window.dispatchEvent(
      new CustomEvent("gadhuli-supabase-ready", {
        detail: { connected: true, client }
      })
    );

    console.info("Gadhuli Supabase client initialized.");

  } catch (e) {
    console.error("Supabase initialization failed", e);
  }
})();
