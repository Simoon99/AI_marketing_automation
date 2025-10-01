"use client";

import Link from "next/link";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib";
import { POWER_UPS, PowerUp } from "@/constants/powerups";

export default function PowerUpsTab() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold">Power Ups</h2>
                <p className="text-muted-foreground mt-2">
                    Supercharge your marketing with AI-powered tools and features
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {POWER_UPS.map((powerUp) => (
                    <PowerUpCard key={powerUp.id} powerUp={powerUp} />
                ))}
            </div>
        </div>
    );
}

function PowerUpCard({ powerUp }: { powerUp: PowerUp }) {
    const Icon = powerUp.icon;

    return (
        <Link href={`/dashboard/powerups/${powerUp.id}`}>
            <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 border-border bg-card cursor-pointer">
                {/* Gradient background on hover */}
                <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br",
                    powerUp.gradient
                )}></div>

                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className={cn(
                            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                            powerUp.gradient
                        )}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex gap-2">
                            {powerUp.isPopular && (
                                <Badge variant="secondary" className="text-xs">
                                    Popular
                                </Badge>
                            )}
                            {powerUp.isNew && (
                                <Badge className="text-xs bg-blue-600 hover:bg-blue-700">
                                    New
                                </Badge>
                            )}
                        </div>
                    </div>
                    <CardTitle className="mt-4">{powerUp.name}</CardTitle>
                    <CardDescription className="text-sm">
                        {powerUp.description}
                    </CardDescription>
                </CardHeader>

                <CardFooter className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{powerUp.category}</span>
                    <Button size="sm" variant="ghost" className="group-hover:bg-secondary">
                        Open
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    );
}

