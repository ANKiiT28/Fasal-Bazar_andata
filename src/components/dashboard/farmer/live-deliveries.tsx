
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LiveDeliveries() {
  const delivery = {
    orderId: "#FSL-00451",
    crop: "Tomatoes",
    buyer: "Harsh Singh",
    partnerName: "Adarsh Singh",
    partnerAvatar: "https://picsum.photos/seed/delivery/100",
    status: "In Transit"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Deliveries</CardTitle>
        <CardDescription>Track orders that are currently out for delivery.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center">
                <p className="text-lg font-semibold text-background bg-black/50 px-4 py-2 rounded-md">Live map coming soon</p>
            </div>
        </div>
        <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
            <div>
                 <p className="font-semibold">{delivery.orderId} to {delivery.buyer}</p>
                 <p className="text-sm text-muted-foreground">{delivery.crop}</p>
            </div>
            <Badge>{delivery.status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
