
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Repeat } from "lucide-react";

const favoriteFarmers = [
    { name: "Ramesh K.", avatar: "https://picsum.photos/seed/ramesh/100", rating: 4.8 },
    { name: "Priya S.", avatar: "https://picsum.photos/seed/priya/100", rating: 4.9 },
    { name: "Ganesh P.", avatar: "https://picsum.photos/seed/ganesh/100", rating: 4.7 },
];


export function FavoriteFarmers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Favorite Farmers</CardTitle>
         <CardDescription>Quickly reorder from your preferred farmers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {favoriteFarmers.map((farmer) => (
          <div key={farmer.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={farmer.avatar} alt={farmer.name} />
                <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{farmer.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 text-accent fill-accent" />
                    <span>{farmer.rating}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
                <Repeat className="mr-2 h-3 w-3" />
                Reorder
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
