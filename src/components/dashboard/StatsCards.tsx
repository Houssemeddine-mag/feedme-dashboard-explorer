
import { StatsCard } from "@/components/ui/stats-card";
import { Clock, DollarSign, Utensils } from "lucide-react";

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard
        title="Total Dishes Sold Today"
        value="1,248"
        icon={Utensils}
        trend={{ value: 12, isPositive: true }}
        description="Compared to yesterday"
      />
      <StatsCard
        title="Dishes Sold Per Hour"
        value="32"
        icon={Clock}
        trend={{ value: 4, isPositive: true }}
        description="Current hourly rate"
      />
      <StatsCard
        title="Daily Revenue"
        value="$16,220"
        icon={DollarSign}
        trend={{ value: 8, isPositive: true }}
        description="Across all restaurants"
      />
    </div>
  );
};
