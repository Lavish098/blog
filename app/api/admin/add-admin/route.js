import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request) {
  try {
    const authorization = request.headers.get("authorization") || "";
    const token = authorization.replace("Bearer ", "");

    if (!token) {
      return Response.json({ error: "Missing authentication token." }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      return Response.json({ error: "Invalid authentication token." }, { status: 401 });
    }

    const { data: requester, error: requesterError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userData.user.id)
      .single();

    if (requesterError || !requester?.is_admin) {
      return Response.json({ error: "Only admins can add another admin." }, { status: 403 });
    }

    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required." }, { status: 400 });
    }

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id,email")
      .eq("email", email)
      .limit(1);

    if (profileError) {
      throw profileError;
    }

    const profile = profiles?.[0];

    if (!profile) {
      return Response.json({ error: "No profile found for that email." }, { status: 404 });
    }

    const { error: updateError } = await supabase.from("profiles").update({ is_admin: true }).eq("id", profile.id);

    if (updateError) {
      throw updateError;
    }

    return Response.json({ message: `${email} has been made an admin.` });
  } catch (err) {
    return Response.json({ error: err.message || "Could not add admin." }, { status: 500 });
  }
}
