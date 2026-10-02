/* =====================================================
   GADHULI - SUPABASE CONNECTION
   supabase.js
===================================================== */

const SUPABASE_URL =
"https://ypmmdytgfuhydzacjbkw.supabase.co";

const SUPABASE_KEY =
"sb_publishable_ZhmwEV_6UngmzzxcJmETgw_smrA7qDL";

/* =====================================================
   CREATE SUPABASE CLIENT
===================================================== */

try {

  if (!window.supabase) {

    console.error(
      "Supabase JS library load হয়নি।"
    );

  } else {

    window.gadhuliSupabase =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );

    console.log(
      "Gadhuli Supabase Connected ✅"
    );

  }

} catch (error) {

  console.error(
    "Supabase connection error:",
    error
  );

}


/* =====================================================
   CONNECTION CHECK
===================================================== */

window.gadhuliSupabaseCheck =
async function () {

  try {

    if (!window.gadhuliSupabase) {

      console.error(
        "Gadhuli Supabase client পাওয়া যায়নি ❌"
      );

      return false;

    }

    const {
      data,
      error
    } =
    await window.gadhuliSupabase
      .from("products")
      .select("id")
      .limit(1);

    if (error) {

      console.error(
        "Supabase Database Error:",
        error
      );

      return false;

    }

    console.log(
      "Gadhuli Database Connected ✅",
      data
    );

    return true;

  } catch (error) {

    console.error(
      "Supabase Check Failed:",
      error
    );

    return false;

  }

};


/* =====================================================
   GLOBAL DATABASE VARIABLE
===================================================== */

window.gadhuliDB =
window.gadhuliSupabase;


/* =====================================================
   AUTH HELPER
===================================================== */

window.gadhuliAuth =
{

  async getUser() {

    if (!window.gadhuliSupabase) {
      return null;
    }

    try {

      const {
        data,
        error
      } =
      await window.gadhuliSupabase.auth.getUser();

      if (error) {

        console.error(
          "Auth User Error:",
          error
        );

        return null;

      }

      return data?.user || null;

    } catch (error) {

      console.error(error);

      return null;

    }

  },


  async getSession() {

    if (!window.gadhuliSupabase) {
      return null;
    }

    try {

      const {
        data,
        error
      } =
      await window.gadhuliSupabase.auth.getSession();

      if (error) {

        console.error(
          "Auth Session Error:",
          error
        );

        return null;

      }

      return data?.session || null;

    } catch (error) {

      console.error(error);

      return null;

    }

  }

};


/* =====================================================
   SUPABASE AUTH STATE
===================================================== */

if (window.gadhuliSupabase) {

  window.gadhuliSupabase.auth.onAuthStateChange(
    (event, session) => {

      console.log(
        "Gadhuli Auth:",
        event,
        session?.user?.email || "No user"
      );

      window.dispatchEvent(
        new CustomEvent(
          "gadhuli-auth-change",
          {
            detail: {
              event: event,
              session: session
            }
          }
        )
      );

    }
  );

}


/* =====================================================
   READY EVENT
===================================================== */

window.dispatchEvent(
  new CustomEvent(
    "gadhuli-supabase-ready",
    {
      detail: {
        connected:
          !!window.gadhuliSupabase
      }
    }
  )
);

console.log(
  "Gadhuli Supabase System Ready 🚀"
);
