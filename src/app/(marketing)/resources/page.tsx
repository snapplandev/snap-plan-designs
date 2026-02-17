import { ExternalLink, ShieldCheck, Flame, BookOpen, Wind } from "lucide-react";

export default function ResourcesPage() {
    const resources = [
        {
            title: "U.S. DOE Energy Saver — Insulation, air sealing, HVAC",
            description: "Official guide for energy efficient basement finishing.",
            url: "https://www.energy.gov/energysaver/energy-saver",
            icon: Wind
        },
        {
            title: "EPA — Moisture and Mold Guide",
            description: "Essential reading for preventing moisture issues in basements.",
            url: "https://www.epa.gov/mold",
            icon: ShieldCheck
        },
        {
            title: "ICC Codes Portal — IRC access (egress, stairs)",
            description: "Access the International Residential Code for compliance.",
            url: "https://codes.iccsafe.org/",
            icon: BookOpen
        },
        {
            title: "NFPA — Electrical and fire safety",
            description: "National Fire Protection Association standards.",
            url: "https://www.nfpa.org/",
            icon: Flame
        }
    ];

    return (
        <>
            <section className="relative w-full py-20 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                        Helpful External Resources
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        Authoritative references many homeowners use during planning.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-white dark:bg-black">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                        {resources.map((resource, index) => (
                            <a
                                key={index}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-[#d4af37] transition-all bg-zinc-50 dark:bg-zinc-900 group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <resource.icon className="w-8 h-8 text-[#d4af37]" />
                                    <ExternalLink className="w-5 h-5 text-zinc-400 group-hover:text-[#d4af37] transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                                    {resource.title}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {resource.description}
                                </p>
                                <span className="mt-auto pt-6 text-sm font-medium text-zinc-500 truncate group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">
                                    {resource.url}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
