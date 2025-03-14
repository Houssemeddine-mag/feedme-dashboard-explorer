
import { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DirectorForm from "@/components/forms/DirectorForm";

// Mock data
const directorsData = [
  { 
    id: 1, 
    name: "John Smith", 
    email: "j.smith@feedme.com",
    phone: "+1 (555) 123-4567",
    restaurant: "FeedMe Downtown",
    hireDate: "2020-03-15",
  },
  { 
    id: 2, 
    name: "Emma Jones", 
    email: "e.jones@feedme.com",
    phone: "+1 (555) 234-5678",
    restaurant: "FeedMe Riverside",
    hireDate: "2019-07-22",
  },
  { 
    id: 3, 
    name: "Robert Wilson", 
    email: "r.wilson@feedme.com",
    phone: "+1 (555) 345-6789",
    restaurant: "FeedMe Central Park",
    hireDate: "2021-01-10",
  },
  { 
    id: 4, 
    name: "Sarah Miller", 
    email: "s.miller@feedme.com",
    phone: "+1 (555) 456-7890",
    restaurant: "FeedMe Business District",
    hireDate: "2018-11-05",
  },
  { 
    id: 5, 
    name: "Michael Brown", 
    email: "m.brown@feedme.com",
    phone: "+1 (555) 567-8901",
    restaurant: "FeedMe Harbor View",
    hireDate: "2021-06-18",
  },
];

// Mock restaurants data for the director form
const restaurantsMock = [
  { id: 1, name: "FeedMe Downtown" },
  { id: 2, name: "FeedMe Riverside" },
  { id: 3, name: "FeedMe Central Park" },
  { id: 4, name: "FeedMe Business District" },
  { id: 5, name: "FeedMe Harbor View" },
];

const GRH = () => {
  const [directors, setDirectors] = useState(directorsData);
  const [isAddDirectorOpen, setIsAddDirectorOpen] = useState(false);
  
  const filterOptions = [
    { label: "All Directors", value: "all" },
    { label: "Hire Date (Newest)", value: "date-desc" },
    { label: "Hire Date (Oldest)", value: "date-asc" },
  ];

  const handleAddDirector = (data: any) => {
    // Create a new director with the form data
    const restaurant = restaurantsMock.find(r => r.id.toString() === data.restaurant);
    const newDirector = {
      id: directors.length + 1,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phoneNumber,
      restaurant: restaurant?.name || "Not assigned",
      hireDate: new Date().toISOString().split('T')[0],
    };
    
    setDirectors([...directors, newDirector]);
    setIsAddDirectorOpen(false);
  };

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
          value={directors.length}
          icon={UserCircle2}
        />
        <StatsCard
          title="Average Years of Service"
          value={`${Math.round(
            directors.reduce((sum, d) => {
              const hireDate = new Date(d.hireDate);
              const today = new Date();
              const years = today.getFullYear() - hireDate.getFullYear();
              return sum + years;
            }, 0) / directors.length
          )} years`}
          icon={BriefcaseBusiness}
        />
        <StatsCard
          title="Restaurants Covered"
          value={new Set(directors.map(d => d.restaurant)).size}
          icon={Building2}
        />
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Directors Management</h2>
        <DataTable
          data={directors}
          columns={columns}
          filterOptions={filterOptions}
          actionComponent={
            <Button 
              variant="default" 
              className="bg-feedme-500 hover:bg-feedme-600"
              onClick={() => setIsAddDirectorOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Director
            </Button>
          }
        />
      </div>

      {/* Add Director Dialog */}
      <Dialog open={isAddDirectorOpen} onOpenChange={setIsAddDirectorOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Director</DialogTitle>
          </DialogHeader>
          <DirectorForm 
            onSubmit={handleAddDirector}
            onCancel={() => setIsAddDirectorOpen(false)}
            restaurants={restaurantsMock}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GRH;
