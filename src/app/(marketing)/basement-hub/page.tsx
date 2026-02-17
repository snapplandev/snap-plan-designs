import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, PlayCircle, Hammer } from "lucide-react";

export default function BasementHubPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative w-full overflow-hidden py-24 md:py-32 bg-black text-white">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div
                        className="h-full w-full opacity-50"
                        style={{ background: "radial-gradient(ellipse at center, #1a237e, #000000)" }}
                    />
                </div>
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Complete Basement Finishing Hub
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
                        Plan, design, and finish your basement with pro resources: free calculator, custom layout plans, and clear step-by-step tutorials to help you save money and avoid costly mistakes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/pricing">
                            <Button
                                size="lg"
                                className="bg-[#d4af37] text-black hover:bg-[#d4af37]/90 font-bold text-lg px-8 h-14 rounded-full w-full sm:w-auto"
                            >
                                Start My Custom Layout
                            </Button>
                        </Link>
                        <Link href="/calculator">
                            <Button
                                size="lg"
                                className="bg-[#d4af37] text-black hover:bg-[#d4af37]/90 font-bold text-lg px-8 h-14 rounded-full w-full sm:w-auto"
                            >
                                Calculate My Cost
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main Content Links */}
            <section className="py-24 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                        {/* Quick Start */}
                        <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-black p-8 rounded-2xl border border-blue-600 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                <PlayCircle className="w-6 h-6 text-blue-600" /> Quick Start
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-2xl">
                                Three fast ways to move your project forward today: Get a custom layout, estimate costs, or jump into tutorials.
                            </p>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <Link href="/pricing" className="block">
                                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 transition-colors cursor-pointer h-full">
                                        <h4 className="font-bold text-zinc-900 dark:text-white mb-2">Custom Layout Plans</h4>
                                        <p className="text-sm text-zinc-500">Professional layouts tailored to your basement.</p>
                                    </div>
                                </Link>
                                <Link href="/calculator" className="block">
                                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 transition-colors cursor-pointer h-full">
                                        <h4 className="font-bold text-zinc-900 dark:text-white mb-2">Free Cost Calculator</h4>
                                        <p className="text-sm text-zinc-500">Estimate materials and labor in minutes.</p>
                                    </div>
                                </Link>
                                <Link href="#tutorials" className="block">
                                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 transition-colors cursor-pointer h-full">
                                        <h4 className="font-bold text-zinc-900 dark:text-white mb-2">DIY Tutorials</h4>
                                        <p className="text-sm text-zinc-500">Step-by-step lessons from planning to finish.</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Complete DIY Tutorials */}
                        <div id="tutorials" className="bg-white dark:bg-black p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                <Hammer className="w-5 h-5 text-[#d4af37]" /> Complete DIY Tutorials
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
                                High-impact how-tos you can add to any plan.
                            </p>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="#" className="flex items-center justify-between text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 group">
                                        <span className="text-sm font-medium">Framing & Soffits</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="flex items-center justify-between text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 group">
                                        <span className="text-sm font-medium">Plumbing Prep</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="flex items-center justify-between text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 group">
                                        <span className="text-sm font-medium">Electrical Rough-in</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Video Tutorials */}
                        <div className="bg-white dark:bg-black p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-[#d4af37]" /> Video Tutorials
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
                                Watch pro techniques in action.
                            </p>
                            <Button variant="tertiary" className="w-full">
                                <Link href="https://youtube.com">Visit YouTube Channel</Link>
                            </Button>
                        </div>

                        {/* External Resources */}
                        <div className="bg-white dark:bg-black p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#d4af37]" /> Helpful Resources
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
                                Codes, guides, and official documentation.
                            </p>
                            <Button variant="tertiary" className="w-full">
                                <Link href="/resources">View Resource Library</Link>
                            </Button>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
