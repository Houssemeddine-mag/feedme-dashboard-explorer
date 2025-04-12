
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface StaffingIssue {
  restaurant: string;
  position: string;
  status: string;
  priority: string;
}

interface OperationalIssue {
  restaurant: string;
  issue: string;
  details: string;
  priority: string;
}

interface AlertsSectionProps {
  staffingIssues: StaffingIssue[];
  operationalIssues: OperationalIssue[];
}

export const AlertsSection = ({ staffingIssues, operationalIssues }: AlertsSectionProps) => {
  const { toast } = useToast();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Staffing Issues
          </CardTitle>
          <CardDescription>Current staffing problems that need attention</CardDescription>
        </CardHeader>
        <CardContent>
          {staffingIssues.length > 0 ? (
            <div className="space-y-4">
              {staffingIssues.map((issue, index) => (
                <div key={index} className="flex justify-between items-center pb-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{issue.restaurant}</p>
                    <p className="text-sm text-gray-500">{issue.position} - {issue.status}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      className={issue.priority === "High"
                        ? "bg-red-100 text-red-800 hover:bg-red-100" 
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"}
                    >
                      {issue.priority}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Addressing issue",
                          description: `Addressing ${issue.position} issue at ${issue.restaurant}`,
                        });
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No staffing issues</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
            Critical Issues
          </CardTitle>
          <CardDescription>Operational problems requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          {operationalIssues.length > 0 ? (
            <div className="space-y-4">
              {operationalIssues.map((issue, index) => (
                <div key={index} className="flex justify-between pb-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{issue.restaurant}</p>
                    <p className="text-sm font-medium text-gray-700">{issue.issue}</p>
                    <p className="text-xs text-gray-500">{issue.details}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      className={issue.priority === "High"
                        ? "bg-red-100 text-red-800 hover:bg-red-100" 
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"}
                    >
                      {issue.priority}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Addressing issue",
                          description: `Addressing ${issue.issue} at ${issue.restaurant}`,
                        });
                      }}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No critical issues</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
