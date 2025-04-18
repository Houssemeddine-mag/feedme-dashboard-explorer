
import { CreditCard, Package, Users, UtensilsCrossed } from "lucide-react";
import { StatCard } from "./StatCard";
import { OrderSummary } from "./OrderSummary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IoTStatusCard } from "./IoTStatusCard";
import { Button } from "@/components/ui/button";
import { RefreshCcw, CheckCircle } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface DirectorOverviewProps {
  salesData: any[];
  categoryData: any[];
  orders: any[];
  employees: any[];
  dishes: any[];
  ovenTemperature: number;
  coolingTemperature: number;
  isUpdatingTemperature: boolean;
  onRefreshIoT: () => void;
}

export const DirectorOverview = ({
  salesData,
  categoryData,
  orders,
  employees,
  dishes,
  ovenTemperature,
  coolingTemperature,
  isUpdatingTemperature,
  onRefreshIoT
}: DirectorOverviewProps) => {
  const todayRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Today's Revenue" 
          value={`$${todayRevenue.toFixed(2)}`}
          icon={CreditCard}
          trend={{ value: 12.5, isPositive: true }}
          description="Based on today's orders"
        />
        <StatCard 
          title="Total Orders" 
          value={orders.length}
          icon={Package}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard 
          title="Total Employees" 
          value={employees.length}
          icon={Users}
        />
        <StatCard 
          title="Most Popular Dish" 
          value={dishes.length > 0 ? dishes[0].name : "No dishes"}
          icon={UtensilsCrossed}
          description="Based on today's orders"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
            <CardDescription>Revenue overview for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <OrderSummary orders={orders} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Dishes by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Dishes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>IoT Monitoring</CardTitle>
              <CardDescription>Real-time temperature tracking</CardDescription>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onRefreshIoT} 
              disabled={isUpdatingTemperature}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${isUpdatingTemperature ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <IoTStatusCard
                title="Kitchen Ovens"
                value={ovenTemperature}
                unit="°C"
                status={ovenTemperature > 200 || ovenTemperature < 160 ? 'warning' : 'normal'}
              />
              <IoTStatusCard
                title="Cooling Chamber"
                value={coolingTemperature}
                unit="°C"
                status={coolingTemperature > -2 || coolingTemperature < -8 ? 'warning' : 'normal'}
              />
              <div className="mt-2 text-xs text-gray-500">
                <p className="flex items-center mb-1">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  <span>Normal range for ovens: 160°C - 200°C</span>
                </p>
                <p className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  <span>Normal range for cooling: -8°C - -2°C</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
