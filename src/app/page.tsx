"use client";

import DashboardCard from "./components/dashboard/DashboardCard";

export default function Test() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="flex flex-wrap">
        {/* //A1  */}
        <DashboardCard title="Community Programs" value="65" />
        <DashboardCard title="Training Activities" value="100" />

        {/* //A2 */}
        <DashboardCard title="Beneficiaries" value="100" />

        {/* //A3 */}
        <DashboardCard title="Ratings" value="100%" />
        <DashboardCard title="Timeliness Rating" value="100%" />

        {/* //A4 */}
        <DashboardCard title="Adopters" value="5" />

        {/* //A5 */}
        <DashboardCard
          title="Impact Assessment or Extension Program"
          value="1"
        />
        <DashboardCard title="Ordinance/Resolution Proposed" value="3" />

        {/* //A6 */}
        <DashboardCard title="Awards/Recognition" value="142" />

        {/* //B */}
        <DashboardCard title="Linkages/Partnerships" value="142" />

        {/* //C */}
        <DashboardCard
          title="IEC/Techno Guide Materials Developed"
          value="65"
        />

        {/* //D */}
        <DashboardCard title="Budget Allocation for extension" value="80%" />

        {/* //E */}
        <DashboardCard title="Monitored and evaluated programs" value="5" />
      </div>
    </div>
  );
}
