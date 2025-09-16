
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Wand2, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { suggestFairPrice, SuggestFairPriceOutput } from "@/ai/ai-fair-price-engine";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { Crop } from "@/types";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-helper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const cropListingSchema = z.object({
  name: z.string().min(2, "Crop name is required"),
  variety: z.string().min(2, "Crop variety is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  freshness: z.enum(["fresh", "1-day-old", "2-days-old"]),
  isOrganic: z.boolean().default(false),
  description: z.string().optional(),
  imageUrl: z.string().url("A valid image URL must be provided or uploaded."),
});


export default function AddListingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState<SuggestFairPriceOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'farmer') {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'Only farmers can list new crops.',
      });
      router.push('/');
    }
  }, [user, router, toast]);

  const form = useForm<z.infer<typeof cropListingSchema>>({
    resolver: zodResolver(cropListingSchema),
    defaultValues: {
      name: "",
      variety: "",
      price: 0,
      city: "",
      state: "",
      freshness: "fresh",
      isOrganic: false,
      description: "",
      imageUrl: "",
    },
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // The data URI is only for preview.
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
      // On upload, we generate a placeholder URL and set it in the form.
      const placeholderUrl = getImageUrl(form.getValues('name') || 'default');
      form.setValue('imageUrl', placeholderUrl, { shouldValidate: true });
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    form.setValue('imageUrl', url);
    // Basic validation to check if it looks like an image URL for the preview
    if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };


  const handleSuggestPrice = async () => {
    const values = form.getValues();
    if (!values.name || !values.variety || !values.city) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in Crop Name, Variety, and City to get a price suggestion.",
      });
      return;
    }
    setLoading(true);
    setPriceSuggestion(null);
    try {
      const result = await suggestFairPrice({
        cropName: values.name,
        cropVariety: values.variety,
        location: values.city,
        quantity: 1, // Default to 1 for suggestion
        unit: 'kg', // Default to kg
        quality: `${values.isOrganic ? 'organic' : ''} ${values.freshness}`.trim()
      });
      setPriceSuggestion(result);
      form.setValue('price', result.fairPrice, { shouldValidate: true });
    } catch (error: any) {
      const errorMessage = error.message && error.message.includes('503') 
        ? "The AI model is currently overloaded. Please try again in a moment."
        : "Could not fetch price suggestion.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      console.error(error);
    }
    setLoading(false);
  };

  function onSubmit(values: z.infer<typeof cropListingSchema>) {
    const storedCrops = localStorage.getItem('allCrops');
    const allCrops: Crop[] = storedCrops ? JSON.parse(storedCrops) : [];
    
    const newCrop: Crop = {
        id: `crop-${Date.now()}-${Math.random()}`,
        name: values.name,
        variety: values.variety,
        price: values.price,
        city: values.city,
        state: values.state,
        freshness: values.freshness,
        isOrganic: values.isOrganic,
        rating: 4.5, // Default rating
        farmer: { name: user?.name || "A Farmer" },
        imageUrl: values.imageUrl,
        status: 'Available', // Set default status
    };
    
    const updatedCrops = [newCrop, ...allCrops];
    localStorage.setItem('allCrops', JSON.stringify(updatedCrops));

    window.dispatchEvent(new CustomEvent('local-storage-updated'));

    toast({
        title: "Crop Listed!",
        description: "Your crop has been successfully listed on the marketplace.",
    });
    router.push('/profile');
  }

  // Render nothing or a loading state while redirecting
  if (!user || user.role !== 'farmer') {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
          <Header />
           <main className="flex-1 p-4 md:p-8 flex justify-center items-center">
                <div className="text-center">
                    <p>Redirecting...</p>
                </div>
            </main>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                            <CardTitle>List a New Crop</CardTitle>
                            <FormDescription>
                                Fill in the details below to list your crop.
                            </FormDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Crop Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Tomato" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="variety"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Variety</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Heirloom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (per kg in Rs.)</FormLabel>
                           <div className="flex items-center gap-2">
                                <FormControl>
                                <Input type="number" placeholder="e.g., 50" {...field} />
                                </FormControl>
                                <Button type="button" variant="outline" onClick={handleSuggestPrice} disabled={loading}>
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    {loading ? 'Suggesting...' : 'Suggest'}
                                </Button>
                           </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Pune" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   {priceSuggestion && (
                    <Alert>
                        <Wand2 className="h-4 w-4" />
                        <AlertTitle className="flex items-center gap-2">
                            AI Fair Price Suggestion 
                            <Badge>Rs. {priceSuggestion.fairPrice}/kg</Badge>
                        </AlertTitle>
                        <AlertDescription>
                            {priceSuggestion.reasoning}
                        </AlertDescription>
                    </Alert>
                    )}
                  <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Maharashtra" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                   <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell buyers more about your crop..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Crop Photo</FormLabel>
                            <Tabs defaultValue="upload">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4"/>Upload</TabsTrigger>
                                <TabsTrigger value="url"><LinkIcon className="mr-2 h-4 w-4"/>Paste URL</TabsTrigger>
                              </TabsList>
                              <TabsContent value="upload">
                                <div className="flex items-center justify-center w-full">
                                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-card">
                                      {imagePreview ? (
                                          <Image src={imagePreview} alt="Crop Preview" width={100} height={100} className="object-contain h-28 w-auto" onError={() => setImagePreview(null)}/>
                                      ) : (
                                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                              <p className="text-xs text-muted-foreground">PNG, JPG or GIF</p>
                                          </div>
                                      )}
                                      <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                  </label>
                                </div>
                              </TabsContent>
                              <TabsContent value="url">
                                <div className="space-y-2">
                                  <Input placeholder="https://example.com/image.png" value={field.value} onChange={handleUrlChange} />
                                  {imagePreview && field.value && (
                                    <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg bg-muted">
                                      <Image src={imagePreview} alt="Crop Preview" width={100} height={100} className="object-contain h-28 w-auto" onError={() => setImagePreview(null)} />
                                    </div>
                                  )}
                                </div>
                              </TabsContent>
                            </Tabs>
                            <FormDescription>
                                A photo helps buyers see the quality of your crop.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <FormField
                      control={form.control}
                      name="freshness"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Freshness</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select freshness" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fresh">Fresh</SelectItem>
                              <SelectItem value="1-day-old">1-day-old</SelectItem>
                              <SelectItem value="2-days-old">2-days-old</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isOrganic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 h-10 mt-auto">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              This crop is organic
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">List Crop</Button>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}

    