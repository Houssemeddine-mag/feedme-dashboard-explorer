
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Restaurant {
  id: number;
  name: string;
  status: string;
  sales: number;
  director: string;
  email: string;
  staffCount: number;
  alertLevel: "none" | "low" | "medium" | "high";
}

interface PerformanceSectionProps {
  restaurants: Restaurant[];
}

export const PerformanceSection = ({ restaurants }: PerformanceSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Restaurant Performance</CardTitle>
        <CardDescription>Comparative analysis across locations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {restaurants
            .filter(restaurant => restaurant.status === "open")
            .sort((a, b) => b.sales - a.sales)
            .map((restaurant, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{restaurant.name}</span>
                  <span className="font-medium">${restaurant.sales.toLocaleString()}</span>
                </div>
                <Progress 
                  value={(restaurant.sales / 6120) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
