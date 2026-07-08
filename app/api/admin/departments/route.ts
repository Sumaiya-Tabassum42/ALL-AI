import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";


export async function GET() {

  try {

    const {
      data: departments,
      error,
    } = await supabaseAdmin
      .from("departments")
      .select("id, name")
      .order("id", {
        ascending: true,
      });



    if (error) {

      console.error(
        "FETCH DEPARTMENTS ERROR:",
        error
      );


      return NextResponse.json(
        {
          error: "Unable to fetch departments",
        },
        {
          status: 500,
        }
      );

    }



    return NextResponse.json(
      departments || []
    );


  } catch (error) {


    console.error(
      "DEPARTMENT API ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      {
        status:500,
      }
    );

  }

}