import "@/styles/globals.css";
import { cn } from "@/lib";
import { base, heading, subheading } from "@/constants";
import DashboardSidebar from "@/components/dashboard/sidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={cn(
            "min-h-screen bg-background text-foreground antialiased",
            base.variable,
            heading.variable,
            subheading.variable,
        )}>
            <div className="flex h-screen overflow-hidden">
                <DashboardSidebar />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

