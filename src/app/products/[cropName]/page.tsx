

"use client";

import { useEffect, useState, useMemo, Suspense, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Star, Info, MessageSquare, ShoppingCart, Send, Phone, ArrowLeft, ExternalLink, Mic, StopCircle, ShieldCheck, MapPin } from "lucide-react";
import { type Crop, priceReasons } from "@/types";
import { chatWithFarmer } from "@/ai/flows/farmer-chat-flow";
import { textToSpeech } from "@/ai/flows/text-to-speech.ts";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

function ChatDialog({ crop }: { crop: Crop }) {
    const { toast } = useToast();
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    
    const initialQuickReplies = [
        t('chat_qr_price'),
        t('chat_qr_organic'),
        t('chat_qr_freshness', { cropName: t(crop.name) }),
        t('chat_qr_delivery'),
    ];
    const [quickReplies, setQuickReplies] = useState(initialQuickReplies);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';
            recognitionRef.current.interimResults = false;
            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSendMessage(transcript);
                setIsListening(false);
            };
            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed') {
                     toast({
                        variant: "destructive",
                        title: "Voice Access Denied",
                        description: "Microphone access is disabled. Please allow it in your browser settings. Note: Microphone access requires a secure (HTTPS) connection."
                    });
                } else if (event.error !== 'no-speech') {
                    toast({
                        variant: "destructive",
                        title: "Voice Error",
                        description: `Could not recognize speech: ${event.error}. Please try again.`
                    });
                }
                setIsListening(false);
            };
             recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [language, toast]);
    
    const handleVoiceInput = () => {
        if (!recognitionRef.current) {
            toast({
                variant: "destructive",
                title: "Voice Not Supported",
                description: "Your browser does not support voice recognition."
            });
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };


    const getDynamicQuickReplies = (lastMessage: string) => {
        const replies = new Set<string>();
        const lowerCaseMessage = lastMessage.toLowerCase();

        if(lowerCaseMessage.includes('price') || lowerCaseMessage.includes('Rs.') || lowerCaseMessage.includes('कीमत') || lowerCaseMessage.includes('दाम')) {
            replies.add(t('chat_qr_discount'));
            replies.add(t('chat_qr_final_price'));
        }
        if(lowerCaseMessage.includes('organic') || lowerCaseMessage.includes('जैविक')) {
            replies.add(t('chat_qr_certified'));
        }
        if(lowerCaseMessage.includes('fresh') || lowerCaseMessage.includes('ताजा')) {
            replies.add(t('chat_qr_harvested'));
        }
        if(lowerCaseMessage.includes('deliver') || lowerCaseMessage.includes('डिलीवर')) {
            replies.add(t('chat_qr_delivery_charges'));
            replies.add(t('chat_qr_delivery_area'));
        }
        if(replies.size === 0) {
           return [
               t('chat_qr_quality'),
               t('chat_qr_other_crops')
           ]
        }
        return Array.from(replies);
    }

    const playAudio = (audioDataUri: string | null) => {
        if (audioRef.current && audioDataUri) {
            audioRef.current.src = audioDataUri;
            audioRef.current.play().catch(e => console.error("Audio playback failed", e));
        }
    }

    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;

        const userMessage = { role: 'user' as const, content: message };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setQuickReplies([]);

        try {
             const result = await chatWithFarmer({
                cropName: crop.name,
                farmerName: crop.farmer.name,
                message: message,
                history: messages,
                cropDetails: {
                    price: crop.price,
                    isOrganic: crop.isOrganic,
                    freshness: crop.freshness,
                    variety: crop.variety,
                }
            });
            const modelMessage = { role: 'model' as const, content: result.reply };
            setMessages(prev => [...prev, modelMessage]);
            setQuickReplies(getDynamicQuickReplies(result.reply));
            
            const audioResult = await textToSpeech({ text: result.reply, language });
            playAudio(audioResult.audioDataUri);

        } catch (error: any) {
            console.error(error);
            const errorMessage = error.message && error.message.includes('503') 
                ? "The AI model is currently overloaded. Please try again in a moment."
                : "Could not get a response. The farmer might be busy. Please try again later.";
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
             setMessages(prev => prev.slice(0, -1)); // Remove user message on error
             setQuickReplies(initialQuickReplies);
        } finally {
            setLoading(false);
        }
    }
    
    const handleQuickReply = (reply: string) => {
        handleSendMessage(reply);
    }
    
    const handleContactFarmer = (method: 'chat' | 'call') => {
        toast({
            title: `Connecting you with ${crop.farmer.name}...`,
            description: `The ${method} feature is coming soon!`,
        });
    };

    return (
        <DialogContent className="max-w-2xl w-full h-[80vh] flex flex-col p-0">
            <audio ref={audioRef} className="hidden" />
            <DialogHeader className="p-4 border-b">
                 <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={`https://picsum.photos/seed/${crop.farmer.name}/100`} alt={crop.farmer.name} />
                        <AvatarFallback>{crop.farmer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <DialogTitle>{t('chat_title', { farmerName: t(crop.farmer.name) })}</DialogTitle>
                        <DialogDescription>{t('chat_description', { cropName: t(crop.name) })}</DialogDescription>
                    </div>
                </div>
            </DialogHeader>
            <div className="flex flex-col flex-1 bg-muted/50 overflow-hidden">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.length === 0 && (
                             <div className="flex gap-2.5 justify-start">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={`https://picsum.photos/seed/${crop.farmer.name}/100`} alt={crop.farmer.name} />
                                    <AvatarFallback>{crop.farmer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="max-w-[75%] p-3 rounded-lg rounded-tl-none bg-background shadow-sm">
                                    <p className="text-sm">{t('chat_greeting', { farmerName: t(crop.farmer.name), cropName: t(crop.name) })}</p>
                                </div>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex gap-2.5 items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                 {msg.role === 'model' && (
                                     <Avatar className="w-8 h-8">
                                         <AvatarImage src={`https://picsum.photos/seed/${crop.farmer.name}/100`} alt={crop.farmer.name} />
                                         <AvatarFallback>{crop.farmer.name.charAt(0)}</AvatarFallback>
                                     </Avatar>
                                 )}
                                <div className={`max-w-[75%] p-3 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-background rounded-bl-none'}`}>
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                         {loading && (
                            <div className="flex gap-2.5 justify-start">
                                 <Avatar className="w-8 h-8">
                                     <AvatarImage src={`https://picsum.photos/seed/${crop.farmer.name}/100`} alt={crop.farmer.name} />
                                     <AvatarFallback>{crop.farmer.name.charAt(0)}</AvatarFallback>
                                 </Avatar>
                                <div className="max-w-[75%] p-3 rounded-lg bg-background rounded-bl-none shadow-sm flex items-center">
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-fast mx-1"></div>
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-fast mx-1 delay-150"></div>
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-fast mx-1 delay-300"></div>
                                </div>
                            </div>
                         )}
                         {messages.length > 0 && messages[messages.length-1].role === 'model' && (messages[messages.length-1].content.toLowerCase().includes('call') || messages[messages.length-1].content.toLowerCase().includes('chat')) && (
                             <div className="flex justify-start gap-2 pt-2">
                                <Button variant="outline" size="sm" onClick={() => handleContactFarmer('call')}><Phone className="mr-2"/>{t('call_farmer')}</Button>
                                <Button variant="outline" size="sm" onClick={() => handleContactFarmer('chat')}><MessageSquare className="mr-2"/>{t('live_chat')}</Button>
                             </div>
                         )}
                    </div>
                </ScrollArea>
                 <div className="p-4 border-t bg-background space-y-3">
                     {quickReplies.length > 0 && !loading && (
                        <ScrollArea className="w-full whitespace-nowrap">
                            <div className="flex gap-2 pb-2">
                                {quickReplies.map(reply => (
                                    <Button key={reply} variant="outline" size="sm" onClick={() => handleQuickReply(reply)} disabled={loading} className="shrink-0">
                                        {reply}
                                    </Button>
                                ))}
                             </div>
                         </ScrollArea>
                     )}
                    <form onSubmit={(e) => {e.preventDefault(); handleSendMessage(input)}} className="flex items-center gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isListening ? "Listening..." : t('chat_placeholder')}
                            autoComplete="off"
                            disabled={loading || isListening}
                        />
                         <Button type="button" size="icon" variant={isListening ? "destructive" : "outline"} onClick={handleVoiceInput} disabled={loading}>
                            {isListening ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </DialogContent>
    );
}

function getPriceReason(basePrice: number, currentPrice: number, t: (key: string) => string): string {
    const priceDifference = currentPrice - basePrice;
    const priceThreshold = basePrice * 0.15; // 15% threshold

    if (priceDifference > priceThreshold) {
        return t(priceReasons.high[Math.floor(Math.random() * priceReasons.high.length)]);
    } else if (priceDifference < -priceThreshold) {
        return t(priceReasons.low[Math.floor(Math.random() * priceReasons.low.length)]);
    }
    return t(priceReasons.standard[Math.floor(Math.random() * priceReasons.standard.length)]);
}


function ProductDetailsPageContent() {
    const params = useParams();
    const router = useRouter();
    const { user, openLoginDialog } = useAuth();
    const { t } = useLanguage();
    const [allCrops, setAllCrops] = useState<Crop[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [cropName, setCropName] = useState<string>('');
    const [mainImage, setMainImage] = useState<string | null>(null);

    useEffect(() => {
        const storedCrops = localStorage.getItem('allCrops');
        if (storedCrops) {
            setAllCrops(JSON.parse(storedCrops));
        }
        const storedUsers = localStorage.getItem('app_users');
        if(storedUsers) {
            setAllUsers(JSON.parse(storedUsers));
        }

        if (params.cropName) {
            const decodedCropName = decodeURIComponent(params.cropName as string);
            setCropName(decodedCropName);
        }
    }, [params.cropName]);

    const comparisonCrops = useMemo(() => {
        if (!cropName || allCrops.length === 0) return [];
        return allCrops.filter(c => c.name === cropName).map(crop => {
            const farmerDetails = allUsers.find(u => u.name === crop.farmer.name && u.role === 'farmer');
            return {
                ...crop,
                farmer: {
                    ...crop.farmer,
                    isTrusted: farmerDetails?.isTrusted || false
                }
            }
        }).sort((a, b) => a.price - b.price);
    }, [cropName, allCrops, allUsers]);

    const imageGallery = useMemo(() => 
        Array.from(new Set(comparisonCrops.map(c => c.imageUrl)))
    , [comparisonCrops]);

    useEffect(() => {
        if (imageGallery.length > 0) {
            setMainImage(imageGallery[0]);
        }
    }, [imageGallery]);


    if (comparisonCrops.length === 0) {
        return (
            <div className="flex min-h-screen w-full flex-col bg-background">
                <Header />
                <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-lg font-semibold">{t('loading_product_details')}</p>
                         <Button asChild variant="outline" className="mt-4">
                            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4"/> {t('back_to_marketplace')}</Link>
                        </Button>
                    </div>
                </main>
            </div>
        );
    }
    
    const cropDetails = comparisonCrops[0];
    const basePrice = comparisonCrops.reduce((acc, c) => acc + c.price, 0) / comparisonCrops.length;

    const handleBuyNow = (crop: Crop) => {
        if (!user) {
            openLoginDialog();
            return;
        }
        sessionStorage.setItem('checkoutCrop', JSON.stringify(crop));
        router.push(`/checkout`);
    }

    const handleProtectedAction = (callback: () => void) => {
        if (user) {
            callback();
        } else {
            openLoginDialog();
        }
    };


    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto p-4 md:p-8">
                 <Button asChild variant="ghost" className="mb-4">
                    <Link href="/"><ArrowLeft className="mr-2 h-4 w-4"/> {t('back_to_marketplace')}</Link>
                </Button>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Image Gallery */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="aspect-square w-full overflow-hidden rounded-lg">
                            {mainImage && <Image
                                src={mainImage}
                                alt={t(cropDetails.name)}
                                width={600}
                                height={600}
                                className="object-cover w-full h-full"
                                data-ai-hint={cropDetails.name.toLowerCase()}
                            />}
                        </div>
                        <ScrollArea className="w-full whitespace-nowrap">
                            <div className="flex gap-2 pb-2">
                                {imageGallery.map(img => (
                                     <div key={img} className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${mainImage === img ? 'border-primary' : 'border-transparent'}`} onClick={() => setMainImage(img)}>
                                        <Image
                                            src={img}
                                            alt={t('thumbnail', { cropName: t(cropDetails.name) })}
                                            width={80}
                                            height={80}
                                            className="object-cover w-full h-full"
                                        />
                                     </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Product Info & Farmer list */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-3xl">{t(cropDetails.name)}</CardTitle>
                                <CardDescription>{t(cropDetails.variety)}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                   {t('crop_description', { cropName: t(cropDetails.name), state: t(cropDetails.state)})}
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('compare_and_buy')}</CardTitle>
                                <CardDescription>{t('choose_from_farmers', { count: comparisonCrops.length.toString() })}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {comparisonCrops.map(crop => (
                                    <div key={crop.id} className="border p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between">
                                        <div className="flex gap-4">
                                            <Link href={`/profile?user=${crop.farmer.name}&role=farmer`} target="_blank">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={`https://picsum.photos/seed/${crop.farmer.name}/100`} alt={t(crop.farmer.name)} />
                                                    <AvatarFallback>{t(crop.farmer.name).charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </Link>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/profile?user=${crop.farmer.name}&role=farmer`} target="_blank" className="hover:underline">
                                                        <p className="font-semibold text-base flex items-center gap-1">{t(crop.farmer.name)} <ExternalLink className="h-3 w-3 text-muted-foreground" /></p>
                                                    </Link>
                                                    {crop.farmer.isTrusted && <ShieldCheck className="h-4 w-4 text-primary" />}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Star className="w-4 h-4 text-accent fill-accent" />
                                                    <span>{crop.rating}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                  <MapPin className="h-3 w-3" />
                                                  <span>{t(crop.city)}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {crop.isOrganic && <Badge variant="outline">{t('organic')}</Badge>}
                                                    <Badge variant="secondary">{t(crop.freshness.replace('-', '_'))}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-between sm:items-end gap-2 sm:max-w-xs w-full">
                                            <div className="sm:text-right">
                                                <h4 className="font-semibold text-lg">Rs. {crop.price}<span className="text-sm font-normal text-muted-foreground">/kg</span></h4>
                                                <p className="text-xs text-muted-foreground bg-secondary p-2 rounded-md mt-1 flex items-start gap-1">
                                                    <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                                    <span>{getPriceReason(basePrice, crop.price, t)}</span>
                                                </p>
                                            </div>

                                            <div className="flex gap-2 w-full">
                                               <Button variant="outline" className="w-full" onClick={() => handleBuyNow(crop)}>
                                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                                    {t('buy')}
                                                </Button>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" className="w-full" onClick={(e) => handleProtectedAction(() => {})}>
                                                          <MessageSquare className="mr-2 h-4 w-4" />
                                                          {t('chat')}
                                                        </Button>
                                                    </DialogTrigger>
                                                    {user && <ChatDialog crop={crop} />}
                                                </Dialog>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Add this to your page component
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ProductDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductDetailsPageContent />
        </Suspense>
    )
}
