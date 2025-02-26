/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

// Function to generate metadata for the page
export async function generateMetadata() {
  return {
    title: "Contact Me | Get in Touch",
    description: "Connect with me for collaborations, questions, or just to say hello",
  };
}

// Social Link Component
function SocialLink({ name, url, icon }: { name: string; url: string; icon: string }) {
  return (
    <Link href={url} className="flex items-center gap-3 p-4 border border-secondary/10 rounded-lg hover:bg-secondary/5 transition-colors">
      <div className="text-2xl text-accent">{icon}</div>
      <span className="font-geologica text-secondary">{name}</span>
    </Link>
  );
}

// FAQ Component
function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="mb-4 border-b border-secondary/10 pb-4 last:border-0">
      <h3 className="font-prosto text-lg text-secondary mb-2">{question}</h3>
      <p className="text-secondary/80 font-geologica text-sm">{answer}</p>
    </div>
  );
}

// Main contact page component
export default function ContactPage() {
  // Static data for social links
  const socialLinks = [
    { id: 1, name: "Twitter", url: "https://twitter.com", icon: "🐦" },
    { id: 2, name: "GitHub", url: "https://github.com", icon: "👨‍💻" },
    { id: 3, name: "LinkedIn", url: "https://linkedin.com", icon: "💼" },
    { id: 4, name: "Instagram", url: "https://instagram.com", icon: "📷" },
  ];

  // Static data for FAQs
  const faqs = [
    {
      id: 1,
      question: "What services do you offer?",
      answer: "I offer web design and development services, focusing on creating responsive, user-friendly websites and applications. I specialize in front-end development using React, Next.js, and modern CSS techniques.",
    },
    {
      id: 2,
      question: "Are you available for freelance work?",
      answer: "Yes, I'm open to freelance opportunities that align with my skills and interests. I prefer projects that involve creative problem-solving and offer room for innovation.",
    },
    {
      id: 3,
      question: "How quickly do you respond to inquiries?",
      answer: "I typically respond to all messages within 1-2 business days. For urgent matters, please indicate so in your message subject line.",
    },
    {
      id: 4,
      question: "Do you offer mentoring or tutoring?",
      answer: "I occasionally take on mentoring relationships with aspiring developers. If you're interested, please mention your goals and current skill level when you reach out.",
    },
  ];

  return (
    <main className="bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        {/* Page Header */}
        <header className="mb-16 text-center">
          <h1 className="font-prosto text-4xl md:text-5xl text-secondary font-normal mb-6">Contact Me</h1>
          <p className="font-geologica text-secondary/80 max-w-2xl mx-auto">Have a question, project idea, or just want to say hello? I&apos;d love to hear from you!</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main content - Left side */}
          <div className="lg:w-2/3">
            {/* Contact Form Section */}
            <section className="mb-16">
              <h2 className="font-prosto text-2xl text-secondary mb-6 pb-3 border-b border-secondary/10">Get in Touch</h2>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-geologica text-secondary mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 bg-secondary/5 border border-secondary/20 rounded-md text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-geologica text-secondary mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 bg-secondary/5 border border-secondary/20 rounded-md text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-geologica text-secondary mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 bg-secondary/5 border border-secondary/20 rounded-md text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-geologica text-secondary mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-2 bg-secondary/5 border border-secondary/20 rounded-md text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                    placeholder="Tell me about your project, question, or just say hello..."
                  ></textarea>
                </div>

                <div>
                  <button type="submit" className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-geologica">
                    Send Message
                  </button>
                </div>
              </form>
            </section>

            {/* Social Links Section */}
            <section className="mb-16">
              <h2 className="font-prosto text-2xl text-secondary mb-6 pb-3 border-b border-secondary/10">Connect With Me</h2>
              <p className="font-geologica text-secondary/80 mb-6">You can also find me on these platforms. Feel free to reach out or follow my work!</p>
              <div className="grid md:grid-cols-2 gap-4">
                {socialLinks.map((link) => (
                  <SocialLink key={link.id} name={link.name} url={link.url} icon={link.icon} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - Right side */}
          <aside className="lg:w-1/3">
            <div className="sticky top-20 space-y-8">
              {/* Profile Card */}
              <div className="bg-primary/95 backdrop-blur-sm p-6 rounded-lg border border-secondary/10 text-center">
                <img src="/api/placeholder/300/300" alt="Profile picture" className="w-32 h-32 rounded-full object-cover border-2 border-accent/20 mx-auto mb-4" />
                <h2 className="font-prosto text-xl text-secondary mb-2">Alex Morgan</h2>
                <p className="text-accent/80 font-geologica text-sm mb-4">Front-end Developer & Designer</p>
                <p className="text-secondary/80 font-geologica text-sm mb-6">Based in Seattle, WA. Available for freelance projects and collaborations.</p>
                <div className="pt-4 border-t border-secondary/10">
                  <p className="text-sm text-secondary font-geologica mb-2">Email me directly:</p>
                  <Link href="mailto:hello@example.com" className="text-accent hover:underline font-geologica text-sm">
                    hello@example.com
                  </Link>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-primary/95 backdrop-blur-sm p-6 rounded-lg border border-secondary/10">
                <h2 className="font-prosto text-xl text-secondary mb-6 pb-3 border-b border-secondary/10">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <FAQ key={faq.id} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </div>

              {/* Newsletter Section */}
              <div className="bg-primary/95 backdrop-blur-sm p-6 rounded-lg border border-secondary/10">
                <h2 className="font-prosto text-xl text-secondary mb-4">Join My Newsletter</h2>
                <p className="text-sm text-secondary/80 font-geologica mb-6">Subscribe to receive updates on new blog posts, projects, and occasional tips & tricks.</p>
                <form className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-2 bg-secondary/5 border border-secondary/20 rounded-md text-secondary placeholder:text-secondary/40 focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <button type="submit" className="w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
