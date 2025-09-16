
"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Microscope, Leaf, AlertTriangle, ShieldCheck, Stethoscope, MessageSquare } from "lucide-react";
import Image from "next/image";
import { detectCropDisease, type DetectCropDiseaseOutput } from "@/ai/flows/crop-disease-detection";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/context/language-context";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { CropDoctorChatDialog } from "@/components/chat/crop-doctor-chat-dialog";

// Add this to your page component
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function CropDoctorPage() {
  const { t, language } = useLanguage();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [result, setResult] = useState<DetectCropDiseaseOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null); // Reset result when new image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      toast({
        variant: "destructive",
        title: t('no_image_selected'),
        description: t('no_image_selected_desc'),
      });
      return;
    }
    setLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = async () => {
        const photoDataUri = reader.result as string;
        try {
            const diagnosis = await detectCropDisease({ photoDataUri, language });
            setResult(diagnosis);
            if (diagnosis.diseaseDetected) {
              setChatOpen(true); // Automatically open chat if disease is detected
            }
        } catch (error: any) {
            console.error("Error detecting crop disease:", error);
            const errorMessage = error.message && error.message.includes('503') 
                ? "The AI model is currently overloaded. Please try again in a moment."
                : t('analysis_failed_desc');
            toast({
                variant: "destructive",
                title: t('analysis_failed'),
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    }
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                <Stethoscope className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>{t('ai_crop_doctor')}</CardTitle>
              <CardDescription>
                {t('ai_crop_doctor_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div 
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-card"
                    onClick={handleDropzoneClick}
                >
                    {imagePreview ? (
                         <Image src={imagePreview} alt={t('crop_preview')} width={200} height={200} className="max-h-full w-auto object-contain rounded-md" />
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                            <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">{t('click_to_upload')}</span> {t('drag_and_drop')}</p>
                            <p className="text-xs text-muted-foreground">{t('image_formats')}</p>
                        </div>
                    )}
                    <input ref={fileInputRef} id="dropzone-file" type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" onChange={handleFileChange} />
                </div>

                <Button onClick={handleAnalyze} disabled={loading || !imageFile} className="w-full">
                    <Microscope className="mr-2 h-4 w-4" />
                    {loading ? t('analyzing') : t('analyze_crop')}
                </Button>

                {loading && (
                    <div className="space-y-2">
                        <Progress value={undefined} className="w-full animate-pulse" />
                        <p className="text-center text-sm text-muted-foreground">{t('ai_examining')}</p>
                    </div>
                )}

                {result && (
                  <Dialog open={isChatOpen} onOpenChange={setChatOpen}>
                    <Card className="bg-secondary">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                {result.diseaseDetected ? <AlertTriangle className="text-destructive" /> : <ShieldCheck className="text-primary" />}
                                {t('diagnosis_result')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {result.diseaseDetected ? (
                                <div className="space-y-4">
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4"/>
                                        <AlertTitle className="text-base">{t('disease_detected')}</AlertTitle>
                                    </Alert>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">{t('disease_name')}</p>
                                            <p className="font-semibold text-lg">{result.diseaseName}</p>
                                        </div>
                                         <div className="space-y-1">
                                            <p className="text-sm font-medium">{t('confidence_score')}</p>
                                            <div className="flex items-center gap-2">
                                                <Progress value={result.confidence * 100} className="w-full" />
                                                <Badge>{(result.confidence * 100).toFixed(0)}%</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-sm font-medium mb-2">{t('suggested_actions')}</p>
                                        <p className="text-muted-foreground p-3 bg-background rounded-md whitespace-pre-wrap">{result.suggestedActions}</p>
                                    </div>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" className="w-full">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Ask Follow-up Questions
                                      </Button>
                                    </DialogTrigger>
                                </div>
                           ) : (
                                <Alert>
                                    <ShieldCheck className="h-4 w-4"/>
                                    <AlertTitle className="text-base">{t('plant_healthy')}</AlertTitle>
                                    <AlertDescription>
                                        {t('plant_healthy_desc')}
                                    </AlertDescription>
                                </Alert>
                           )}
                        </CardContent>
                    </Card>
                    {result.diseaseDetected && (
                      <CropDoctorChatDialog diagnosis={result} />
                    )}
                  </Dialog>
                )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
