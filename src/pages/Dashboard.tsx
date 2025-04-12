
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RestaurantTable } from "@/components/dashboard/RestaurantTable";
import { AlertsSection } from "@/components/dashboard/AlertsSection";
import { PerformanceSection } from "@/components/dashboard/PerformanceSection";
import { restaurantData, staffingIssues, operationalIssues } from "@/components/dashboard/DashboardData";

const Dashboard = () => {
  const [filterValue, setFilterValue] = useState("all");
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">
          Overview of HoussemHouse restaurant chain performance.
        </p>
      </div>
      
      <StatsCards />
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Issues</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <RestaurantTable 
            restaurants={restaurantData}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
          />
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <AlertsSection 
            staffingIssues={staffingIssues}
            operationalIssues={operationalIssues}
          />
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <PerformanceSection restaurants={restaurantData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
