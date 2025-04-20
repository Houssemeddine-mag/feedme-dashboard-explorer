
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Users, Edit, Trash2 } from "lucide-react";

interface HRSectionProps {
  restaurantId: string;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'chef' | 'waiter' | 'cashier' | 'delivery';
  salary?: number;
  hire_date: string;
  restaurant_id: string;
}

interface EmployeeForm {
  first_name: string;
  last_name: string;
  phone: string;
  role: 'chef' | 'waiter' | 'cashier' | 'delivery';
  salary: number;
}

export const HRSection = ({ restaurantId }: HRSectionProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentRole, setCurrentRole] = useState<'chef' | 'waiter' | 'cashier' | 'delivery'>('chef');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EmployeeForm>({
    first_name: '',
    last_name: '',
    phone: '',
    role: 'chef',
    salary: 0
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, [restaurantId, currentRole]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('role', currentRole)
        .order('last_name', { ascending: true });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch employees. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'salary' ? parseFloat(value) || 0 : value
    });
  };

  const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      role: e.target.value as 'chef' | 'waiter' | 'cashier' | 'delivery'
    });
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      phone: '',
      role: currentRole,
      salary: 0
    });
    setEditingId(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleAddEmployee = () => {
    setFormData(prev => ({ ...prev, role: currentRole }));
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingId(employee.id);
    setFormData({
      first_name: employee.first_name,
      last_name: employee.last_name,
      phone: employee.phone || '',
      role: employee.role,
      salary: employee.salary || 0
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Employee has been deleted successfully."
      });

      // Refresh employee list
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete employee. Please try again."
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "First name and last name are required."
      });
      return;
    }

    try {
      if (editingId) {
        // Update existing employee
        const { error } = await supabase
          .from('employees')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            role: formData.role,
            salary: formData.salary
          })
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Employee has been updated successfully."
        });
      } else {
        // Add new employee
        const { error } = await supabase
          .from('employees')
          .insert({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            role: formData.role,
            salary: formData.salary,
            restaurant_id: restaurantId
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "New employee has been added successfully."
        });
      }

      // Close dialog and refresh data
      handleCloseDialog();
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save employee. Please try again."
      });
    }
  };

  const columns = [
    { header: "First Name", accessorKey: "first_name" },
    { header: "Last Name", accessorKey: "last_name" },
    { header: "Phone", accessorKey: "phone" },
    { 
      header: "Salary", 
      accessorKey: "salary",
      cell: (item: Employee) => item.salary ? `$${item.salary.toFixed(2)}` : 'N/A'
    },
    { 
      header: "Hire Date", 
      accessorKey: "hire_date",
      cell: (item: Employee) => new Date(item.hire_date).toLocaleDateString()
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item: Employee) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(item.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Human Resources Management
          </CardTitle>
          <Button onClick={handleAddEmployee}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={currentRole} onValueChange={(value) => setCurrentRole(value as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="chef">Chefs</TabsTrigger>
            <TabsTrigger value="waiter">Waiters</TabsTrigger>
            <TabsTrigger value="cashier">Cashiers</TabsTrigger>
            <TabsTrigger value="delivery">Delivery Agents</TabsTrigger>
          </TabsList>
          
          <TabsContent value={currentRole}>
            <DataTable
              data={employees}
              columns={columns}
              filterPlaceholder={`Search ${currentRole}s...`}
              onSearchChange={() => {}}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleRoleSelect}
                  className="w-full p-2 border rounded"
                >
                  <option value="chef">Chef</option>
                  <option value="waiter">Waiter</option>
                  <option value="cashier">Cashier</option>
                  <option value="delivery">Delivery Agent</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.salary}
                  onChange={handleInputChange}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update' : 'Add'} Employee
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
