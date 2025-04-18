
import { Button } from "@/components/ui/button";
import { Edit, Send } from "lucide-react";

interface Report {
  id: string;
  title: string;
  date: string;
  sent_to_admin: boolean;
}

interface ReportItemProps {
  report: Report;
  onView: (report: Report) => void;
  onEdit: (report: Report) => void;
  onSend: (report: Report) => void;
}

export const ReportItem = ({ report, onView, onEdit, onSend }: ReportItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-0">
      <div>
        <div className="font-medium">{report.title}</div>
        <div className="text-sm text-gray-500">{new Date(report.date).toLocaleDateString()}</div>
        <div className="text-xs flex items-center mt-1">
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            report.sent_to_admin ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {report.sent_to_admin ? 'Sent' : 'Draft'}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => onView(report)}>
          View
        </Button>
        {!report.sent_to_admin && (
          <>
            <Button variant="ghost" size="sm" onClick={() => onEdit(report)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-blue-500" onClick={() => onSend(report)}>
              <Send className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
