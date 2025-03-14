
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div className={cn("stats-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="stats-card-value">{value}</p>
        </div>
        {Icon && (
          <div className="p-2 bg-feedme-100 rounded-full">
            <Icon className="h-5 w-5 text-feedme-600" />
          </div>
        )}
      </div>
      
      {(description || trend) && (
        <div className="mt-2 flex items-center">
          {trend && (
            <span
              className={cn(
                "text-xs font-medium mr-2 rounded-full px-1.5 py-0.5",
                trend.isPositive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
