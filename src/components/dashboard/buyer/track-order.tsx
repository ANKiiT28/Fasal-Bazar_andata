
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TrackOrder() {
  const delivery = {
    partnerName: "Adarsh Singh",
    partnerAvatar: "https://picsum.photos/seed/delivery/100",
    eta: "15 minutes",
    status: "In Transit"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Your Order</CardTitle>
        <CardDescription>Your order of Fresh Tomatoes is on its way!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted">
          <Image 
              src="https://picsum.photos/seed/map-track/800/400"
              alt="Live Map"
              layout="fill"
              objectFit="cover"
              data-ai-hint="city map"
          />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
            </div>
        </div>
        <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
                 <Avatar>
                    <AvatarImage src={delivery.partnerAvatar} alt={delivery.partnerName} />
                    <AvatarFallback>{delivery.partnerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm text-muted-foreground">Your Delivery Partner</p>
                    <p className="font-semibold">{delivery.partnerName}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-muted-foreground flex items-center justify-end gap-1"><Clock className="h-3 w-3"/> ETA</p>
                <p className="font-semibold">{delivery.eta}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
