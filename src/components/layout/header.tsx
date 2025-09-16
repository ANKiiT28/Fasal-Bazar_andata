

"use client";

import Link from "next/link";
import { Languages, MessageSquare, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";

export function Header() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const isLoggedIn = !!user;
  const role = user?.role || "buyer";


  const getDashboardLink = () => {
    switch(role) {
        case 'farmer':
            return "/dashboard/farmer";
        case 'buyer':
            return "/dashboard/buyer";
        case 'delivery':
            return "/dashboard/delivery";
        case 'admin':
            return "/dashboard/admin";
        default:
            return "/";
    }
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/logo.png" alt="Fasal Bazar Logo" width={48} height={48} className="rounded-full shadow-lg shadow-blue-500/50 object-cover" />
          <span className="font-bold sm:inline-block">
            {t('fasal_bazar')}
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Change language">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setLanguage('en')} disabled={language === 'en'}>English</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setLanguage('hi')} disabled={language === 'hi'}>हिन्दी</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href="/profile">{t('profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()}>{t('dashboard')}</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/community-forum" className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4"/>
                        {t('forum')}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>{t('logout')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
                <Link href="/login">
                    <User className="mr-2 h-4 w-4"/>
                    {t('login')}
                </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
