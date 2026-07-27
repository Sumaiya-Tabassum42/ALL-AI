// app/admin/analytics/page.tsx

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { createClient } from "@/lib/supabase-server";

import AnalyticsCards from "@/components/admin/analytics/analytics-cards";

import TopTokenChart from "@/components/admin/analytics/top-token-chart";

import DepartmentChart from "@/components/admin/analytics/department-chart";

import TokenDistribution from "@/components/admin/analytics/token-pie-chart";

import ServiceUsageChart from "@/components/admin/analytics/service-usage-chart";

import ActiveUsersTable from "@/components/admin/analytics/active-users-table";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // Fetch profiles
  const { data: profiles = [] } = await supabase.from("profiles").select(`
    id,
    full_name,
    email,
    daily_quota,
    remaining_tokens,
    created_at,
    department_id
  `);

  // Fetch departments
  const { data: departments = [] } = await supabase
    .from("departments")
    .select("*");

  // Fetch conversations

  const { data: conversations = [] } = await supabase.from("conversations")
    .select(`
    id,
    user_id,
    service
  `);
  //-------------------------------------------------------
  // Analytics Calculations
  //-------------------------------------------------------

  const totalUsers = profiles.length;

  const totalAssignedTokens = profiles.reduce(
    (sum, user) => sum + (user.daily_quota ?? 0),
    0,
  );

  const totalRemainingTokens = profiles.reduce(
    (sum, user) => sum + (user.remaining_tokens ?? 0),
    0,
  );

  const totalUsedTokens = totalAssignedTokens - totalRemainingTokens;

  const averageUsage =
    totalAssignedTokens === 0
      ? 0
      : Number(((totalUsedTokens / totalAssignedTokens) * 100).toFixed(1));

  //-------------------------------------------------------
  // Top Token Consumers
  //-------------------------------------------------------

  const topTokenConsumers = profiles
    .map((user) => ({
      name: user.full_name || user.email || "Unknown",
      tokensUsed: (user.daily_quota ?? 0) - (user.remaining_tokens ?? 0),
    }))
    .sort((a, b) => b.tokensUsed - a.tokensUsed)
    .slice(0, 10);

  //-------------------------------------------------------
  // Department Usage
  //-------------------------------------------------------

  const departmentUsage = departments.map((department) => {
    const users = profiles.filter(
      (user) => user.department_id === department.id,
    );

    const tokensUsed = users.reduce((total, user) => {
      return total + ((user.daily_quota ?? 0) - (user.remaining_tokens ?? 0));
    }, 0);

    return {
      department: department.name,
      tokensUsed,
    };
  });

  //-------------------------------------------------------
  // AI Service Usage
  //-------------------------------------------------------

  const serviceNames: Record<string, string> = {
    text: "Text AI",
    image: "Image Generation",
    document: "Document",
    presentation: "Presentation",
    data_analysis: "Data Analysis",
    design: "Design",
  };

  const serviceMap = new Map<string, number>();

  conversations.forEach((conversation) => {
    const service =
      serviceNames[conversation.service] ?? conversation.service ?? "Unknown";

    serviceMap.set(service, (serviceMap.get(service) ?? 0) + 1);
  });

  const serviceUsage = Array.from(serviceMap.entries())
    .map(([service, count]) => ({
      service,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  //-------------------------------------------------------
  // Most Active Users
  //-------------------------------------------------------

  const activeUsers = profiles
    .map((profile) => {
      const conversationCount = conversations.filter(
        (conversation) => conversation.user_id === profile.id,
      ).length;

      const tokensUsed =
        (profile.daily_quota ?? 0) - (profile.remaining_tokens ?? 0);

      return {
        id: profile.id,
        name: profile.full_name || profile.email || "Unknown User",
        department: profile.department || "N/A",
        conversations: conversationCount,
        tokensUsed,
      };
    })
    .sort((a, b) => b.conversations - a.conversations)
    .slice(0, 10);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Analytics Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor platform usage and AI activity.
        </p>
      </div>

      <AnalyticsCards
        totalUsers={totalUsers}
        totalAssignedTokens={totalAssignedTokens}
        totalUsedTokens={totalUsedTokens}
        averageUsage={averageUsage}
      />

      <TopTokenChart data={topTokenConsumers} />

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <DepartmentChart data={departmentUsage} />

        <TokenDistribution
          usedTokens={totalUsedTokens}
          remainingTokens={totalRemainingTokens}
        />

        <ServiceUsageChart data={serviceUsage} />

        <ActiveUsersTable users={activeUsers} />
      </div>
    </div>
  );
}
