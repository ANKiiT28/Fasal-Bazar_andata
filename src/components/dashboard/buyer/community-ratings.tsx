
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const communityRatings = [
    { name: "Anjali", avatar: "https://picsum.photos/seed/anjali/100", rating: 4.6, review: "Very fresh spinach, highly recommend!" },
    { name: "Suresh", avatar: "https://picsum.photos/seed/suresh/100", rating: 4.2, review: "Good quality onions, fast delivery." },
];


export function CommunityRatings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Community Ratings</CardTitle>
        <CardDescription>See what other buyers are saying.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {communityRatings.map((farmer) => (
          <div key={farmer.name} className="flex items-start gap-3">
             <Avatar className="h-9 w-9">
                <AvatarImage src={farmer.avatar} alt={farmer.name} />
                <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center justify-between">
                    <p className="font-semibold">{farmer.name}</p>
                    <div className="flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 text-accent fill-accent" />
                        <span>{farmer.rating}</span>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">&quot;{farmer.review}&quot;</p>
              </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
