
"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { AssignedOrders } from "@/components/dashboard/delivery/assigned-orders";
import { DeliveryStats, type Stats } from "@/components/dashboard/delivery/delivery-stats";
import { MapView } from "@/components/dashboard/delivery/map-view";
import { useToast } from "@/hooks/use-toast";

const initialOrders = [
    { id: "#001", customer: "Amit Patel", address: "123, MG Road, Pune", phone: "9876543210", status: "pending_pickup", earnings: 110 },
    { id: "#002", customer: "Priya Sharma", address: "45, FC Road, Pune", phone: "8765432109", status: "in_transit", earnings: 90 },
    { id: "#003", customer: "Raj Verma", address: "78, Koregaon Park, Pune", phone: "7654321098", status: "pending_pickup", earnings: 150 },
];

const initialStats: Stats = {
    earnings: 750,
    deliveriesCompleted: 8,
    avgTime: 25,
};


export default function DeliveryDashboardPage() {
    const [orders, setOrders] = useState(initialOrders);
    const [stats, setStats] = useState<Stats>(initialStats);
    const { toast } = useToast();

    const handleUpdateStatus = (orderId: string) => {
        const orderToUpdate = orders.find(o => o.id === orderId);
        if (!orderToUpdate) return;

        if (orderToUpdate.status === 'pending_pickup') {
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: 'in_transit' } : order
                )
            );
            toast({ title: "Delivery Started", description: `Order ${orderId} is now in transit.` });
        } else if (orderToUpdate.status === 'in_transit') {
            // Update stats
            setStats(prevStats => ({
                ...prevStats,
                earnings: prevStats.earnings + (orderToUpdate.earnings || 125),
                deliveriesCompleted: prevStats.deliveriesCompleted + 1,
            }));
            
            // Remove order from list
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));

            toast({ title: "Delivery Completed!", description: `Order ${orderId} has been successfully delivered.` });
        }
    };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight">Delivery Dashboard</h1>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 grid gap-4 md:gap-8">
                 <MapView />
                 <AssignedOrders orders={orders} onUpdateStatus={handleUpdateStatus} />
            </div>
            <div className="grid gap-4 md:gap-8">
                <DeliveryStats stats={stats} />
            </div>
        </div>
      </main>
    </div>
  );
}
