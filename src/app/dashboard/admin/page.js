import AdminSectionOverview from './components/AdminSectionOverview';

export default function AdminDashboardPage() {
    return (
        <div className="px-6 py-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Quick overview and shortcuts to key admin areas.
                </p>
            </div>

            {/* High-level overview of Conversations, Users, and Billing */}
            <AdminSectionOverview />
        </div>
    );
}
