import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ChatLayout from "@/components/chat/chat-layout";
import { Suspense } from "react";

interface WorkspacePageProps {
  params: Promise<{
    services?: string;
  }>;
}

export default async function WorkspacePage({
  params,
}: WorkspacePageProps) {
  const { services } = await params;
  const service = services ?? "";

  const serviceNames: Record<string, string> = {
    text: "Text Service",
    image: "Image Service",
    document: "Document Generation",
    design: "Design Support",
    presentation: "Presentation",
    data_analysis: "Data Analysis",
    more: "More Services",
  };

  const supabase = await createClient();

  // Check logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get allowed services
  const { data: profile } = await supabase
    .from("profiles")
    .select("allowed_services")
    .eq("id", user.id)
    .single();

  const allowedServices: string[] =
    profile?.allowed_services ?? [];

  // Block unauthorized access
  if (!allowedServices.includes(service)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white p-10 shadow">
          <h1 className="text-2xl font-bold text-red-600">
            Access Denied
          </h1>

          <p className="mt-3 text-slate-600">
            Your administrator has not granted access to this AI service.
          </p>
        </div>
      </div>
    );
  }

  return (
  <Suspense fallback={<div>Loading...</div>}>
    <ChatLayout
      service={service}
      title={serviceNames[service] || "AI Workspace"}
    />
  </Suspense>
)
}