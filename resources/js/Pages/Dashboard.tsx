import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={"Dashboard"}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="overflow-hidden bg-default shadow-sm sm:rounded-lg">
                    <div className="p-6 text-default-900">
                        You're logged in!
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
