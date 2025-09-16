
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Truck, Building, Shield } from "lucide-react";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";


export default function LoginPage() {
  const { t } = useLanguage();
  const [role, setRole] = useState("farmer");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
      <div className="flex justify-center mb-6">
        <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Fasal Bazar Logo" width={48} height={48} className="rounded-full shadow-lg shadow-blue-500/50 object-cover" />
            <span className="text-2xl font-bold">{t('fasal_bazar')}</span>
        </Link>
      </div>
      <Tabs value={role} onValueChange={setRole} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="farmer">
            <User className="mr-2 h-4 w-4" /> {t('farmer')}
          </TabsTrigger>
          <TabsTrigger value="buyer">
            <Building className="mr-2 h-4 w-4" /> {t('buyer')}
          </TabsTrigger>
          <TabsTrigger value="delivery">
            <Truck className="mr-2 h-4 w-4" /> {t('delivery')}
          </TabsTrigger>
           <TabsTrigger value="admin">
            <Shield className="mr-2 h-4 w-4" /> {t('admin')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="farmer">
          <Card>
            <CardHeader>
              <CardTitle>{t('farmer_login')}</CardTitle>
              <CardDescription>
                {t('farmer_login_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm role="farmer" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="buyer">
          <Card>
            <CardHeader>
              <CardTitle>{t('buyer_login')}</CardTitle>
              <CardDescription>
                {t('buyer_login_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm role="buyer"/>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>{t('delivery_partner_login')}</CardTitle>
              <CardDescription>
                {t('delivery_partner_login_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm role="delivery"/>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin_login')}</CardTitle>
              <CardDescription>
                {t('admin_login_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm role="admin"/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
