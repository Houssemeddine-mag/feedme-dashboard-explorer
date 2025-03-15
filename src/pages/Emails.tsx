
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Trash2,
  Send,
  RefreshCw,
  MailOpen,
  ArrowLeft,
  Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type Email = {
  id: number;
  subject: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  restaurantId?: number;
  directorId?: number;
};

const mockEmails: Email[] = [
  {
    id: 1,
    subject: "Monthly Report - FeedMe Downtown",
    sender: "j.smith@feedme.com",
    recipient: "admin@feedme.com",
    content: "Here is the monthly report for FeedMe Downtown. We had a great month with increased sales and customer satisfaction. Please review the attached documents and let me know if you have any questions.\n\nBest regards,\nJohn Smith",
    timestamp: new Date(2024, 2, 10, 9, 30),
    isRead: true,
    restaurantId: 1,
    directorId: 1
  },
  {
    id: 2,
    subject: "Scheduling Issue - Riverside",
    sender: "e.jones@feedme.com",
    recipient: "admin@feedme.com",
    content: "We are experiencing some scheduling issues at FeedMe Riverside. Several staff members have requested time off next week, and we're struggling to maintain adequate coverage. Can we discuss possible solutions?\n\nEmma Jones",
    timestamp: new Date(2024, 2, 12, 14, 15),
    isRead: false,
    restaurantId: 2,
    directorId: 2
  },
  {
    id: 3,
    subject: "New Menu Items Proposal",
    sender: "admin@feedme.com",
    recipient: "r.wilson@feedme.com",
    content: "Robert,\n\nI've reviewed your proposal for new menu items at FeedMe Central Park. I think the seasonal dishes you've suggested would be a great addition. Let's schedule a tasting session next week.\n\nRegards,\nAdmin",
    timestamp: new Date(2024, 2, 13, 11, 45),
    isRead: true,
    restaurantId: 3,
    directorId: 3
  },
  {
    id: 4,
    subject: "Urgent: Equipment Malfunction",
    sender: "s.miller@feedme.com",
    recipient: "admin@feedme.com",
    content: "One of our main ovens at FeedMe Business District has malfunctioned. We need a repair technician as soon as possible. This is affecting our ability to fulfill orders efficiently.\n\nSarah Miller",
    timestamp: new Date(2024, 2, 14, 8, 20),
    isRead: false,
    restaurantId: 4,
    directorId: 4
  },
  {
    id: 5,
    subject: "Reopening Timeline - Harbor View",
    sender: "m.brown@feedme.com",
    recipient: "admin@feedme.com",
    content: "Just wanted to update you on the renovations at FeedMe Harbor View. We're on track to reopen next month. All major construction work has been completed, and we're now focusing on interior design and staff training.\n\nMichael Brown",
    timestamp: new Date(2024, 2, 15, 16, 0),
    isRead: false,
    restaurantId: 5,
    directorId: 5
  }
];

