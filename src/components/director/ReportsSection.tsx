
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { FilePlus, Send, Eye, Edit, FileText } from "lucide-react";
import { ReportItem } from "@/components/director/ReportItem";
import { Report } from "@/types/director";

interface ReportsSectionProps {
  restaurantId: string;
}

export const ReportsSection = ({ restaurantId }: ReportsSectionProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isViewReportOpen, setIsViewReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: '',
    content: ''
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, [restaurantId]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('date', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch reports. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewReport = () => {
    setReportForm({
      title: '',
      content: ''
    });
    setIsEditing(false);
    setIsReportDialogOpen(true);
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setIsViewReportOpen(true);
  };

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setReportForm({
      title: report.title,
      content: report.content
    });
    setIsEditing(true);
    setIsReportDialogOpen(true);
  };

  const handleSendToAdmin = async (report: Report) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          sent_to_admin: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', report.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report has been sent to the administrator."
      });

      // Refresh reports
      fetchReports();
    } catch (error) {
      console.error('Error sending report:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send report. Please try again."
      });
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportForm.title.trim() || !reportForm.content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and content are required."
      });
      return;
    }

    try {
      if (isEditing && selectedReport) {
        // Update existing report
        const { error } = await supabase
          .from('reports')
          .update({
            title: reportForm.title,
            content: reportForm.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedReport.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Report has been updated successfully."
        });
      } else {
        // Create new report
        const { error } = await supabase
          .from('reports')
          .insert({
            title: reportForm.title,
            content: reportForm.content,
            date: format(new Date(), 'yyyy-MM-dd'),
            restaurant_id: restaurantId,
            sent_to_admin: false,
            status: 'pending'
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "New report has been created successfully."
        });
      }

      // Close dialog and refresh reports
      setIsReportDialogOpen(false);
      fetchReports();
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save report. Please try again."
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Reports Management
          </CardTitle>
          <Button onClick={handleNewReport}>
            <FilePlus className="h-4 w-4 mr-2" />
            Create New Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No reports found. Create your first report.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <ReportItem 
                key={report.id}
                report={report}
                onView={handleViewReport}
                onEdit={handleEditReport}
                onSend={handleSendToAdmin}
              />
            ))}
          </div>
        )}

        {/* Create/Edit Report Dialog */}
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Report' : 'Create New Report'}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={reportForm.title}
                  onChange={handleInputChange}
                  placeholder="Enter report title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="content">Report Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={reportForm.content}
                  onChange={handleInputChange}
                  placeholder="Enter report details..."
                  className="min-h-[200px]"
                  required
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update' : 'Create'} Report
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Report Dialog */}
        <Dialog open={isViewReportOpen} onOpenChange={setIsViewReportOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedReport?.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                {selectedReport?.date ? new Date(selectedReport.date).toLocaleDateString() : ''}
              </div>
              
              <div className="whitespace-pre-wrap">
                {selectedReport?.content}
              </div>
              
              <div className="flex items-center mt-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedReport?.sent_to_admin 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedReport?.sent_to_admin ? 'Sent to Admin' : 'Draft'}
                </span>
                
                <span className="ml-4 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {selectedReport?.status || 'Pending'}
                </span>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setIsViewReportOpen(false)}>
                Close
              </Button>
              {selectedReport && !selectedReport.sent_to_admin && (
                <>
                  <Button variant="outline" onClick={() => {
                    setIsViewReportOpen(false);
                    handleEditReport(selectedReport);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button onClick={() => {
                    setIsViewReportOpen(false);
                    handleSendToAdmin(selectedReport);
                  }}>
                    <Send className="h-4 w-4 mr-2" />
                    Send to Admin
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
