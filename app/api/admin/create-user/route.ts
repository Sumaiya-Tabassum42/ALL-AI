import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { DEFAULT_TOKEN_BALANCE } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      password,
      full_name,
      department_id,
      token_limit,
      allowed_services,
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (!department_id) {
      return NextResponse.json(
        { error: "Please select a department." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(allowed_services) ||
      allowed_services.length === 0
    ) {
      return NextResponse.json(
        { error: "Please select at least one AI service." },
        { status: 400 }
      );
    }

    const initialTokens =
      typeof token_limit === "number" && token_limit > 0
        ? token_limit
        : DEFAULT_TOKEN_BALANCE;

    const {
      data: departmentData,
      error: departmentError,
    } = await supabaseAdmin
      .from("departments")
      .select("id,name")
      .eq("id", department_id)
      .single();

    if (departmentError || !departmentData) {
      return NextResponse.json(
        { error: "Invalid department." },
        { status: 400 }
      );
    }

    const {
      data: createData,
      error: createError,
    } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        role: "user",
        department: departmentData.name,
        department_id: departmentData.id,
      },
    });

    if (createError) {
      console.error(createError);

      return NextResponse.json(
        {
          error: createError.message,
        },
        {
          status: 500,
        }
      );
    }

    const user = createData.user;

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email,
          full_name,

          role: "user",

          department: departmentData.name,
          department_id: departmentData.id,

          daily_quota: initialTokens,
          remaining_tokens: initialTokens,

          allowed_services,

          account_status: "active",

          last_refresh: new Date(),
        },
        {
          onConflict: "id",
        }
      );

    if (profileError) {
      console.error(profileError);

      return NextResponse.json(
        {
          error: profileError.message,
        },
        {
          status: 500,
        }
      );
    }

    revalidatePath("/admin");
    revalidatePath("/admin/users");

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}