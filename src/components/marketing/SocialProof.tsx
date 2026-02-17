import React from 'react';
import { Star } from 'lucide-react';

interface SocialProofProps {
    introLine?: string;
}

export function SocialProof({ introLine }: SocialProofProps) {
    return (
        <section className="py-24 bg-bg border-t border-border">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    {introLine && (
                        <p className="text-text-muted font-medium mb-4">{introLine}</p>
                    )}
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text">
                        Proven Clarity For Busy Homeowners.
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-surface p-8 rounded-2xl border border-border shadow-soft">
                        <div className="flex gap-1 text-primary mb-4">
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                        </div>
                        <p className="text-lg text-text-muted mb-6 italic">
                            “Full clarity in 3 days. Our contractor priced it immediately.”
                        </p>
                        <div className="font-semibold text-text">
                            — Sarah, Austin
                        </div>
                    </div>
                    <div className="bg-surface p-8 rounded-2xl border border-border shadow-soft">
                        <div className="flex gap-1 text-primary mb-4">
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                        </div>
                        <p className="text-lg text-text-muted mb-6 italic">
                            “We stopped debating and started building. The notes were instantly useful.”
                        </p>
                        <div className="font-semibold text-text">
                            — Mark, Chicago
                        </div>
                    </div>
                    <div className="bg-surface p-8 rounded-2xl border border-border shadow-soft">
                        <div className="flex gap-1 text-primary mb-4">
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                        </div>
                        <p className="text-lg text-text-muted mb-6 italic">
                            “Worth it. Saved us from a costly mistake before demo.”
                        </p>
                        <div className="font-semibold text-text">
                            — Emily, Denver
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-border pt-12">
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-text mb-2">500+</div>
                        <div className="text-sm text-text-muted">layouts delivered</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-text mb-2">4.9/5</div>
                        <div className="text-sm text-text-muted">average client rating</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-text mb-2">3-5</div>
                        <div className="text-sm text-text-muted">day average turnaround</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-text mb-2">99%</div>
                        <div className="text-sm text-text-muted">satisfied after revisions</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
