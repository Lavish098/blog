import { getAdminAuth } from "@/lib/firebase/admin";

export async function POST(request) {
  try {
    const authorization = request.headers.get("authorization") || "";
    const token = authorization.replace("Bearer ", "");

    if (!token) {
      return Response.json({ error: "Missing authentication token." }, { status: 401 });
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);

    if (!decoded.admin) {
      return Response.json({ error: "Only admins can add another admin." }, { status: 403 });
    }

    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { ...user.customClaims, admin: true });

    return Response.json({ message: `${email} has been made an admin.` });
  } catch (err) {
    return Response.json({ error: err.message || "Could not add admin." }, { status: 500 });
  }
}
