
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Shield, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { findOrCreateUser, type UserCredentials } from "@/lib/user-store";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="48px"
        height="48px"
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        />
      </svg>
    );
}

function AadhaarIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M22 12h-2" />
            <path d="M4 12H2" />
        </svg>
    )
}

export const AuthForm = ({ role }: { role: string }) => {
  const { login, closeLoginDialog } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleAuthAction = (action: 'signin' | 'signup') => {
    let credentials: UserCredentials = { email, password, role };
    if (action === 'signup') {
        if (password !== confirmPassword) {
            toast({ variant: "destructive", title: "Sign Up Failed", description: "Passwords do not match." });
            return;
        }
        credentials.name = name;
    }

    const result = findOrCreateUser(credentials, action === 'signup');

    if (result.success && result.user) {
      login(result.user);
      closeLoginDialog();
      router.push('/');
      toast({ title: result.message, description: `Welcome, ${result.user.name}!` });
    } else {
      toast({ variant: "destructive", title: action === 'signup' ? "Sign Up Failed" : "Login Failed", description: result.message });
    }
  };

  const handleSocialAuth = () => {
    const tempEmail = `${role}${Date.now()}@example.com`;
    const result = findOrCreateUser({
      email: tempEmail,
      password: "social_login_password", // A placeholder password
      name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      role,
    }, true);

    if (result.success && result.user) {
      login(result.user);
      closeLoginDialog();
      router.push('/');
      toast({ title: "Login Successful", description: `Welcome, ${result.user.name}!` });
    } else {
      toast({ variant: "destructive", title: "Login Failed", description: result.message });
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "If an account with this email exists, a password reset link has been sent.",
    });
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAuthAction(authMode);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {authMode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor={`${role}-name`}>{t('name')}</Label>
            <Input id={`${role}-name`} type="text" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor={`${role}-email`}>{t('email')}</Label>
          <Input id={`${role}-email`} type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${role}-password`}>{t('password')}</Label>
            {authMode === 'signin' && (
              <Link href="#" className="text-sm underline" onClick={(e) => {e.preventDefault(); handleForgotPassword();}}>
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Input id={`${role}-password`} type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>
        {authMode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor={`${role}-confirm-password`}>Confirm Password</Label>
            <div className="relative">
              <Input id={`${role}-confirm-password`} type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
               <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>
        )}

        <Button className="w-full" type="submit">{authMode === 'signin' ? t('sign_in') : t('sign_up')}</Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t('or_continue_with')}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button" onClick={handleSocialAuth}>
            <Phone className="mr-2 h-4 w-4" /> {t('phone_otp')}
          </Button>
          <Button variant="outline" type="button" onClick={handleSocialAuth}>
            <GoogleIcon className="mr-2 h-5 w-5" /> {t('google')}
          </Button>
        </div>
        <Button variant="outline" className="w-full" type="button" onClick={handleSocialAuth}>
          <AadhaarIcon className="mr-2 h-5 w-5" /> {t('sign_in_with_aadhaar')}
        </Button>
        
        <div className="mt-4 text-center text-sm">
          {authMode === 'signin' ? (
            <>
              {t('dont_have_account')}{" "}
              <Link href="#" className="underline" onClick={(e) => { e.preventDefault(); setAuthMode('signup'); }}>
                {t('sign_up')}
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="#" className="underline" onClick={(e) => { e.preventDefault(); setAuthMode('signin'); }}>
                {t('sign_in')}
              </Link>
            </>
          )}
        </div>
      </div>
    </form>
  );
};
