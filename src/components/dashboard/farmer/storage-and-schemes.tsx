
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Package, Landmark } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getStorageTipsAndGovtSchemes, type StorageTipsAndGovtSchemesOutput } from "@/ai/flows/storage-tips-and-govt-schemes";
import { useToast } from "@/hooks/use-toast";

export function StorageAndSchemes() {
    const [recommendations, setRecommendations] = useState<StorageTipsAndGovtSchemesOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleGetRecommendations = async () => {
        setLoading(true);
        try {
            const result = await getStorageTipsAndGovtSchemes({ cropName: "Tomato", location: "Pune", farmingExperienceYears: 15 });
            setRecommendations(result);
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.message && error.message.includes('503') 
                ? "The AI model is currently overloaded. Please try again in a moment."
                : "Could not fetch recommendations.";
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
        }
        setLoading(false);
    };


  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            <CardTitle className="text-base font-medium">AI Recommendations</CardTitle>
        </div>
        <CardDescription>Storage tips & relevant government schemes.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading recommendations...</p>}
        {recommendations ? (
            <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="storage-tips">
                <AccordionTrigger>
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>Storage Tips</span>
                </div>
                </AccordionTrigger>
                <AccordionContent>
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                    {recommendations.storageTips.map((tip, index) => <li key={index}>{tip}</li>)}
                </ul>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="govt-schemes">
                <AccordionTrigger>
                 <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4" />
                    <span>Government Schemes</span>
                </div>
                </AccordionTrigger>
                <AccordionContent>
                 <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                    {recommendations.govtSchemes.map((scheme, index) => <li key={index}>{scheme}</li>)}
                </ul>
                </AccordionContent>
            </AccordionItem>
            </Accordion>
        ) : (
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Get AI-powered tips for storing your crops and discover relevant government schemes.</p>
                <Button onClick={handleGetRecommendations} disabled={loading} className="w-full">
                    {loading ? "Getting Recommendations..." : "Get Recommendations"}
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
