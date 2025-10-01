import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { POWER_UPS } from "@/constants/powerups";
import { cn } from "@/lib";

export default async function PowerUpDetailPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    const { id } = await params;
    const powerUp = POWER_UPS.find(p => p.id === id);

    if (!powerUp) {
        notFound();
    }

    const Icon = powerUp.icon;

    return (
        <div className="h-full p-6 space-y-6">
            {/* Back button */}
            <Link href="/dashboard/powerups">
                <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Power Ups
                </Button>
            </Link>

            {/* Header */}
            <div className="flex items-start gap-6">
                <div className={cn(
                    "w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                    powerUp.gradient
                )}>
                    <Icon className="w-10 h-10 text-white" />
                </div>
                
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">{powerUp.name}</h1>
                        {powerUp.isPopular && (
                            <Badge variant="secondary">Popular</Badge>
                        )}
                        {powerUp.isNew && (
                            <Badge className="bg-blue-600 hover:bg-blue-700">New</Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground text-lg">{powerUp.description}</p>
                    <p className="text-sm text-muted-foreground mt-2">Category: {powerUp.category}</p>
                </div>
            </div>

            {/* Content Area */}
            <div className="border border-border rounded-xl p-8">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-secondary/50 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Coming Soon</h3>
                        <p className="text-muted-foreground">
                            This Power Up is currently under development. We&apos;re working hard to bring you amazing AI-powered marketing tools.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button size="lg" disabled>
                            Activate Power Up
                        </Button>
                    </div>

                    <div className="pt-8 space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            What to expect
                        </h4>
                        <div className="grid gap-4 md:grid-cols-3 text-sm">
                            <div className="p-4 rounded-lg bg-secondary/30">
                                <p className="font-medium mb-1">AI-Powered</p>
                                <p className="text-muted-foreground text-xs">
                                    Advanced AI algorithms to automate your work
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/30">
                                <p className="font-medium mb-1">Easy to Use</p>
                                <p className="text-muted-foreground text-xs">
                                    Intuitive interface designed for marketers
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/30">
                                <p className="font-medium mb-1">Real-time Results</p>
                                <p className="text-muted-foreground text-xs">
                                    See results instantly as you work
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

