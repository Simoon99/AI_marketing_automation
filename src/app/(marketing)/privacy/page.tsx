import Wrapper from "@/components/global/wrapper";
import Container from "@/components/global/container";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
    return (
        <Wrapper className="py-20">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col items-center text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <Shield className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Privacy & Security</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="prose prose-lg max-w-none">
                        <div className="bg-card border border-border rounded-2xl p-8 space-y-8">
                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">1. Introduction</h2>
                                <p className="text-muted-foreground mb-4">
                                    At Celio, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. Please read this privacy policy carefully.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">2. Information We Collect</h2>
                                <p className="text-muted-foreground mb-4">
                                    We collect information that you provide directly to us when you:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                    <li>Create an account</li>
                                    <li>Use our services</li>
                                    <li>Connect third-party integrations</li>
                                    <li>Contact customer support</li>
                                    <li>Subscribe to our newsletter or marketing communications</li>
                                </ul>
                                <p className="text-muted-foreground mt-4">
                                    This information may include: name, email address, company name, payment information, and any data you provide through the Service or integrations.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">3. How We Use Your Information</h2>
                                <p className="text-muted-foreground mb-4">
                                    We use the information we collect to:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                    <li>Provide, maintain, and improve our Service</li>
                                    <li>Process transactions and send related information</li>
                                    <li>Send you technical notices, updates, security alerts, and support messages</li>
                                    <li>Respond to your comments, questions, and customer service requests</li>
                                    <li>Communicate with you about products, services, offers, and events</li>
                                    <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
                                    <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">4. AI and Data Processing</h2>
                                <p className="text-muted-foreground mb-4">
                                    Celio uses artificial intelligence to provide its services. When you use our AI features:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                    <li>Your prompts and inputs may be processed by third-party AI services (e.g., OpenAI)</li>
                                    <li>We do not use your data to train AI models unless you explicitly opt-in</li>
                                    <li>AI-generated content is provided as-is and should be reviewed before use</li>
                                    <li>You retain ownership of your data and AI-generated outputs</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">5. Third-Party Integrations</h2>
                                <p className="text-muted-foreground mb-4">
                                    When you connect third-party services (like Gmail, Slack, or Shopify) to Celio:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                    <li>We only access data necessary to provide the requested functionality</li>
                                    <li>Your credentials are encrypted and stored securely</li>
                                    <li>You can revoke access at any time through your account settings</li>
                                    <li>Third-party services have their own privacy policies that govern their use</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">6. Data Storage and Security</h2>
                                <p className="text-muted-foreground mb-4">
                                    We implement appropriate technical and organizational measures to protect your personal information:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                    <li>All data is encrypted in transit using SSL/TLS</li>
                                    <li>Sensitive data is encrypted at rest</li>
                                    <li>We use Supabase for secure database hosting</li>
                                    <li>Access to your data is restricted to authorized personnel only</li>
                                    <li>We regularly review and update our security practices</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">7. Data Retention</h2>
                                <p className="text-muted-foreground mb-4">
                                    We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your account and data at any time by contacting us.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">8. Your Rights</h2>
                                <p className="text-muted-foreground mb-4">
                                    Depending on your location, you may have certain rights regarding your personal information:
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                    <li>Access: Request a copy of your personal information</li>
                                    <li>Correction: Request correction of inaccurate information</li>
                                    <li>Deletion: Request deletion of your personal information</li>
                                    <li>Portability: Request transfer of your data to another service</li>
                                    <li>Opt-out: Unsubscribe from marketing communications</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">9. Cookies and Tracking</h2>
                                <p className="text-muted-foreground mb-4">
                                    We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">10. Children's Privacy</h2>
                                <p className="text-muted-foreground mb-4">
                                    Our Service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">11. International Data Transfers</h2>
                                <p className="text-muted-foreground mb-4">
                                    Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">12. Changes to This Policy</h2>
                                <p className="text-muted-foreground mb-4">
                                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-heading font-bold mb-4">13. Contact Us</h2>
                                <p className="text-muted-foreground">
                                    If you have any questions about this Privacy Policy, please contact us at{' '}
                                    <a href="mailto:privacy@celio.ai" className="text-primary hover:underline">
                                        privacy@celio.ai
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

