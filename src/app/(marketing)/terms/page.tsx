import Wrapper from "@/components/global/wrapper";
import Container from "@/components/global/container";
import { FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <Wrapper className="py-20">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col items-center text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Legal</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                            Terms and Conditions
                        </h1>
                        <p className="text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="prose prose-lg max-w-none">
                        <div className="bg-card border border-border rounded-2xl p-8 space-y-8">
                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">1. Acceptance of Terms</h2>
                                <p className="text-muted-foreground mb-4">
                                    By accessing and using Celio ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms and Conditions, please do not use the Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">2. Use License</h2>
                                <p className="text-muted-foreground mb-4">
                                    Permission is granted to temporarily use the Service for personal or commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                    <li>Modify or copy the Service materials</li>
                                    <li>Use the materials for any commercial purpose without proper licensing</li>
                                    <li>Attempt to decompile or reverse engineer any software contained in the Service</li>
                                    <li>Remove any copyright or other proprietary notations from the materials</li>
                                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">3. User Accounts</h2>
                                <p className="text-muted-foreground mb-4">
                                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                                </p>
                                <p className="text-muted-foreground mb-4">
                                    You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">4. AI-Generated Content</h2>
                                <p className="text-muted-foreground mb-4">
                                    Celio uses artificial intelligence to generate content and automate workflows. While we strive for accuracy, AI-generated content may occasionally contain errors or inaccuracies. You are responsible for reviewing and verifying all AI-generated content before use.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">5. Data and Integrations</h2>
                                <p className="text-muted-foreground mb-4">
                                    When you connect third-party services to Celio, you grant us permission to access and use data from those services as necessary to provide the Service. You are responsible for ensuring you have the necessary permissions and rights to share this data.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">6. Subscription and Billing</h2>
                                <p className="text-muted-foreground mb-4">
                                    Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Billing cycles are set on a monthly or annual basis, depending on the subscription plan you select.
                                </p>
                                <p className="text-muted-foreground mb-4">
                                    A valid payment method, including credit card, is required to process the payment for your subscription. You must provide accurate and complete billing information.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">7. Cancellation and Refunds</h2>
                                <p className="text-muted-foreground mb-4">
                                    You may cancel your subscription at any time through your account settings. Upon cancellation, you will retain access to the Service until the end of your current billing period.
                                </p>
                                <p className="text-muted-foreground mb-4">
                                    We offer a 14-day money-back guarantee. If you're not satisfied with the Service within 14 days of your initial purchase, contact us for a full refund.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">8. Prohibited Uses</h2>
                                <p className="text-muted-foreground mb-4">
                                    You may not use the Service:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                    <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                                    <li>To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                                    <li>To submit false or misleading information</li>
                                    <li>To upload or transmit viruses or any other type of malicious code</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">9. Limitation of Liability</h2>
                                <p className="text-muted-foreground mb-4">
                                    In no event shall Celio or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">10. Changes to Terms</h2>
                                <p className="text-muted-foreground mb-4">
                                    We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">11. Contact Us</h2>
                                <p className="text-muted-foreground">
                                    If you have any questions about these Terms, please contact us at{' '}
                                    <a href="mailto:legal@celio.ai" className="text-primary hover:underline">
                                        legal@celio.ai
                                    </a>
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </Container>
        </Wrapper>
    );
}