const Emails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emailToDelete, setEmailToDelete] = useState<Email | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [newEmail, setNewEmail] = useState({
    subject: "",
    recipient: "",
    content: ""
  });
  const [activeTab, setActiveTab] = useState("inbox");

  // Filter emails based on id param if provided
  useEffect(() => {
    if (id) {
      const restaurantId = parseInt(id, 10);
      // This logic would filter emails by restaurant or director ID
      // For now, we'll just select a random email
      const filteredEmail = emails.find(email => 
        email.restaurantId === restaurantId || email.directorId === restaurantId
      );
      if (filteredEmail) {
        setSelectedEmail(filteredEmail);
      }
    }
  }, [id, emails]);

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    // Mark as read
    if (!email.isRead) {
      setEmails(emails.map(e => 
        e.id === email.id ? { ...e, isRead: true } : e
      ));
    }
  };

  const handleDeleteEmail = () => {
    if (emailToDelete) {
      setEmails(emails.filter(e => e.id !== emailToDelete.id));
      if (selectedEmail?.id === emailToDelete.id) {
        setSelectedEmail(null);
      }
      setEmailToDelete(null);
      toast.success("Email deleted successfully");
    }
  };

  const handleSendEmail = () => {
    const newEmailObj: Email = {
      id: emails.length + 1,
      subject: newEmail.subject,
      sender: "admin@feedme.com",
      recipient: newEmail.recipient,
      content: newEmail.content,
      timestamp: new Date(),
      isRead: true
    };
    
    setEmails([newEmailObj, ...emails]);
    setIsComposing(false);
    setNewEmail({ subject: "", recipient: "", content: "" });
    toast.success("Email sent successfully");
  };

  const inboxEmails = emails.filter(email => email.recipient === "admin@feedme.com");
  const sentEmails = emails.filter(email => email.sender === "admin@feedme.com");
  
  const displayedEmails = activeTab === "inbox" ? inboxEmails : sentEmails;

  const emailColumns = [
    {
      header: "Status",
      accessorKey: "isRead",
      cell: (email: any) => (
        activeTab === "inbox" && (
          email.isRead ? 
            <MailOpen className="h-4 w-4 text-gray-400" /> : 
            <Mail className="h-4 w-4 text-feedme-500" />
        )
      ),
    },
    {
      header: "Subject",
      accessorKey: "subject",
      cell: (email: any) => (
        <div className={`font-medium ${!email.isRead && activeTab === "inbox" ? "font-semibold" : ""}`}>
          {email.subject}
        </div>
      ),
    },
    {
      header: activeTab === "inbox" ? "From" : "To",
      accessorKey: activeTab === "inbox" ? "sender" : "recipient",
    },
    {
      header: "Date",
      accessorKey: "timestamp",
      cell: (email: any) => new Date(email.timestamp).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (email: any) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            setEmailToDelete(email);
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emails</h1>
          <p className="mt-1 text-gray-500">
            Manage your communication with directors and restaurants
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            variant="default" 
            className="bg-feedme-500 hover:bg-feedme-600"
            onClick={() => setIsComposing(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Tabs 
            defaultValue="inbox" 
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inbox" className="flex items-center justify-center">
                <Mail className="h-4 w-4 mr-2" />
                Inbox
                {inboxEmails.filter(e => !e.isRead).length > 0 && (
                  <Badge className="ml-2 bg-feedme-500">
                    {inboxEmails.filter(e => !e.isRead).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center justify-center">
                <Send className="h-4 w-4 mr-2" />
                Sent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inbox" className="mt-4">
              <DataTable
                data={inboxEmails}
                columns={emailColumns}
                onRowClick={handleEmailClick}
              />
            </TabsContent>
            
            <TabsContent value="sent" className="mt-4">
              <DataTable
                data={sentEmails}
                columns={emailColumns}
                onRowClick={handleEmailClick}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-2 border rounded-md p-4">
          {selectedEmail ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
                  <div className="flex space-x-4 text-sm mt-1">
                    <p>
                      <span className="text-gray-500">From:</span> {selectedEmail.sender}
                    </p>
                    <p>
                      <span className="text-gray-500">To:</span> {selectedEmail.recipient}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(selectedEmail.timestamp).toLocaleString()}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setEmailToDelete(selectedEmail)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              
              <div className="border-t pt-4 mt-4 whitespace-pre-wrap">
                {selectedEmail.content}
              </div>
              
              <div className="border-t pt-4 flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsComposing(true);
                    setNewEmail({
                      subject: `Re: ${selectedEmail.subject}`,
                      recipient: selectedEmail.sender,
                      content: `\n\n\n> ${selectedEmail.content.split('\n').join('\n> ')}`
                    });
                  }}
                >
                  Reply
                </Button>
              </div>
            </div>
          ) : isComposing ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">New Message</h2>
              
              <div>
                <label className="text-sm font-medium">To:</label>
                <Input 
                  value={newEmail.recipient} 
                  onChange={(e) => setNewEmail({...newEmail, recipient: e.target.value})}
                  placeholder="recipient@example.com"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Subject:</label>
                <Input 
                  value={newEmail.subject} 
                  onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
                  placeholder="Subject"
                />
              </div>
              
              <div>
                <Textarea 
                  rows={12}
                  value={newEmail.content} 
                  onChange={(e) => setNewEmail({...newEmail, content: e.target.value})}
                  placeholder="Write your message here..."
                  className="resize-none"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsComposing(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-feedme-500 hover:bg-feedme-600"
                  onClick={handleSendEmail}
                  disabled={!newEmail.recipient || !newEmail.subject}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
              <Mail className="h-16 w-16 mb-4 text-gray-300" />
              <p>Select an email to view its contents</p>
              <p className="text-sm mt-2">Or click 'Compose' to create a new message</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!emailToDelete} 
        onOpenChange={(open) => !open && setEmailToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this email? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteEmail}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Emails;
