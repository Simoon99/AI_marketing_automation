import AgentsTab from "@/components/dashboard/tabs/agents-tab";

export const dynamic = 'force-dynamic';

export default function AgentsPage() {
    return (
        <div className="h-full p-6">
            <AgentsTab />
        </div>
    );
}

