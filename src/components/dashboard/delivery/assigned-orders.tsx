
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, ArrowRight, CheckCircle } from "lucide-react";

type Order = {
    id: string;
    customer: string;
    address: string;
    phone: string;
    status: "pending_pickup" | "in_transit";
};

interface AssignedOrdersProps {
    orders: Order[];
    onUpdateStatus: (orderId: string) => void;
}

export function AssignedOrders({ orders, onUpdateStatus }: AssignedOrdersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Orders</CardTitle>
        <CardDescription>Manage and update the status of your assigned deliveries.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.length > 0 ? orders.map((order) => (
          <div key={order.id} className="p-4 rounded-lg border space-y-3">
             <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold">{order.id} - {order.customer}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{order.address}</span>
                    </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{order.phone}</span>
                    </div>
                </div>
                 <Badge variant={order.status === 'in_transit' ? 'default' : 'secondary'}>
                    {order.status.replace('_', ' ')}
                </Badge>
             </div>
             <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                    <a href={`tel:${order.phone}`}>
                        <Phone className="mr-2 h-4 w-4" /> Call Customer
                    </a>
                </Button>
                 <Button size="sm" className="w-full" onClick={() => onUpdateStatus(order.id)}>
                    {order.status === 'pending_pickup' ? 'Start Delivery' : 'Mark as Delivered'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
             </div>
          </div>
        )) : (
            <div className="text-center text-muted-foreground py-8 flex flex-col items-center justify-center">
                <CheckCircle className="h-10 w-10 mb-2 text-primary"/>
                <p className="font-semibold">All Deliveries Completed!</p>
                <p className="text-sm">No pending orders at the moment.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
