
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  hire_date: string;
}

interface EmployeeItemProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeItem = ({ employee, onEdit, onDelete }: EmployeeItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-0">
      <div>
        <div className="font-medium">{employee.first_name} {employee.last_name}</div>
        <div className="text-sm text-gray-500">{employee.role}</div>
        <div className="text-xs text-gray-400">Hired: {new Date(employee.hire_date).toLocaleDateString()}</div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(employee)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onDelete(employee)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
