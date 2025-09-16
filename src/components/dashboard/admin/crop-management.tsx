
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
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
import type { Crop } from "@/types";

export function CropManagement() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const { toast } = useToast();

  const loadCrops = () => {
    const storedCrops = localStorage.getItem("allCrops");
    if (storedCrops) {
      setCrops(JSON.parse(storedCrops));
    }
  };

  useEffect(() => {
    loadCrops();
    window.addEventListener('local-storage-updated', loadCrops);
    window.addEventListener('storage', (e) => {
        if (e.key === 'allCrops') loadCrops();
    });
    return () => {
        window.removeEventListener('local-storage-updated', loadCrops);
        window.removeEventListener('storage', loadCrops);
    };
  }, []);

  const handleUpdateStatus = (cropId: string, status: 'Approved' | 'Rejected') => {
    const updatedCrops = crops.map(crop => 
      crop.id === cropId ? { ...crop, status } : crop
    );
    setCrops(updatedCrops);
    localStorage.setItem('allCrops', JSON.stringify(updatedCrops));
    window.dispatchEvent(new CustomEvent('local-storage-updated'));
    toast({ title: `Listing ${status}` });
  };
  
  const handleDelete = (cropId: string) => {
    const updatedCrops = crops.filter(crop => crop.id !== cropId);
    setCrops(updatedCrops);
    localStorage.setItem('allCrops', JSON.stringify(updatedCrops));
    window.dispatchEvent(new CustomEvent('local-storage-updated'));
    toast({ title: "Listing Deleted", description: "The crop has been removed from the marketplace.", variant: "destructive" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crop Listings</CardTitle>
        <CardDescription>Approve, reject, and manage all crop listings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crop</TableHead>
              <TableHead>Farmer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crops.map(crop => (
              <TableRow key={crop.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image src={crop.imageUrl} alt={crop.name} width={36} height={36} className="rounded-md object-cover"/>
                    <div>
                        <div className="font-medium">{crop.name}</div>
                        <div className="text-xs text-muted-foreground">Rs. {crop.price}/kg in {crop.city}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{crop.farmer.name}</TableCell>
                <TableCell>
                  <Badge variant={
                    crop.status === "Approved" ? "default" :
                    crop.status === "Pending" ? "secondary" :
                    crop.status === "Sold Out" ? "outline" :
                    "destructive"
                  }>{crop.status || 'Available'}</Badge>
                </TableCell>
                 <TableCell>
                    <AlertDialog>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4"/>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                  <Link href={`/products/${encodeURIComponent(crop.name)}`}>View Listing</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(crop.id, 'Approved')}>Approve</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(crop.id, 'Rejected')}>Reject</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                          </DropdownMenuContent>
                      </DropdownMenu>
                       <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the
                              <span className="font-semibold"> {crop.name} </span> 
                              listing by {crop.farmer.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(crop.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
