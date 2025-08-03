"use client";
import { Users, Activity, DollarSign, Eye } from "lucide-react";
import { DashboardCard } from "./ui/dashboard-card";
import { RevenueChart } from "./ui/revenue-chart";
import { UsersTable } from "./ui/users-table";
import { QuickActions } from "./ui/quick-actions";
import { SystemStatus } from "./ui/system-status";
import { RecentActivity } from "./ui/recent-activity";

// Dashboard stats data
const stats = [
  {
    title: "Total Users",
    value: "12,345",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Revenue",
    value: "$45,678",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Active Sessions",
    value: "2,456",
    change: "+15%",
    changeType: "positive" as const,
    icon: Activity,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Page Views",
    value: "34,567",
    change: "-2.4%",
    changeType: "negative" as const,
    icon: Eye,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

export default function AdminDashboard() {
  return (
    <>
      <div className="px-2 sm:px-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome Admin
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Here&apos;s what&apos;s happening with your platform today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <DashboardCard key={stat.title} stat={stat} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
        {/* Charts Section */}
        <div className="space-y-4 sm:space-y-6 xl:col-span-2">
          <RevenueChart />
          <UsersTable onAddUser={() => {}} />
        </div>

        {/* Sidebar Section */}
        <div className="space-y-4 sm:space-y-6">
          <QuickActions onAddUser={() => {}} onExport={() => {}} />
          <SystemStatus />
          <RecentActivity />
        </div>
      </div>
    </>
  );
}
