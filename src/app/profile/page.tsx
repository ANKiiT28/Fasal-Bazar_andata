

"use client";

import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldCheck, MapPin, Phone, Banknote, Landmark, Trophy, Bell, Settings, User as UserIcon, Building, Truck, Briefcase, BarChart2, Users, Leaf, ShieldAlert, MessageSquare, Edit, Car, User, Mail, Camera } from "lucide-react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GeneralChatDialog } from "@/components/chat/general-chat-dialog";
import { MyListings } from "@/components/dashboard/farmer/my-listings";
import { updateUser } from "@/lib/user-store";


const FarmerProfile = ({ user, isPublicView, onUpdate }: { user: any, isPublicView: boolean, onUpdate: (data: any) => void }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: loggedInUser, openLoginDialog } = useAuth();
  const [formData, setFormData] = useState(user);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    setFormData(user);
  }, [user]);
  
  const handleAvatarClick = () => {
    if (!isPublicView) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result as string;
        onUpdate({ ...formData, avatar: newAvatar });
        toast({
          title: "Profile Photo Updated",
          description: "Your new photo has been saved.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate(formData);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  const handlePayoutSave = () => {
    onUpdate(formData);
     toast({
      title: "Payout Details Updated",
      description: "Your payout information has been saved.",
    });
  }

   const handleProtectedAction = (callback: () => void) => {
    if (loggedInUser) {
        callback();
    } else {
        openLoginDialog();
    }
  };

  return (
  <>
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <div className="relative group">
        <Avatar className="h-24 w-24 border-4 border-primary">
          <AvatarImage src={user.avatar} alt={t(user.name)} />
          <AvatarFallback>{t(user.name).charAt(0)}</AvatarFallback>
        </Avatar>
        {!isPublicView && (
          <>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <div onClick={handleAvatarClick} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="text-white" />
            </div>
          </>
        )}
      </div>
      <div className="text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <h1 className="text-3xl font-bold">{t(user.name)}</h1>
          {user.isTrusted && <ShieldCheck className="h-7 w-7 text-primary" />}
        </div>
        <p className="text-muted-foreground">{t('joined_2_years_ago')}</p>
        <div className="mt-2 flex items-center justify-center gap-2 md:justify-start">
          <Badge>{t('farmer')}</Badge>
          {user.isTrusted && <Badge variant="secondary" className="border-primary text-primary">Trusted by Fasal Bazar</Badge>}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-accent fill-accent" />
            <span>{user.rating} ({t('120_reviews')})</span>
          </div>
        </div>
      </div>
      <div className="md:ml-auto flex gap-2">
        {isPublicView ? (
             <div className="flex gap-2">
                <Button asChild variant="outline">
                    <a href={`tel:${user.phone}`}><Phone className="mr-2 h-4 w-4" />{t('call')}</a>
                </Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button onClick={(e) => handleProtectedAction(() => {})}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {t('chat')}
                        </Button>
                    </DialogTrigger>
                    {loggedInUser && (
                        <GeneralChatDialog 
                            userName={user.name} 
                            userRole="farmer"
                        />
                    )}
                </Dialog>
             </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button><Edit className="mr-2"/>{t('edit_profile')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('edit_profile')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="name">{t('name')}</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="bio">{t('about_me')}</Label>
                      <Textarea id="bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="farmName">{t('farm_name')}</Label>
                      <Input id="farmName" value={formData.farmName} onChange={(e) => setFormData({...formData, farmName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="location">{t('location')}</Label>
                      <Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="specialty">{t('specializes_in')}</Label>
                      <Input id="specialty" value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="phone">{t('contact_number')}</Label>
                      <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                      <Button variant="outline">{t('cancel')}</Button>
                  </DialogClose>
                  <DialogClose asChild>
                      <Button onClick={handleSave}>{t('save_changes')}</Button>
                  </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>

    <Separator />

    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('about_me')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t(user.bio)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('farm_info')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">{t('farm_name')}</h4>
                <p className="text-muted-foreground">{t(user.farmName)}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t('location')}</h4>
                <p className="text-muted-foreground">{t(user.location)}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t('specializes_in')}</h4>
                <p className="text-muted-foreground">{t(user.specialty)}</p>
              </div>
          </CardContent>
        </Card>
        
        {!isPublicView && <MyListings farmerName={user.name} />}

        {!isPublicView && <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Trophy className="text-accent"/> {t('rewards_and_credits')}</CardTitle>
              <CardDescription>{t('rewards_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                  <div>
                      <p className="text-sm text-muted-foreground">{t('available_credits')}</p>
                      <p className="text-2xl font-bold">500</p>
                  </div>
                  <Button size="sm">{t('redeem_now')}</Button>
              </div>
              <div>
                  <h4 className="font-semibold mb-2">{t('recent_activity')}</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex justify-between"><span>{t('activity_1')}</span><span>{t('july_15')}</span></li>
                      <li className="flex justify-between"><span>{t('activity_2')}</span><span>{t('july_14')}</span></li>
                      <li className="flex justify-between"><span>{t('activity_3')}</span><span>{t('july_12')}</span></li>
                  </ul>
              </div>
          </CardContent>
        </Card>}
      </div>

      <div className="space-y-4">
        {!isPublicView && <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings /> {t('settings')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="sms-alerts">{t('sms_alerts')}</Label>
                  </div>
                  <Switch id="sms-alerts" />
              </div>
          </CardContent>
        </Card>}
        <Card>
          <CardHeader>
            <CardTitle>{t('contact')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{t(user.location)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span>{user.phone}</span>
            </div>
          </CardContent>
        </Card>
        {!isPublicView && <Card>
          <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('payout_details')}</CardTitle>
                <CardDescription>{t('payout_desc')}</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>{t('edit_payout_details')}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="upi">{t('upi_id')}</Label>
                            <Input id="upi" value={formData.upiId} onChange={(e) => setFormData({...formData, upiId: e.target.value})} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="bank">{t('bank_account')}</Label>
                            <Input id="bank" value={formData.bankAccount} onChange={(e) => setFormData({...formData, bankAccount: e.target.value})} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">{t('cancel')}</Button></DialogClose>
                        <DialogClose asChild><Button onClick={handlePayoutSave}>{t('save_changes')}</Button></DialogClose>
                    </DialogFooter>
                </DialogContent>
              </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Image src="https://www.vectorlogo.zone/logos/upi/upi-icon.svg" alt="UPI" width={32} height={32}/>
                  <div>
                      <h4 className="font-semibold">{t('upi_id')}</h4>
                      <p className="text-muted-foreground text-sm">{user.upiId}</p>
                  </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Landmark className="h-8 w-8 text-muted-foreground" />
                  <div>
                      <h4 className="font-semibold">{t('bank_account')}</h4>
                      <p className="text-muted-foreground text-sm">{user.bankAccount}</p>
                  </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Banknote className="h-8 w-8 text-muted-foreground" />
                  <div>
                      <h4 className="font-semibold">{t('aadhaar_linked')}</h4>
                      <p className="text-muted-foreground text-sm">{t('yes_for_payouts')}</p>
                  </div>
              </div>
          </CardContent>
        </Card>}
      </div>
    </div>
  </>
)};

const BuyerProfile = ({ user, isPublicView, onUpdate }: { user: any, isPublicView: boolean, onUpdate: (data: any) => void }) => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [formData, setFormData] = useState(user);
    const { user: loggedInUser, openLoginDialog } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        setFormData(user);
    }, [user]);
    
    const handleAvatarClick = () => {
        if (!isPublicView) {
          fileInputRef.current?.click();
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const newAvatar = reader.result as string;
            onUpdate({ ...formData, avatar: newAvatar });
            toast({
              title: "Profile Photo Updated",
              description: "Your new photo has been saved.",
            });
          };
          reader.readAsDataURL(file);
        }
    };


    const handleSave = () => {
        onUpdate(formData);
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved.",
        });
    };
    
    const handleProtectedAction = (callback: () => void) => {
        if (loggedInUser) {
            callback();
        } else {
            openLoginDialog();
        }
    };

  return (
  <>
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <div className="relative group">
        <Avatar className="h-24 w-24 border-4 border-primary">
          <AvatarImage src={user.avatar} alt={t(user.name)} />
          <AvatarFallback>{t(user.name).charAt(0)}</AvatarFallback>
        </Avatar>
        {!isPublicView && (
          <>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <div onClick={handleAvatarClick} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="text-white" />
            </div>
          </>
        )}
      </div>
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold">{t(user.name)}</h1>
        <p className="text-muted-foreground">{t('joined_1_year_ago')}</p>
        <div className="mt-2 flex items-center justify-center gap-2 md:justify-start">
          <Badge>{t('buyer')}</Badge>
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-accent fill-accent" />
            <span>{t('gold_tier_buyer')}</span>
          </div>
        </div>
      </div>
      <div className="md:ml-auto flex gap-2">
      {isPublicView ? (
             <div className="flex gap-2">
                <Button asChild variant="outline">
                    <a href={`tel:${user.phone}`}><Phone className="mr-2 h-4 w-4" />{t('call')}</a>
                </Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button onClick={(e) => handleProtectedAction(() => {})}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {t('chat')}
                        </Button>
                    </DialogTrigger>
                    {loggedInUser && (
                        <GeneralChatDialog 
                            userName={user.name} 
                            userRole="buyer"
                        />
                    )}
                </Dialog>
             </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button><Edit className="mr-2"/>{t('edit_profile')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('edit_profile')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="name">{t('name')}</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="bio">{t('spending_habits')}</Label>
                      <Textarea id="bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="phone">{t('contact_number')}</Label>
                      <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                      <Button variant="outline">{t('cancel')}</Button>
                  </DialogClose>
                  <DialogClose asChild>
                      <Button onClick={handleSave}>{t('save_changes')}</Button>
                  </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        </div>
    </div>
    <Separator />
    <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader><CardTitle>{t('spending_habits')}</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{t(user.bio)}</p>
                </CardContent>
            </Card>
             {!isPublicView && <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('saved_addresses')}</CardTitle>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader><DialogTitle>{t('edit_saved_addresses')}</DialogTitle></DialogHeader>
                             <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="home-address">{t('home')}</Label>
                                    <Input id="home-address" value={formData.addresses?.home || ''} onChange={(e) => setFormData({...formData, addresses: {...formData.addresses, home: e.target.value}})} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="office-address">{t('office')}</Label>
                                    <Input id="office-address" value={formData.addresses?.office || ''} onChange={(e) => setFormData({...formData, addresses: {...formData.addresses, office: e.target.value}})} />
                                </div>
                             </div>
                             <DialogFooter>
                                <DialogClose asChild><Button variant="outline">{t('cancel')}</Button></DialogClose>
                                <DialogClose asChild><Button onClick={handleSave}>{t('save_changes')}</Button></DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="p-3 border rounded-md">
                        <p className="font-semibold">{t('home')}</p>
                        <p className="text-muted-foreground text-sm">{user.addresses?.home}</p>
                    </div>
                     <div className="p-3 border rounded-md">
                        <p className="font-semibold">{t('office')}</p>
                        <p className="text-muted-foreground text-sm">{user.addresses?.office}</p>
                    </div>
                </CardContent>
            </Card>}
        </div>
        <div className="space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle>{t('contact')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <span>{t('Pune')}, {t('Maharashtra')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span>{user.phone}</span>
                    </div>
                </CardContent>
            </Card>
             {!isPublicView && <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('payment_methods')}</CardTitle>
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader><DialogTitle>{t('edit_payment_methods')}</DialogTitle></DialogHeader>
                             <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="upi-payment">{t('upi_id')}</Label>
                                    <Input id="upi-payment" value={formData.payment?.upi || ''} onChange={(e) => setFormData({...formData, payment: {...formData.payment, upi: e.target.value}})} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="card-payment">{t('credit_card')}</Label>
                                    <Input id="card-payment" value={formData.payment?.card || ''} onChange={(e) => setFormData({...formData, payment: {...formData.payment, card: e.target.value}})} />
                                </div>
                             </div>
                             <DialogFooter>
                                <DialogClose asChild><Button variant="outline">{t('cancel')}</Button></DialogClose>
                                <DialogClose asChild><Button onClick={handleSave}>{t('save_changes')}</Button></DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Image src="https://www.vectorlogo.zone/logos/upi/upi-icon.svg" alt="UPI" width={24} height={24}/>
                        <span>{user.payment?.upi}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Landmark className="h-6 w-6 text-muted-foreground" />
                       <span>{user.payment?.card}</span>
                    </div>
                </CardContent>
            </Card>}
        </div>
    </div>
  </>
)};

const DeliveryProfile = ({ user, isPublicView, onUpdate }: { user: any, isPublicView: boolean, onUpdate: (data: any) => void }) => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [formData, setFormData] = useState(user);
    const { user: loggedInUser, openLoginDialog } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFormData(user);
    }, [user]);
    
    const handleAvatarClick = () => {
        if (!isPublicView) {
          fileInputRef.current?.click();
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const newAvatar = reader.result as string;
            onUpdate({ ...formData, avatar: newAvatar });
            toast({
              title: "Profile Photo Updated",
              description: "Your new photo has been saved.",
            });
          };
          reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onUpdate(formData);
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved.",
        });
    };
    
    const handleContact = (role: string) => {
        toast({
            title: `Connecting with ${role}...`,
            description: `This feature is under development.`,
        });
    }

    const handleProtectedAction = (callback: () => void) => {
        if (loggedInUser) {
            callback();
        } else {
            openLoginDialog();
        }
    };

    return (
    <>
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <div className="relative group">
        <Avatar className="h-24 w-24 border-4 border-primary">
          <AvatarImage src={user.avatar} alt={t(user.name)} />
          <AvatarFallback>{t(user.name).charAt(0)}</AvatarFallback>
        </Avatar>
        {!isPublicView && (
          <>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <div onClick={handleAvatarClick} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="text-white" />
            </div>
          </>
        )}
      </div>
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold">{t(user.name)}</h1>
        <p className="text-muted-foreground">{t('partner_since')}</p>
        <div className="mt-2 flex items-center justify-center gap-2 md:justify-start">
          <Badge>{t('delivery')}</Badge>
           <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-accent fill-accent" />
            <span>{user.rating} ({t('250_ratings')})</span>
          </div>
        </div>
      </div>
      <div className="md:ml-auto flex gap-2">
      {isPublicView ? (
             <div className="flex gap-2">
                <Button asChild variant="outline">
                    <a href={`tel:${user.phone}`}><Phone className="mr-2 h-4 w-4" />{t('call')}</a>
                </Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button onClick={(e) => handleProtectedAction(() => {})}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {t('chat')}
                        </Button>
                    </DialogTrigger>
                    {loggedInUser && (
                        <GeneralChatDialog 
                            userName={user.name} 
                            userRole="delivery"
                        />
                    )}
                </Dialog>
             </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button><Edit className="mr-2"/>{t('edit_profile')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('edit_profile')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="name">{t('name')}</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="vehicle">{t('vehicle_details')}</Label>
                      <Input id="vehicle" value={formData.vehicle} onChange={(e) => setFormData({...formData, vehicle: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="serviceArea">{t('service_area')}</Label>
                      <Input id="serviceArea" value={formData.serviceArea} onChange={(e) => setFormData({...formData, serviceArea: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="phone-delivery">{t('contact_number')}</Label>
                      <Input id="phone-delivery" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                      <Button variant="outline">{t('cancel')}</Button>
                  </DialogClose>
                  <DialogClose asChild>
                      <Button onClick={handleSave}>{t('save_changes')}</Button>
                  </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      )}
      </div>
    </div>
     <Separator />
    <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            {!isPublicView && (
                <Card>
                    <CardHeader>
                        <CardTitle>Live Delivery: Order #OD7865</CardTitle>
                        <CardDescription>Track your current delivery in real-time.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted">
                            <Image 
                                src="https://picsum.photos/seed/map/800/400"
                                alt="Live Map"
                                fill
                                style={{objectFit: 'cover'}}
                                data-ai-hint="city map"
                            />
                            <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center">
                                <p className="text-lg font-semibold text-background bg-black/50 px-4 py-2 rounded-md">Live map coming soon</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold">Vehicle ID</h4>
                                <p className="text-muted-foreground text-sm flex items-center gap-2"><Car/> {user.vehicleId}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">License No.</h4>
                                <p className="text-muted-foreground text-sm flex items-center gap-2"><User/> {user.licenseNo}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="w-full" onClick={() => handleContact("Farmer")}>
                                <Mail className="mr-2 h-4 w-4"/> Chat with Farmer
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => handleContact("Buyer")}>
                                <Mail className="mr-2 h-4 w-4"/> Chat with Buyer
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
             <Card>
                <CardHeader><CardTitle>{t('performance')}</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                   <div className="p-3 bg-secondary rounded-md text-center">
                        <p className="text-sm text-muted-foreground">{t('on_time_deliveries')}</p>
                        <p className="text-2xl font-bold">98%</p>
                   </div>
                    <div className="p-3 bg-secondary rounded-md text-center">
                        <p className="text-sm text-muted-foreground">{t('total_deliveries')}</p>
                        <p className="text-2xl font-bold">512</p>
                   </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>{t('vehicle_details')}</CardTitle></CardHeader>
                <CardContent>
                    <p className="font-semibold">{t(user.vehicle)}</p>
                    <p className="text-muted-foreground text-sm">{user.vehicleId}</p>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-4">
             <Card>
                <CardHeader><CardTitle>{t('service_area')}</CardTitle></CardHeader>
                <CardContent>
                     <p className="text-muted-foreground">{t(user.serviceArea)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>{t('contact')}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span>{user.phone}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
    </>
)};

const AdminProfile = ({ user }: { user: any }) => {
    const { t } = useLanguage();
    return (
    <>
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <Avatar className="h-24 w-24 border-4 border-destructive">
        <AvatarImage src={user.avatar} alt="Admin" />
        <AvatarFallback>{t(user.name).charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold">{t(user.name)}</h1>
        <p className="text-muted-foreground">{t('platform_admin')}</p>
        <div className="mt-2 flex items-center justify-center gap-2 md:justify-start">
          <Badge variant="destructive">{t('admin')}</Badge>
        </div>
      </div>
    </div>
     <Separator />
     <div className="grid gap-8">
        <Card>
            <CardHeader><CardTitle>{t('platform_overview')}</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-secondary rounded-md">
                    <Users className="mx-auto h-6 w-6 text-muted-foreground mb-1"/>
                    <p className="text-xl font-bold">1,250</p>
                    <p className="text-sm text-muted-foreground">{t('total_users')}</p>
                </div>
                 <div className="p-3 bg-secondary rounded-md">
                    <Leaf className="mx-auto h-6 w-6 text-muted-foreground mb-1"/>
                    <p className="text-xl font-bold">850</p>
                    <p className="text-sm text-muted-foreground">{t('active_listings')}</p>
                </div>
                 <div className="p-3 bg-secondary rounded-md">
                    <Truck className="mx-auto h-6 w-6 text-muted-foreground mb-1"/>
                    <p className="text-xl font-bold">75</p>
                    <p className="text-sm text-muted-foreground">{t('deliveries_today')}</p>
                </div>
                 <div className="p-3 bg-secondary rounded-md">
                    <ShieldAlert className="mx-auto h-6 w-6 text-muted-foreground mb-1"/>
                    <p className="text-xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">{t('fraud_alerts')}</p>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>{t('quick_actions')}</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-4">
                <Button asChild variant="outline">
                    <Link href="/dashboard/admin#analytics"><BarChart2 className="mr-2 h-4 w-4"/> {t('view_analytics')}</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/dashboard/admin#users"><Users className="mr-2 h-4 w-4"/> {t('manage_users')}</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/dashboard/admin#listings"><Leaf className="mr-2 h-4 w-4"/> {t('manage_listings')}</Link>
                </Button>
                <Button asChild variant="destructive">
                    <Link href="/dashboard/admin#fraud-alerts"><ShieldAlert className="mr-2 h-4 w-4"/> {t('review_fraud_alerts')}</Link>
                </Button>
            </CardContent>
        </Card>
     </div>
    </>
)};


const ProfilePageContent = () => {
    const { user: loggedInUser, login: updateUserInContext } = useAuth();
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    
    const publicUserName = searchParams.get('user');
    const publicUserRole = searchParams.get('role');
    const isPublicView = !!publicUserName && !!publicUserRole && (publicUserName !== loggedInUser?.name || publicUserRole !== loggedInUser?.role);


    const [profileData, setProfileData] = useState<any>(null);

    useEffect(() => {
        const role = isPublicView ? publicUserRole : loggedInUser?.role;
        const name = isPublicView ? publicUserName : loggedInUser?.name;

        if (role && name) {
            const storedUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
            const foundUser = storedUsers.find((u: any) => u.name === name && u.role === role);
            
            if (foundUser) {
                setProfileData(foundUser);
            } else if (loggedInUser && !isPublicView) {
                setProfileData(loggedInUser);
            }
        } else if (loggedInUser) {
            setProfileData(loggedInUser);
        }
    }, [loggedInUser, publicUserName, publicUserRole, isPublicView]);
    
    const handleUpdateProfile = (updatedData: any) => {
        const updatedUser = updateUser(updatedData.id, updatedData);
        setProfileData(updatedUser);

        if (!isPublicView && loggedInUser && loggedInUser.id === updatedData.id) {
            updateUserInContext(updatedUser as any);
             // Also update 'user' in localStorage for immediate consistency on refresh
            if (localStorage.getItem('user')) {
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        }
    };


    const renderProfile = () => {
        if (!profileData) {
            if (isPublicView) {
                 return <p>Loading profile...</p>; // Or some loading state
            }
            return (
                <div className="text-center">
                    <p>{t('login_to_view_profile')}</p>
                    <Button asChild className="mt-4"><Link href="/login">{t('login')}</Link></Button>
                </div>
            );
        }

        switch (profileData.role) {
            case 'farmer':
                return <FarmerProfile user={profileData} isPublicView={isPublicView} onUpdate={handleUpdateProfile} />;
            case 'buyer':
                return <BuyerProfile user={profileData} isPublicView={isPublicView} onUpdate={handleUpdateProfile} />;
            case 'delivery':
                return <DeliveryProfile user={profileData} isPublicView={isPublicView} onUpdate={handleUpdateProfile} />;
            case 'admin':
                return <AdminProfile user={profileData} />;
            default:
                return <p>{t('invalid_user_role')}</p>;
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1 p-4 md:p-8">
                <div className="mx-auto max-w-4xl space-y-8">
                    {renderProfile()}
                </div>
            </main>
        </div>
    );
}

export default function ProfilePage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ProfilePageContent />
    </React.Suspense>
  )
}
