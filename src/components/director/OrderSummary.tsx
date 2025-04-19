
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Clock } from "lucide-react";

interface Order {
  id: string;
  table_number?: number;
  total_amount: number;
  status: string;
  created_at: string;
}

interface OrderSummaryProps {
  orders: Order[];
}

export const OrderSummary = ({ orders }: OrderSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          Last 5 orders from the restaurant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length > 0 ? orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between pb-4 border-b last:border-0">
              <div>
                <div className="font-medium">Order #{order.id.substring(0, 8)}</div>
                <div className="text-sm text-gray-500">Table {order.table_number || 'Takeaway'}</div>
                <div className="text-xs text-gray-400 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">${order.total_amount.toFixed(2)}</div>
                <div className="text-sm text-gray-500">{order.status}</div>
              </div>
            </div>
          )) : (
            <div className="text-center py-4 text-gray-500">No recent orders</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
