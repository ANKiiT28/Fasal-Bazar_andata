
"use client";

import { useState, useEffect, useRef } from "react";
import type { Crop } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Edit, Trash2, Upload, Link as LinkIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getImageUrl } from "@/lib/image-helper";

export function MyListings({ farmerName }: { farmerName: string }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [myCrops, setMyCrops] = useState<Crop[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const refreshListings = () => {
    const allCrops: Crop[] = JSON.parse(localStorage.getItem('allCrops') || '[]');
    setMyCrops(allCrops.filter(crop => crop.farmer.name === farmerName));
  };
  
  useEffect(() => {
    setIsMounted(true);
    refreshListings();
    
    window.addEventListener('local-storage-updated', refreshListings);
    return () => {
        window.removeEventListener('local-storage-updated', refreshListings);
    };
  }, [farmerName]);

  const handleEditClick = (crop: Crop) => {
    setEditingCrop({ ...crop });
    setImagePreview(crop.imageUrl);
  };

  const handleSaveChanges = () => {
    if (!editingCrop) return;
    
    const allCrops: Crop[] = JSON.parse(localStorage.getItem('allCrops') || '[]');
    
    const updatedCrops = allCrops.map(c => c.id === editingCrop.id ? editingCrop : c);
    
    try {
        localStorage.setItem('allCrops', JSON.stringify(updatedCrops));
        window.dispatchEvent(new CustomEvent('local-storage-updated'));
    } catch(e) {
        toast({
            variant: "destructive",
            title: "Failed to save changes",
            description: "There was an error saving your listing. The browser storage might be full."
        })
        console.error(e);
        return;
    }
    
    refreshListings();
    setEditingCrop(null);
    setImagePreview(null);
    toast({ title: "Listing Updated", description: `${editingCrop.name} has been successfully updated.` });
  };
  
  const handleDelete = (cropId: string) => {
    const allCrops: Crop[] = JSON.parse(localStorage.getItem('allCrops') || '[]');
    const updatedCrops = allCrops.filter(c => c.id !== cropId);
    localStorage.setItem('allCrops', JSON.stringify(updatedCrops));
    window.dispatchEvent(new CustomEvent('local-storage-updated'));

    refreshListings();
    toast({ title: "Listing Deleted", description: `The crop has been removed from the marketplace.`, variant: "destructive" });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editingCrop) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Generate a placeholder URL for file uploads to avoid storing data URIs
      const placeholderUrl = getImageUrl(editingCrop.name || 'default');
      setEditingCrop({ ...editingCrop, imageUrl: placeholderUrl });
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const url = event.target.value;
      if (editingCrop) {
          setEditingCrop({ ...editingCrop, imageUrl: url });
          if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
              setImagePreview(url);
          } else {
              setImagePreview(null);
          }
      }
  };

  if (!isMounted) {
    return (
        <Card>
            <CardHeader><CardTitle>My Listings</CardTitle></CardHeader>
            <CardContent><p>Loading listings...</p></CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Listings</CardTitle>
        <CardDescription>View, edit, or delete your active crop listings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {myCrops.length > 0 ? (
          myCrops.map(crop => (
            <div key={crop.id} className="border p-4 rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Image src={crop.imageUrl} alt={crop.name} width={60} height={60} className="rounded-md object-cover" />
                <div>
                  <h4 className="font-semibold">{crop.name} <span className="text-sm font-normal text-muted-foreground">({crop.variety})</span></h4>
                  <p className="text-sm text-muted-foreground">Rs. {crop.price}/kg</p>
                  <Badge variant={crop.status === 'Sold Out' ? 'destructive' : 'default'} className="mt-1">{crop.status || 'Available'}</Badge>
                </div>
              </div>
              
              <Dialog onOpenChange={(isOpen) => !isOpen && setEditingCrop(null)}>
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={() => handleEditClick(crop)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <AlertDialogTrigger asChild>
                         <DropdownMenuItem className="text-destructive">
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                         </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Listing: {editingCrop?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Crop Name</Label>
                                <Input id="edit-name" value={editingCrop?.name || ''} onChange={(e) => setEditingCrop(curr => curr && {...curr, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-variety">Variety</Label>
                                <Input id="edit-variety" value={editingCrop?.variety || ''} onChange={(e) => setEditingCrop(curr => curr && {...curr, variety: e.target.value})} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="edit-price">Price (per kg)</Label>
                            <Input id="edit-price" type="number" value={editingCrop?.price || 0} onChange={(e) => setEditingCrop(curr => curr && {...curr, price: Number(e.target.value)})} />
                        </div>
                         <div className="space-y-2">
                            <Label>Crop Photo</Label>
                            <Tabs defaultValue="upload">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4"/>Upload</TabsTrigger>
                                    <TabsTrigger value="url"><LinkIcon className="mr-2 h-4 w-4"/>Paste URL</TabsTrigger>
                                </TabsList>
                                <TabsContent value="upload">
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file-edit" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-card">
                                            {imagePreview ? (
                                                <Image src={imagePreview} alt="Crop Preview" width={100} height={100} className="object-contain h-28 w-auto" onError={() => setImagePreview(null)} />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                                </div>
                                            )}
                                            <input id="dropzone-file-edit" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                </TabsContent>
                                <TabsContent value="url">
                                    <div className="space-y-2">
                                        <Input placeholder="https://example.com/image.png" value={editingCrop?.imageUrl || ''} onChange={handleUrlChange} />
                                        {imagePreview && (
                                            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg bg-muted">
                                                <Image src={imagePreview} alt="Crop Preview" width={100} height={100} className="object-contain h-28 w-auto" onError={() => setImagePreview(null)} />
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-freshness">Freshness</Label>
                                <Select value={editingCrop?.freshness || 'fresh'} onValueChange={(value) => setEditingCrop(e => e && {...e, freshness: value as any})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fresh">Fresh</SelectItem>
                                        <SelectItem value="1-day-old">1-day-old</SelectItem>
                                        <SelectItem value="2-days-old">2-days-old</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select value={editingCrop?.status || 'Available'} onValueChange={(value) => setEditingCrop(e => e && {...e, status: value})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Available">Available</SelectItem>
                                        <SelectItem value="Sold Out">Sold Out</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="edit-organic" checked={editingCrop?.isOrganic || false} onCheckedChange={(checked) => setEditingCrop(e => e && {...e, isOrganic: !!checked})} />
                            <Label htmlFor="edit-organic">This crop is organic</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <DialogClose asChild><Button onClick={handleSaveChanges}>Save Changes</Button></DialogClose>
                    </DialogFooter>
                  </DialogContent>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        <span className="font-semibold"> {crop.name} ({crop.variety}) </span> 
                        listing from the marketplace.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(crop.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Dialog>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-4">
            <p>You haven't listed any crops yet.</p>
            <Button variant="link" asChild><a href="/add-listing">List your first crop!</a></Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    