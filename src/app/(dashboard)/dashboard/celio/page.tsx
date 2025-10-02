import ChatTab from "@/components/dashboard/tabs/chat-tab";

export const dynamic = 'force-dynamic';

export default function CelioPage() {
    return (
        <div className="h-full">
            <ChatTab />
        </div>
    );
}

