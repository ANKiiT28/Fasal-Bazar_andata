
"use client";

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Landmark, Wallet, IndianRupee, Calendar, Clock, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import type { Crop } from '@/types';

function CheckoutPageContent() {
  const [quantity, setQuantity] = useState(1);
  const [crop, setCrop] = useState<Crop | null>(null);

  useEffect(() => {
    const storedCrop = sessionStorage.getItem('checkoutCrop');
    if (storedCrop) {
      setCrop(JSON.parse(storedCrop));
    }
  }, []);

  if (!crop) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-semibold">Loading checkout details...</p>
                    <p className="text-sm text-muted-foreground">Or the item was not selected correctly.</p>
                    <Button asChild variant="outline" className="mt-4">
                        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Marketplace</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
  }

  const subtotal = crop.price * quantity;
  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Select a way to pay for your order.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue="upi" className="space-y-4">
                            <Label htmlFor="upi" className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                <div className="flex items-center gap-3">
                                    <Image src="https://www.vectorlogo.zone/logos/upi/upi-icon.svg" alt="UPI" width={40} height={40}/>
                                    <span>UPI / QR Code</span>
                                </div>
                                <RadioGroupItem value="upi" id="upi" />
                            </Label>
                             <Label htmlFor="card" className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-10 h-10 text-muted-foreground" />
                                    <span>Debit/Credit Card</span>
                                </div>
                                <RadioGroupItem value="card" id="card" />
                            </Label>
                             <Label htmlFor="wallet" className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                <div className="flex items-center gap-3">
                                    <Wallet className="w-10 h-10 text-muted-foreground" />
                                    <span>Wallet</span>
                                </div>
                                <RadioGroupItem value="wallet" id="wallet" />
                            </Label>
                             <Label htmlFor="netbanking" className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                <div className="flex items-center gap-3">
                                    <Landmark className="w-10 h-10 text-muted-foreground" />
                                    <span>Netbanking</span>
                                </div>
                                <RadioGroupItem value="netbanking" id="netbanking" />
                            </Label>
                             <Label htmlFor="cod" className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                <div className="flex items-center gap-3">
                                    <IndianRupee className="w-10 h-10 text-muted-foreground" />
                                    <span>Cash on Delivery (COD)</span>
                                </div>
                                <RadioGroupItem value="cod" id="cod" />
                            </Label>
                        </RadioGroup>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Delivery Slot</CardTitle>
                        <CardDescription>Choose when you'd like to receive your order.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="delivery-date" className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Delivery Date</Label>
                           <Input id="delivery-date" type="date" defaultValue={new Date().toISOString().split('T')[0]}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="delivery-time" className="flex items-center gap-2"><Clock className="h-4 w-4"/> Delivery Time</Label>
                             <Select defaultValue="9-12">
                                <SelectTrigger id="delivery-time">
                                    <SelectValue placeholder="Select a time slot" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="9-12">9:00 AM - 12:00 PM</SelectItem>
                                    <SelectItem value="1-4">1:00 PM - 4:00 PM</SelectItem>
                                    <SelectItem value="5-8">5:00 PM - 8:00 PM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                 </Card>
            </div>
            <div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Image src={crop.imageUrl} alt={crop.name} width={80} height={80} className="rounded-md object-cover" />
                            <div>
                                <h4 className="font-semibold">{crop.name} ({crop.variety})</h4>
                                <p className="text-sm text-muted-foreground">From {crop.farmer.name} in {crop.city}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <Label htmlFor="quantity">Quantity (kg):</Label>
                           <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-20"/>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                           <div className="flex justify-between">
                               <span>Subtotal</span>
                               <span>Rs. {subtotal.toFixed(2)}</span>
                           </div>
                            <div className="flex justify-between">
                               <span>Delivery Fee</span>
                               <span>Rs. {deliveryFee.toFixed(2)}</span>
                           </div>
                           <Separator />
                           <div className="flex justify-between font-bold text-lg">
                               <span>Total</span>
                               <span>Rs. {total.toFixed(2)}</span>
                           </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full">Confirm and Pay</Button>
                    </CardFooter>
                 </Card>
            </div>
        </div>
      </main>
    </div>
  );
}


export default function CheckoutPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <CheckoutPageContent />
        </React.Suspense>
    )
}

    