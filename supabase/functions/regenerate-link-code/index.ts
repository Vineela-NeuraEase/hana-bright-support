
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the session of the authenticated user
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    // If no session, return unauthorized error
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Parse the request body
    const { userId } = await req.json();

    // Validate parameters
    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log(`Regenerating link code for user: ${userId}`);

    // Implement link code regeneration logic
    // Step 1: Delete existing link code
    const { error: deleteError } = await supabaseClient
      .from("user_links")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      console.error("Error deleting existing link code:", deleteError);
      throw deleteError;
    }

    // Step 2: Update the profile to trigger the create_user_link_code trigger
    const { error: updateError } = await supabaseClient
      .from("profiles")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating profile to regenerate link code:", updateError);
      throw updateError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
