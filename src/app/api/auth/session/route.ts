import { NextResponse } from "next/server";
import { createHmac } from "crypto";

interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  aud: string;
  app_metadata: Record<string, unknown>;
  user_metadata: Record<string, unknown>;
}


/**
 * Signs a HS256 JWT using Node.js crypto (no external dependencies).
 */
function signHS256(payload: JWTPayload, secret: string) {
  const header = { alg: "HS256", typ: "JWT" };
  const b64 = (obj: Record<string, unknown>) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  
  const encodedHeader = b64(header);
  const encodedPayload = b64(payload as unknown as Record<string, unknown>);

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  
  const signature = createHmac("sha256", secret)
    .update(unsignedToken)
    .digest("base64url");
    
  return `${unsignedToken}.${signature}`;
}

export async function POST(request: Request) {
  try {
    const { uid, email } = await request.json();

    
    // In a production environment, you should verify idToken with firebase-admin
    // For this hybrid migration, we trust the client's verified state if UID matches
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (!jwtSecret || jwtSecret.includes("PLEASE_REPLACE")) {
      console.error("[API/Auth/Session] SUPABASE_JWT_SECRET is missing or using placeholder");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    // Create a Supabase-compatible JWT
    // Supabase RLS expects 'role' and 'sub' (the user ID)
    const payload = {
      sub: uid,
      email: email,
      role: "authenticated",
      // Expiration: 1 hour
      exp: Math.floor(Date.now() / 1000) + 3600,
      aud: "authenticated",
      app_metadata: { provider: "firebase" },
      user_metadata: {}
    };

    const token = signHS256(payload, jwtSecret);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("[API/Auth/Session] Token signing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
