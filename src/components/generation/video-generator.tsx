'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCredits } from '@/hooks/use-credits';
import { InsufficientCreditsModal } from '@/components/credits/insufficient-credits-modal';
import { CreditsDisplay } from '@/components/credits/credits-display';
import { Loader2, Video, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

export function VideoGenerator() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);

    const { user } = useUser();
    const { canAfford, getCreditCostForAction } = useCredits();

    const requiredCredits = getCreditCostForAction('VIDEO_GENERATION');

    const handleGenerate = async () => {
        if (!user) {
            toast.error('Please sign in to generate videos');
            return;
        }

        if (!prompt.trim()) {
            toast.error('Please enter a prompt');
            return;
        }

        // Check if user has sufficient credits
        if (!canAfford('VIDEO_GENERATION')) {
            setShowInsufficientCredits(true);
            return;
        }

        setLoading(true);
        try {
            // Call the API endpoint to generate video
            const response = await fetch('/api/generate-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt.trim(),
                    userId: user.id,
                    inputStorageId: null, // For text-to-video generation
                    duration: '5',
                    negative_prompt: 'blur, distort, and low quality',
                    cfg_scale: 0.5,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 402) {
                    // Insufficient credits
                    setShowInsufficientCredits(true);
                    return;
                }
                throw new Error(data.error || 'Failed to generate video');
            }

            toast.success(`Video generation started! ${data.creditsDeducted} credits deducted. ${data.remainingCredits} credits remaining.`);
            setPrompt('');

        } catch (error: any) {
            console.error('Video generation error:', error);
            if (error.message.includes('Insufficient credits')) {
                setShowInsufficientCredits(true);
            } else {
                toast.error(error.message || 'Failed to start video generation');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start gap-4">
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Video className="h-5 w-5" />
                            Video Generator
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Input
                                placeholder="Describe the video you want to generate..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerate()}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <span>Costs {requiredCredits} credits</span>
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={loading || !prompt.trim()}
                                className="min-w-[120px]"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate Video
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <CreditsDisplay className="w-64" />
            </div>

            <InsufficientCreditsModal
                open={showInsufficientCredits}
                onOpenChange={setShowInsufficientCredits}
                requiredCredits={requiredCredits}
                action="video generation"
            />
        </div>
    );
}