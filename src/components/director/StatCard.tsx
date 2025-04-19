
import { LucideIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, description }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="p-2 bg-primary/10 rounded-md">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {trend && (
          <div className={`text-xs flex items-center ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
            <span>{trend.value}%</span>
            <TrendingUp className={`h-3 w-3 ml-1 ${!trend.isPositive && "rotate-180"}`} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </CardContent>
    </Card>
  );
};
