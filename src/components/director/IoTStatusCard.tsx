
import { Thermometer } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IoTStatusCardProps {
  title: string;
  value: number;
  status: 'normal' | 'warning';
  unit: string;
  icon?: typeof Thermometer;
}

export const IoTStatusCard = ({ title, value, status, unit, icon: Icon = Thermometer }: IoTStatusCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${status === 'normal' ? 'text-green-500' : 'text-yellow-500'}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}{unit}</div>
        <p className="text-xs text-muted-foreground">
          Status: {status === 'normal' ? 
            <span className="text-green-500">Normal</span> : 
            <span className="text-yellow-500">Attention</span>}
        </p>
      </CardContent>
    </Card>
  );
};
