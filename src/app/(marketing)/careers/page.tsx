import Wrapper from "@/components/global/wrapper";
import Container from "@/components/global/container";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { Briefcase, MapPin, Clock, ArrowRight, Users, Sparkles, Rocket } from "lucide-react";

const JOB_OPENINGS = [
    {
        id: "fullstack-senior",
        title: "Senior Full Stack Engineer",
        department: "Engineering",
        location: "Remote (Global)",
        type: "Full-time",
        description: "We're looking for an experienced full-stack engineer to help build and scale our AI-powered platform. You'll work on both frontend (Next.js, React) and backend (Node.js, Python) systems.",
        requirements: [
            "5+ years of professional software development experience",
            "Strong proficiency in TypeScript, React, and Next.js",
            "Experience with Node.js, Python, and RESTful APIs",
            "Familiarity with cloud platforms (AWS, GCP, or Azure)",
            "Experience with databases (PostgreSQL, Redis)",
            "Understanding of AI/ML concepts is a plus",
        ],
        responsibilities: [
            "Build and maintain core platform features",
            "Design and implement scalable backend services",
            "Collaborate with designers to create beautiful UIs",
            "Optimize application performance and reliability",
            "Mentor junior engineers and conduct code reviews",
        ],
    },
    {
        id: "backend-engineer",
        title: "Backend Engineer",
        department: "Engineering",
        location: "Remote (Global)",
        type: "Full-time",
        description: "Join our backend team to build robust, scalable systems that power AI agents and automation workflows for thousands of users.",
        requirements: [
            "3+ years of backend development experience",
            "Strong proficiency in Python or Node.js",
            "Experience with PostgreSQL and database design",
            "Understanding of RESTful APIs and microservices",
            "Experience with Docker and containerization",
            "Familiarity with message queues (RabbitMQ, Redis)",
        ],
        responsibilities: [
            "Design and implement backend services and APIs",
            "Build scalable data processing pipelines",
            "Optimize database queries and system performance",
            "Implement authentication and security features",
            "Write comprehensive tests and documentation",
        ],
    },
];

const BENEFITS = [
    {
        icon: Rocket,
        title: "Fast-Growing Startup",
        description: "Be part of the AI revolution with a team that moves fast and ships often",
    },
    {
        icon: Users,
        title: "Remote-First Culture",
        description: "Work from anywhere in the world with flexible hours",
    },
    {
        icon: Sparkles,
        title: "Competitive Compensation",
        description: "Generous salary, equity, and benefits package",
    },
];

export default function CareersPage() {
    return (
        <Wrapper className="py-20">
            {/* Hero Section */}
            <Container>
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
                    <button className="group relative grid overflow-hidden rounded-full px-2 py-1 shadow-[0_1000px_0_0_hsl(0_0%_15%)_inset] transition-colors duration-200 mx-auto mb-6">
                        <span>
                            <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
                        </span>
                        <span className="backdrop absolute inset-[1px] rounded-full bg-background transition-colors duration-200 group-hover:bg-neutral-800" />
                        <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" />
                            Join Our Team
                        </span>
                    </button>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold !leading-tight mb-6">
                        Build the Future of <br />
                        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            AI-Powered Work
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
                        Join a small, ambitious team building the AI workforce platform that empowers solo founders and small teams to compete with billion-dollar companies.
                    </p>
                </div>
            </Container>

            {/* Benefits */}
            <Container className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {BENEFITS.map((benefit, index) => (
                        <MagicCard
                            key={index}
                            gradientFrom="#6366f1"
                            gradientTo="#ec4899"
                            gradientColor="rgba(99,102,241,0.1)"
                            className="p-6 rounded-2xl"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center mb-4">
                                <benefit.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </MagicCard>
                    ))}
                </div>
            </Container>

            {/* Open Positions */}
            <Container>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center">
                    Open Positions
                </h2>

                <div className="space-y-6 max-w-4xl mx-auto">
                    {JOB_OPENINGS.map((job) => (
                        <div key={job.id} className="bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/50 transition-all">
                            {/* Job Header */}
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <Briefcase className="w-4 h-4" />
                                            {job.department}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {job.type}
                                        </span>
                                    </div>
                                </div>
                                <a href="mailto:managercelio.ai@gmail.com?subject=Application for ${job.title}&body=Hi Celio Team,%0D%0A%0D%0AI'm interested in applying for the ${job.title} position.%0D%0A%0D%0A">
                                    <Button className="rounded-full whitespace-nowrap gap-2">
                                        Apply Now
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </a>
                            </div>

                            {/* Job Description */}
                            <p className="text-muted-foreground mb-6">
                                {job.description}
                            </p>

                            {/* Requirements */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3">Requirements:</h4>
                                <ul className="space-y-2">
                                    {job.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="text-primary mt-0.5">•</span>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Responsibilities */}
                            <div>
                                <h4 className="font-semibold mb-3">Responsibilities:</h4>
                                <ul className="space-y-2">
                                    {job.responsibilities.map((resp, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="text-primary mt-0.5">•</span>
                                            {resp}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>

            {/* CTA Section */}
            <Container className="mt-16">
                <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                        Don't See Your Role?
                    </h2>
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                        We're always looking for talented people. Send us your resume and let us know how you can contribute!
                    </p>
                    <a href="mailto:managercelio.ai@gmail.com?subject=General Application&body=Hi Celio Team,%0D%0A%0D%0AI'd love to join your team!%0D%0A%0D%0A">
                        <Button variant="secondary" size="lg" className="gap-2 rounded-full">
                            Get in Touch
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </a>
                </div>
            </Container>
        </Wrapper>
    );
}

