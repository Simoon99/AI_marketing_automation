"use client";

import Footer from "@/components/marketing/footer";
import Navbar from "@/components/marketing/navbar";
import { usePathname } from "next/navigation";
import React from 'react';

interface Props {
    children: React.ReactNode
}

const MarketingLayout = ({ children }: Props) => {
    const pathname = usePathname();
    const isPricingPage = pathname === '/pricing';

    return (
        <>
            <Navbar sticky={!isPricingPage} />
            <main className="mx-auto w-full z-40 relative">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default MarketingLayout
