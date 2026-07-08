import { createClient } from "@/lib/supabase-server";
import {
  Building2,
  Users,
} from "lucide-react";


export default async function DepartmentsPage() {

  const supabase = await createClient();


  const { data: departments } = await supabase
    .from("departments")
    .select("*")
    .order("id");


  const { data: profiles } = await supabase
    .from("profiles")
    .select("department");


  const departmentData = departments?.map((dept) => {

    const userCount =
      profiles?.filter(
        (user) => user.department === dept.name
      ).length || 0;


    return {
      ...dept,
      userCount,
    };

  }) || [];


  return (
    <div className="space-y-8">


      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Departments
        </h1>

        <p className="mt-2 text-slate-500">
          Manage departments and user allocation.
        </p>
      </div>



      <div
        className="
          rounded-2xl
          bg-white
          border
          border-slate-200
          shadow-sm
          overflow-hidden
        "
      >

        <table className="w-full text-slate-700">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left text-sm text-slate-600 font-semibold">
                Department
              </th>

              <th className="px-6 py-4 text-left text-sm text-slate-600 font-semibold">
                Users
              </th>

              <th className="px-6 py-4 text-left text-sm text-slate-600 font-semibold">
                Status
              </th>

            </tr>

          </thead>


          <tbody>

            {departmentData.map((dept)=>(

              <tr
                key={dept.id}
                className="border-t"
              >

                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="
                      rounded-lg
                      bg-[#006A4E]/10
                      p-2
                    ">
                      <Building2
                        size={18}
                        className="text-[#006A4E]"
                      />
                    </div>


                    <span className="font-medium text-slate-800">
  {dept.name}
</span>

                  </div>

                </td>


                <td className="px-6 py-4">

                  <div className="flex items-center gap-2">

                    <Users size={16}/>

                    <span className="text-slate-700">
  {dept.userCount}
</span>

                  </div>

                </td>


                <td className="px-6 py-4">

                  <span
                    className="
                      rounded-full
                      bg-green-100
                      px-3 py-1
                      text-sm
                      text-green-700
                    "
                  >
                    Active
                  </span>

                </td>


              </tr>

            ))}

          </tbody>

        </table>


      </div>


    </div>
  );
}