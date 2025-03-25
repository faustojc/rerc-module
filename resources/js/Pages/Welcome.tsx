import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import {
    ArrowRight,
    Check,
    ClockRotateRight,
    Dashboard,
    DocumentAdd,
    DocumentCheckOutline,
    IconMessage,
    QuillInfo,
    ShieldCheckLine,
    UserAlt,
} from "@/Components/Icons";
import { FeatureCard } from "@/Components/FeatureCard";
import { ProcessStep } from "@/Components/ProcessStep";

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Research Ethics" />
            <div className="min-h-screen bg-background">
                <Navbar maxWidth="xl" className="bg-background/70 backdrop-blur-sm">
                    <NavbarBrand>
                        <ShieldCheckLine className="w-8 h-8 text-primary-500" />
                        <p className="font-bold text-inherit ml-2">RERC System</p>
                    </NavbarBrand>
                    <NavbarContent justify="end">
                        {!auth.user ? (
                            <>
                                <NavbarItem>
                                    <Button
                                        as={Link}
                                        color="primary"
                                        href={route('login')}
                                        variant="flat"
                                    >
                                        Sign In
                                    </Button>
                                </NavbarItem>
                                <NavbarItem>
                                    <Button
                                        as={Link}
                                        color="primary"
                                        href={route('login')}
                                        variant="flat"
                                    >
                                        Sign Up
                                    </Button>
                                </NavbarItem>
                            </>
                        ) : (
                            <NavbarItem>
                                <Button
                                    as={Link}
                                    color="primary"
                                    href={route('dashboard')}
                                    variant="flat"
                                    startContent={<Dashboard />}
                                >
                                    Dashboard
                                </Button>
                            </NavbarItem>
                        )}
                    </NavbarContent>
                </Navbar>

                <main className="container mx-auto px-6 py-16 max-w-7xl">
                    {/* Hero Section */}
                    <section className="flex flex-col items-center text-center gap-6 mb-20">
                        <h1 className="text-4xl lg:text-6xl font-bold">
                            Research Ethics Review Committee
                        </h1>
                        <p className="text-xl text-default-600 max-w-2xl">
                            Streamline your research ethics approval process with our comprehensive online system
                        </p>
                        <div className="flex gap-4">
                            <Button
                                color="primary"
                                size="lg"
                                startContent={<DocumentAdd />}
                            >
                                Submit Application
                            </Button>
                            <Button
                                variant="bordered"
                                size="lg"
                                startContent={<QuillInfo />}
                            >
                                Learn More
                            </Button>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FeatureCard
                                icon={<Check className="w-6 h-6 text-primary-500" />}
                                title="Streamlined Applications"
                                description="Easy-to-use interface for submitting and tracking research ethics applications"
                            />
                            <FeatureCard
                                icon={<UserAlt className="w-6 h-6 text-primary-500" />}
                                title="Collaborative Review"
                                description="Efficient communication between researchers and review committee members"
                            />
                            <FeatureCard
                                icon={<ClockRotateRight className="w-6 h-6 text-primary-500" />}
                                title="Real-time Updates"
                                description="Track your application status and receive timely notifications"
                            />
                            <FeatureCard
                                icon={<ShieldCheckLine className="w-6 h-6 text-primary-500" />}
                                title="Secure Documentation"
                                description="Safe storage and handling of all research-related documents"
                            />
                            <FeatureCard
                                icon={<IconMessage className="w-6 h-6 text-primary-500" />}
                                title="Integrated Messaging"
                                description="Direct communication channel with the ethics committee"
                            />
                            <FeatureCard
                                icon={<DocumentCheckOutline className="w-6 h-6 text-primary-500" />}
                                title="Ethics Clearance"
                                description="Digital issuance and management of ethics clearance certificates"
                            />
                        </div>
                    </section>

                    {/* Process Section */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-bold text-center mb-12">Application Process</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <ProcessStep
                                number={1}
                                title="Submit Application"
                                description="Complete the online application form and upload required documents"
                            />
                            <ProcessStep
                                number={2}
                                title="Initial Review"
                                description="Committee performs preliminary assessment of your application"
                            />
                            <ProcessStep
                                number={3}
                                title="Committee Review"
                                description="Detailed evaluation by the ethics review committee"
                            />
                            <ProcessStep
                                number={4}
                                title="Decision & Clearance"
                                description="Receive committee decision and ethics clearance if approved"
                            />
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="text-center bg-primary-50 rounded-2xl p-12">
                        <h2 className="text-3xl font-bold mb-6">Ready to Submit Your Application?</h2>
                        <p className="text-default-600 mb-8 max-w-2xl mx-auto">
                            Join hundreds of researchers who have successfully obtained ethics clearance through our system
                        </p>
                        <Button
                            color="primary"
                            size="lg"
                            startContent={<ArrowRight />}
                        >
                            Get Started
                        </Button>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-divider py-12 mt-20">
                    <div className="container mx-auto px-6 text-center text-default-500">
                        <p>© {new Date().getFullYear()} Research Ethics Review Committee. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
