
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreHorizontal, Mail } from "lucide-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useNavigate } from "react-router-dom";
import { EditDialog } from "@/components/ui/edit-dialog";
import { toast } from "sonner";

interface DataTableProps {
  data: any[];
  columns: any[];
  filterOptions?: { label: string; value: string }[];
  onRowClick?: (row: any) => void;
  onEdit?: (row: any) => React.ReactNode;
  onDelete?: (id: any) => void;
  actionComponent?: React.ReactNode; // Add this line to fix the TypeScript error
}

export const DataTable = ({ 
  data, 
  columns, 
  filterOptions, 
  onRowClick,
  onEdit,
  onDelete,
  actionComponent // Include in the destructured props
}: DataTableProps) => {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState(data);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter(item => item.status === filter));
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      handleFilterChange(activeFilter);
      return;
    }
    
    const filtered = data.filter(item => {
      return columns.some(column => {
        if (column.accessorKey === 'actions') return false;
        const value = item[column.accessorKey];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        return false;
      });
    });
    
    setFilteredData(filtered);
  };

  const handleEdit = (row: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRow(row);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (row: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRow(row);
    setIsDeleteDialogOpen(true);
  };

  const handleSendEmail = (row: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (row.id) {
      navigate(`/emails/${row.id}`);
    }
  };

  const confirmDelete = () => {
    if (selectedRow && onDelete) {
      onDelete(selectedRow.id);
      toast.success("Item deleted successfully");
    }
    setIsDeleteDialogOpen(false);
    setSelectedRow(null);
  };

  const handleSaveEdit = (data: any) => {
    // This would typically save to an API
    toast.success("Changes saved successfully");
    setIsEditDialogOpen(false);
    setSelectedRow(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
        
        <div className="flex items-center space-x-2">
          {filterOptions && (
            <div className="flex space-x-2">
              {filterOptions.map((option, index) => (
                <Button
                  key={index}
                  variant={activeFilter === option.value ? "default" : "outline"}
                  onClick={() => handleFilterChange(option.value)}
                  className={activeFilter === option.value ? "bg-feedme-500 hover:bg-feedme-600" : ""}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}
          
          {/* Render the actionComponent if provided */}
          {actionComponent && (
            <div className="ml-auto">
              {actionComponent}
            </div>
          )}
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>
                  {column.header}
                </TableHead>
              ))}
              {(onEdit || onDelete) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <TableRow 
                  key={rowIndex} 
                  className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.cell ? column.cell(row) : row[column.accessorKey]}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEdit && (
                            <DropdownMenuItem onClick={(e: any) => handleEdit(row, e)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {row.email && (
                            <DropdownMenuItem onClick={(e: any) => handleSendEmail(row, e)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Email
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive" 
                              onClick={(e: any) => handleDelete(row, e)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-6">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete confirmation dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={confirmDelete}
        title="Are you sure?"
        description="This action cannot be undone. This will permanently delete this item from our servers."
      />
      
      {/* Edit dialog */}
      {isEditDialogOpen && selectedRow && onEdit && (
        <EditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSaveEdit}
          title="Edit Item"
          description="Make changes to this item here."
        >
          {onEdit(selectedRow)}
        </EditDialog>
      )}
    </div>
  );
};
