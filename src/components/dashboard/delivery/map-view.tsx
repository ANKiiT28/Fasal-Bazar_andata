
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";

export function MapView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Map</CardTitle>
        <CardDescription>Real-time location of active deliveries.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 w-full rounded-lg overflow-hidden bg-muted">
            <Image 
                src="https://picsum.photos/seed/map/800/400"
                alt="Map View of Pune"
                layout="fill"
                objectFit="cover"
                data-ai-hint="city map"
            />
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center">
                <p className="text-lg font-semibold text-background bg-black/50 px-4 py-2 rounded-md">Live map coming soon</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
