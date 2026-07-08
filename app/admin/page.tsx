export const dynamic = "force-dynamic";
export const revalidate = 0;

import { createClient } from "@/lib/supabase-server";

import {
  Users,
  Building2,
  Coins,
  MessageSquare,
} from "lucide-react";


export default async function AdminPage() {

   console.log("ADMIN PAGE LOADED");

  const supabase = await createClient();


  // Total users
  const {
    count: usersCount,
    error: usersError,
  } = await supabase
    .from("profiles")
    .select("*", {
      count: "exact",
      head: true,
    });


  console.log("ADMIN USERS COUNT:", usersCount);
  console.log("ADMIN USERS ERROR:", usersError);



  // Total departments
  const {
    count: departmentsCount,
    error: departmentsError,
  } = await supabase
    .from("departments")
    .select("*", {
      count: "exact",
      head: true,
    });


  console.log(
    "ADMIN DEPARTMENT COUNT:",
    departmentsCount
  );



  // Total remaining tokens
  const {
    data: tokenData,
  } = await supabase
    .from("profiles")
    .select("remaining_tokens");


  const totalTokens =
    tokenData?.reduce(
      (total, item) =>
        total + (item.remaining_tokens || 0),
      0
    ) || 0;



  // Total conversations
  const {
    count: conversationsCount,
  } = await supabase
    .from("conversations")
    .select("*", {
      count: "exact",
      head: true,
    });



  const stats = [
    {
      title: "Total Users",
      value: usersCount ?? 0,
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Departments",
      value: departmentsCount ?? 0,
      icon: Building2,
      description: "Active departments",
    },
    {
      title: "Remaining Tokens",
      value: totalTokens.toLocaleString(),
      icon: Coins,
      description: "Available user tokens",
    },
    {
      title: "Conversations",
      value: conversationsCount ?? 0,
      icon: MessageSquare,
      description: "AI conversations",
    },
  ];



  return (

    <div className="space-y-8">


      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor users, departments and AI activity.
        </p>

      </div>



      <div className="
        grid
        gap-6
        md:grid-cols-2
        xl:grid-cols-4
      ">


        {stats.map((item)=>{

          const Icon = item.icon;


          return (

            <div
              key={item.title}
              className="
                rounded-2xl
                bg-white
                p-6
                border
                border-slate-200
                shadow-sm
              "
            >

              <div className="flex justify-between">


                <div>

                  <p className="text-sm text-slate-500">
                    {item.title}
                  </p>


                  <h2 className="
                    mt-2
                    text-3xl
                    font-bold
                    text-slate-800
                  ">
                    {item.value}
                  </h2>


                </div>


                <div className="
                  rounded-xl
                  bg-[#006A4E]/10
                  p-3
                ">

                  <Icon
                    size={24}
                    className="text-[#006A4E]"
                  />

                </div>


              </div>


              <p className="mt-4 text-sm text-slate-400">
                {item.description}
              </p>


            </div>

          );

        })}


      </div>




      <div className="
        rounded-2xl
        bg-white
        border
        border-slate-200
        p-6
      ">

        <h2 className="
          text-xl
          font-semibold
          text-slate-800
        ">
          Recent Conversations
        </h2>


        <p className="
          mt-3
          text-sm
          text-slate-500
        ">
          Latest AI activity will appear here.
        </p>


      </div>


    </div>

  );
}