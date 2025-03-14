
import { DataTable } from "@/components/ui/data-table";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { 
  UserCircle2, 
  Building2, 
  BriefcaseBusiness, 
  Plus, 
  PenLine, 
  Trash2 
} from "lucide-react";

// Mock data
const directorsData = [
  { 
    id: 1, 
    name: "John Smith", 
    email: "j.smith@feedme.com",
    phone: "+1 (555) 123-4567",
    restaurant: "FeedMe Downtown",
    hireDate: "2020-03-15",
    performance: 92,
  },
  { 
    id: 2, 
    name: "Emma Jones", 
    email: "e.jones@feedme.com",
    phone: "+1 (555) 234-5678",
    restaurant: "FeedMe Riverside",
    hireDate: "2019-07-22",
    performance: 88,
  },
  { 
    id: 3, 
    name: "Robert Wilson", 
    email: "r.wilson@feedme.com",
    phone: "+1 (555) 345-6789",
    restaurant: "FeedMe Central Park",
    hireDate: "2021-01-10",
    performance: 75,
  },
  { 
    id: 4, 
    name: "Sarah Miller", 
    email: "s.miller@feedme.com",
    phone: "+1 (555) 456-7890",
    restaurant: "FeedMe Business District",
    hireDate: "2018-11-05",
    performance: 95,
  },
  { 
    id: 5, 
    name: "Michael Brown", 
    email: "m.brown@feedme.com",
    phone: "+1 (555) 567-8901",
    restaurant: "FeedMe Harbor View",
    hireDate: "2021-06-18",
    performance: 82,
  },
];

const GRH = () => {
  const filterOptions = [
    { label: "All Directors", value: "all" },
    { label: "Performance (High to Low)", value: "performance-desc" },
    { label: "Performance (Low to High)", value: "performance-asc" },
    { label: "Hire Date (Newest)", value: "date-desc" },
    { label: "Hire Date (Oldest)", value: "date-asc" },
  ];

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "Restaurant",
      accessorKey: "restaurant",
    },
    {
      header: "Hire Date",
      accessorKey: "hireDate",
      cell: (director: any) => {
        const date = new Date(director.hireDate);
        return date.toLocaleDateString();
      },
    },
    {
      header: "Performance",
      accessorKey: "performance",
      cell: (director: any) => {
        const performanceColor = 
          director.performance >= 90 ? "text-green-600" :
          director.performance >= 80 ? "text-feedme-500" :
          director.performance >= 70 ? "text-yellow-500" : "text-red-500";
        
        return (
          <span className={performanceColor}>
            {director.performance}%
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: () => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="h-8 px-2">
            <PenLine className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button size="sm" variant="outline" className="h-8 px-2 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">GRH</h1>
        <p className="mt-1 text-gray-500">
          Human Resources Management for Restaurant Directors
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Directors"
          value={directorsData.length}
          icon={UserCircle2}
        />
        <StatsCard
          title="Average Performance"
          value={`${Math.round(
            directorsData.reduce((sum, d) => sum + d.performance, 0) / directorsData.length
          )}%`}
          icon={BriefcaseBusiness}
        />
        <StatsCard
          title="Restaurants Covered"
          value={new Set(directorsData.map(d => d.restaurant)).size}
          icon={Building2}
        />
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Directors Management</h2>
        <DataTable
          data={directorsData}
          columns={columns}
          filterOptions={filterOptions}
          actionComponent={
            <Button variant="default" className="bg-feedme-500 hover:bg-feedme-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Director
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default GRH;
