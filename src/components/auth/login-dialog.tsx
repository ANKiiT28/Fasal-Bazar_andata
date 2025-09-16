
"use client";

import { useAuth } from "@/context/auth-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AuthForm } from "./auth-form";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { User, Building, Truck, Shield } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function LoginDialog() {
    const { isLoginDialogOpen, closeLoginDialog } = useAuth();
    const { t } = useLanguage();
    const [role, setRole] = useState("buyer");

    if (!isLoginDialogOpen) {
        return null;
    }

    return (
        <Dialog open={isLoginDialogOpen} onOpenChange={closeLoginDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('login_signup')}</DialogTitle>
                    <DialogDescription>
                        {t('login_to_continue')}
                    </DialogDescription>
                </DialogHeader>

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
                        <AuthForm role="farmer" />
                    </TabsContent>
                    <TabsContent value="buyer">
                         <AuthForm role="buyer" />
                    </TabsContent>
                    <TabsContent value="delivery">
                         <AuthForm role="delivery" />
                    </TabsContent>
                    <TabsContent value="admin">
                        <AuthForm role="admin" />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
