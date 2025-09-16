

"use client";

import { useEffect, useState, useRef } from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send, Phone, MessageSquare, Mic, StopCircle } from "lucide-react";
import { chatWithFarmer } from "@/ai/flows/farmer-chat-flow";
import { textToSpeech } from "@/ai/flows/text-to-speech.ts";
import { useLanguage } from "@/context/language-context";

// Add this to your page component
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function GeneralChatDialog({ userName, userRole }: { userName: string, userRole: string }) {
    const { toast } = useToast();
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    
    const initialQuickReplies = [
        t('chat_qr_quality'),
        t('chat_qr_other_crops'),
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
                farmerName: userName,
                message: message,
                history: messages,
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
                : "Could not get a response. The user might be busy. Please try again later.";
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
            title: `Connecting you with ${userName}...`,
            description: `The ${method} feature is coming soon!`,
        });
    };

    return (
        <DialogContent className="max-w-2xl w-full h-[80vh] flex flex-col p-0">
            <audio ref={audioRef} className="hidden" />
            <DialogHeader className="p-4 border-b">
                 <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={`https://picsum.photos/seed/${userName}/100`} alt={userName} />
                        <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <DialogTitle>{t('chat_with_user_title', { userName: t(userName) })}</DialogTitle>
                        <DialogDescription>{t('general_chat_description', { userName: t(userName), userRole: t(userRole) })}</DialogDescription>
                    </div>
                </div>
            </DialogHeader>
            <div className="flex flex-col flex-1 bg-muted/50 overflow-hidden">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.length === 0 && (
                             <div className="flex gap-2.5 justify-start">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={`https://picsum.photos/seed/${userName}/100`} alt={userName} />
                                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="max-w-[75%] p-3 rounded-lg rounded-tl-none bg-background shadow-sm">
                                    <p className="text-sm">{t('general_chat_greeting', { userName: t(userName) })}</p>
                                </div>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex gap-2.5 items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                 {msg.role === 'model' && (
                                     <Avatar className="w-8 h-8">
                                         <AvatarImage src={`https://picsum.photos/seed/${userName}/100`} alt={userName} />
                                         <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
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
                                     <AvatarImage src={`https://picsum.photos/seed/${userName}/100`} alt={userName} />
                                     <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
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
