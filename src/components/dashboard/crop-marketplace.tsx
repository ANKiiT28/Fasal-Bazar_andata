
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import type { Crop } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Search, Filter, PlusCircle, BarChart, MoreHorizontal, Trash2, ShieldCheck, User } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/context/auth-context";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/hooks/use-toast";
import { updateUser } from "@/lib/user-store";


function CropCard({ crop, otherListingsCount, onUpdate, userRole }: { crop: Crop & { farmerIsTrusted?: boolean }, otherListingsCount: number, onUpdate: () => void, userRole?: string }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const lowestPrice = crop.price;
  const fromPriceText = t('from_price', { price: lowestPrice.toString() });

  const handleDelete = () => {
    const allCrops: Crop[] = JSON.parse(localStorage.getItem('allCrops') || '[]');
    const updatedCrops = allCrops.filter(c => c.id !== crop.id);
    localStorage.setItem('allCrops', JSON.stringify(updatedCrops));
    window.dispatchEvent(new CustomEvent('local-storage-updated'));
    toast({ title: "Listing Deleted", description: "The crop has been removed from the marketplace.", variant: "destructive" });
    onUpdate();
  };

  const handleToggleTrusted = () => {
    const allUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
    const farmerToUpdate = allUsers.find((u: any) => u.name === crop.farmer.name && u.role === 'farmer');

    if (farmerToUpdate) {
        const isTrusted = !farmerToUpdate.isTrusted;
        updateUser(farmerToUpdate.id, { isTrusted });
        toast({ title: isTrusted ? 'Farmer marked as trusted' : 'Farmer trust badge removed' });
        // Although this doesn't directly update the crop card UI for the badge,
        // it sets the stage for profile pages and future re-renders.
        onUpdate(); // Trigger a re-render of the marketplace
    } else {
        toast({ title: "Farmer not found", variant: "destructive" });
    }
  };


  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg flex flex-col h-full group">
       <div className="relative">
            <Link href={`/products/${encodeURIComponent(crop.name)}`} className="block">
                <Image
                src={crop.imageUrl}
                alt={crop.name}
                width={400}
                height={300}
                className="object-cover w-full h-48"
                />
                 <div className="absolute top-2 right-2 flex gap-2">
                    {crop.isOrganic && <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">{t('organic')}</Badge>}
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">{t(crop.freshness.replace('-', '_'))}</Badge>
                </div>
                {crop.farmerIsTrusted && (
                    <Badge variant="default" className="absolute top-2 left-2 bg-primary/80 backdrop-blur-sm text-primary-foreground">
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        Trusted
                    </Badge>
                )}
            </Link>

            {userRole === 'admin' && (
                <div className="absolute top-2 left-2 z-10">
                     <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={handleToggleTrusted}>
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    {crop.farmerIsTrusted ? 'Remove Trust Badge' : 'Mark as Trusted'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                 <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                         <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This will permanently delete the <strong>{crop.name}</strong> listing by <strong>{crop.farmer.name}</strong>. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
        </div>
        <CardContent className="p-4 space-y-2 flex-grow flex flex-col justify-between">
            <Link href={`/products/${encodeURIComponent(crop.name)}`} className="block">
                <div>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold">{t(crop.name)}</h3>
                        <p className="text-sm text-muted-foreground">{t(crop.variety)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{fromPriceText}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                    <span>{t(crop.city)}, {t(crop.state)}</span>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span>{crop.rating} ({t(crop.farmer.name)})</span>
                    </div>
                </div>
                </div>
            </Link>
             <Link href={`/products/${encodeURIComponent(crop.name)}`} className="block mt-auto">
                {otherListingsCount > 0 ? (
                    <Button variant="outline" className="w-full mt-4">
                        <BarChart className="mr-2 h-4 w-4" />
                        {t('compare_prices', { count: otherListingsCount.toString() })}
                    </Button>
                ) : (
                    <Button variant="outline" className="w-full mt-4" asChild>
                        <span className="w-full">{t('view_details')}</span>
                    </Button>
                )}
            </Link>
        </CardContent>
    </Card>
  );
}


export function CropMarketplace() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [priceSort, setPriceSort] = useState("default");
  const [isOrganic, setIsOrganic] = useState(false);
  const [freshness, setFreshness] = useState("all");
  const [allCrops, setAllCrops] = useState<Crop[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadDataFromStorage = () => {
    const storedCrops = localStorage.getItem('allCrops');
    if (storedCrops) {
        setAllCrops(JSON.parse(storedCrops));
    }
    const storedUsers = localStorage.getItem('app_users');
    if (storedUsers) {
        setAllUsers(JSON.parse(storedUsers));
    }
  };

  useEffect(() => {
    setMounted(true);
    loadDataFromStorage();

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'allCrops' || event.key === 'app_users') {
             loadDataFromStorage();
        }
    };
    
    // Listen for changes in localStorage from other tabs/windows
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleLocalUpdate = () => {
        loadDataFromStorage();
    };
    window.addEventListener('local-storage-updated', handleLocalUpdate);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('local-storage-updated', handleLocalUpdate);
    };
  }, []);

  const states = useMemo(() => ["all", ...Array.from(new Set(allCrops.map(c => c.state)))], [allCrops]);

  const cities = useMemo(() => {
    if (selectedState === "all") {
        return ["all", ...Array.from(new Set(allCrops.map(c => c.city)))];
    }
    return ["all", ...Array.from(new Set(allCrops.filter(c => c.state === selectedState).map(c => c.city)))];
  }, [selectedState, allCrops]);


  const filteredAndSortedCrops = useMemo(() => {
    const farmersTrustedStatus = new Map(allUsers
        .filter(u => u.role === 'farmer')
        .map(u => [u.name, u.isTrusted])
    );
      
    return allCrops
      .map(crop => ({
          ...crop,
          farmerIsTrusted: farmersTrustedStatus.get(crop.farmer.name) || false,
      }))
      .filter((crop) =>
        t(crop.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        t(crop.city).toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((crop) => selectedState === "all" || crop.state === selectedState)
      .filter((crop) => selectedCity === "all" || crop.city === selectedCity)
      .filter((crop) => !isOrganic || crop.isOrganic)
      .filter((crop) => freshness === "all" || crop.freshness === freshness)
      .sort((a, b) => {
        if (priceSort === "low-to-high") return a.price - b.price;
        if (priceSort === "high-to-low") return b.price - a.price;
        // Default sort: group by name, then sort by price
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return a.price - b.price;
      });
  }, [searchTerm, selectedState, selectedCity, priceSort, isOrganic, freshness, allCrops, allUsers, t]);

  const displayCrops = useMemo(() => {
    if (user?.role === 'admin') {
        return filteredAndSortedCrops; // Admins see all individual listings
    }
    const uniqueCropNames = new Set<string>();
    return filteredAndSortedCrops.filter(crop => {
        if (uniqueCropNames.has(crop.name)) {
            return false;
        }
        uniqueCropNames.add(crop.name);
        return true;
    });
  }, [filteredAndSortedCrops, user]);

  const getOtherListingsCount = (cropName: string) => {
      return allCrops.filter(c => c.name === cropName).length - 1;
  }
  
  const freshnessLevels = ["all", "fresh", "1-day-old", "2-days-old"];
  
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity("all");
  }


  if (!mounted) {
    return <div className="space-y-6">
      <div className="h-10 bg-muted rounded-md animate-pulse"></div>
      <div className="h-10 bg-muted rounded-md animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="h-80 bg-muted rounded-lg animate-pulse"></div>
        <div className="h-80 bg-muted rounded-lg animate-pulse"></div>
        <div className="h-80 bg-muted rounded-lg animate-pulse"></div>
        <div className="h-80 bg-muted rounded-lg animate-pulse"></div>
      </div>
    </div>;
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t('search_crops_cities')}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {user && user.role === 'farmer' && (
          <Button asChild>
              <Link href="/add-listing">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('list_your_crop')}
              </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
           <Select value={selectedState} onValueChange={handleStateChange}>
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground"/>
              <SelectValue placeholder={t('filter_by_state')} />
            </SelectTrigger>
            <SelectContent>
              {states.map(s => (
                <SelectItem key={s} value={s}>{s === 'all' ? t('all_states') : t(s)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground"/>
              <SelectValue placeholder={t('filter_by_city')} />
            </SelectTrigger>
            <SelectContent>
              {cities.map(loc => (
                <SelectItem key={loc} value={loc}>{loc === 'all' ? t('all_cities') : t(loc)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priceSort} onValueChange={setPriceSort}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('sort_by_price')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{t('default')}</SelectItem>
              <SelectItem value="low-to-high">{t('price_low_to_high')}</SelectItem>
              <SelectItem value="high-to-low">{t('price_high_to_low')}</SelectItem>
            </SelectContent>
          </Select>
           <Select value={freshness} onValueChange={setFreshness}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('filter_by_freshness')} />
            </SelectTrigger>
            <SelectContent>
               {freshnessLevels.map(level => (
                <SelectItem key={level} value={level}>{t(level.replace('-', '_'))}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Checkbox id="organic" checked={isOrganic} onCheckedChange={(checked) => setIsOrganic(checked as boolean)} />
            <Label htmlFor="organic">{t('organic_only')}</Label>
          </div>
      </div>
      
      {allCrops.length > 0 && displayCrops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayCrops.map((crop) => (
            <CropCard key={crop.id} crop={crop} otherListingsCount={getOtherListingsCount(crop.name)} onUpdate={loadDataFromStorage} userRole={user?.role} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground bg-card rounded-lg">
            <p className="text-lg font-semibold">{t('no_crops_found')}</p>
            <p className="text-sm">{t('adjust_filters')}</p>
            {user && user.role === 'farmer' && (
              <Button asChild className="mt-4">
                  <Link href="/add-listing">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t('list_your_crop')}
                  </Link>
              </Button>
            )}
        </div>
      )}
      </div>
  );
}

    
