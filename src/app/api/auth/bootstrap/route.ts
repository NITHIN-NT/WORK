import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized: Missing identity token" }, { status: 401 });
    }

    // Securely verify the token with Firebase Auth API (Server-to-Server)
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const verifyResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        body: JSON.stringify({ idToken }),
        headers: { "Content-Type": "application/json" },
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok || !verifyData.users?.[0]) {
      return NextResponse.json({ error: "Invalid identity token" }, { status: 401 });
    }

    const { email, localId: uid, displayName, photoUrl } = verifyData.users[0];
    const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;

    // Use a hardcoded fallback check if environment variable is missing (for first-time setup)
    const isAuthorized = bootstrapEmail ? email === bootstrapEmail : email === 'nithinnt07@gmail.com';

    if (!isAuthorized) {
      return NextResponse.json({ error: "Forbidden: Not an authorized bootstrap identity" }, { status: 403 });
    }

    // Check if user already exists in Supabase
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .single();

    if (!existingUser || (checkError && checkError.code === 'PGRST116')) {
      // Create new admin profile
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: uid,
            email,
            name: displayName,
            photo_url: photoUrl,
            role: "Administrator",
            status: "Active",
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error("[API/Auth/Bootstrap] Supabase insert error:", insertError);
        return NextResponse.json({ error: "Failed to create administrator profile" }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        profile: newUser,
        message: "Administrator profile bootstrapped successfully" 
      });
    } else {
      // User exists - ensure they have the Administrator role if email matches
      if (existingUser.role !== 'Administrator') {
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ role: 'Administrator', status: 'Active' })
          .eq('id', uid)
          .select()
          .single();
        
        if (updateError) {
          console.error("[API/Auth/Bootstrap] Supabase update error:", updateError);
          return NextResponse.json({ error: "Failed to upgrade profile to Administrator" }, { status: 500 });
        }
        
        return NextResponse.json({ success: true, profile: updatedUser, message: "Profile upgraded to Administrator" });
      }
      
      return NextResponse.json({ success: true, profile: existingUser, message: "Administrator identity already verified" });
    }



  } catch (error) {
    console.error("[API/Auth/Bootstrap] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

