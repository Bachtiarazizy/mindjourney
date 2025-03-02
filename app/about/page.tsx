/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

// Function to generate metadata for the page
export async function generateMetadata() {
  return {
    title: "About Me | Azka Musfirah",
    description: "Learn more about Azka Musfirah, her community service experience, and psychology background",
  };
}

// Skill Component
function Skill({ name, level }: { name: string; level: number }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-geologica text-secondary">{name}</span>
        <span className="text-xs font-geologica text-secondary/70">{level}%</span>
      </div>
      <div className="h-2 bg-secondary/10 rounded-full">
        <div className="h-full bg-accent rounded-full" style={{ width: `${level}%` }}></div>
      </div>
    </div>
  );
}

// Experience Item Component
function ExperienceItem({ period, role, company, description }: { period: string; role: string; company: string; description: string }) {
  return (
    <div className="relative pl-8 pb-8 border-l border-secondary/20 last:border-0 last:pb-0">
      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-accent -translate-x-2"></div>
      <div className="mb-2">
        <span className="text-xs font-bold bg-accent/10 text-accent px-2 py-1 rounded-full">{period}</span>
      </div>
      <h3 className="font-prosto text-lg text-secondary mb-1">{role}</h3>
      <p className="text-accent/80 font-geologica text-sm mb-2">{company}</p>
      <p className="text-secondary/80 font-geologica text-sm">{description}</p>
    </div>
  );
}

// Interest Card Component
function InterestCard({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-secondary/10 rounded-lg hover:bg-secondary/5 transition-colors">
      <div className="text-xl text-accent">{icon}</div>
      <h3 className="font-geologica text-sm text-secondary">{title}</h3>
    </div>
  );
}

// Main about page component
export default function AboutPage() {
  // Static data for skills
  const skills = [
    { id: 1, name: "Volunteer Management", level: 90 },
    { id: 2, name: "Community Engagement", level: 85 },
    { id: 3, name: "Media Management", level: 80 },
    { id: 4, name: "Psychology", level: 85 },
    { id: 5, name: "Creative Content", level: 75 },
  ];

  // Static data for experience
  const experiences = [
    {
      id: 1,
      period: "Current",
      role: "Social and Community Service Department",
      company: "PPI Turki",
      description:
        "Leading the 'Mentari in Turkey' program focused on fostering community involvement and social impact through strategic volunteer management. Planning and implementing community service activities that address the needs of both Indonesian students and the local Turkish community.",
    },
    {
      id: 2,
      period: "Current",
      role: "Media and Creative Manager",
      company: "Radio PPI Turki",
      description:
        "Enhancing Radio PPI Turki's presence amongst Indonesians in Turkey through creative media strategies and compelling content. Developing innovative approaches to engage the Indonesian community in Turkey through various media channels.",
    },
  ];

  // Static data for education
  const education = [
    {
      id: 1,
      period: "Current",
      role: "Psychology and Guidance Counselling",
      company: "Sivas Cumhuriyet Üniversitesi",
      description:
        "Studying psychology with a focus on guidance counselling, developing expertise in understanding human behavior and providing support to individuals. Applying psychological principles to enhance community service approaches.",
    },
  ];

  // Static data for interests
  const interests = [
    { id: 1, icon: "👥", title: "Community Service" },
    { id: 2, icon: "🧠", title: "Psychology" },
    { id: 3, icon: "🎙️", title: "Media" },
    { id: 4, icon: "✈️", title: "Cultural Exchange" },
    { id: 5, icon: "🤝", title: "Volunteer Work" },
    { id: 6, icon: "📝", title: "Content Creation" },
  ];

  return (
    <main className="bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        {/* Page Header */}
        <header className="mb-16 text-center">
          <h1 className="font-prosto text-4xl md:text-5xl text-secondary font-normal mb-6">About Me</h1>
          <p className="font-geologica text-secondary/80 max-w-2xl mx-auto">Community service leader, media manager, and psychology student dedicated to social impact</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main content - Left side */}
          <div className="lg:w-2/3">
            {/* Profile Section */}
            <section className="mb-16">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="shrink-0">
                  <img src="/azka.jpg" alt="Profile picture" className="w-48 h-48 rounded-full object-cover border-4 border-accent/20" />
                </div>
                <div>
                  <h2 className="font-prosto text-2xl text-secondary mb-4 text-center md:text-left">Hello, I&apos;m Azka Musfirah</h2>
                  <div className="space-y-4 font-geologica text-secondary/80">
                    <p>
                      I&apos;m passionate about community service and social impact with a focus on volunteer management. Currently based in Turkey, I lead the &quot;Mentari in Turkey&quot; program at PPI Turki while studying Psychology and
                      Guidance Counselling at Sivas Cumhuriyet Üniversitesi.
                    </p>
                    <p>
                      My work involves planning and implementing community service activities that address the needs of both Indonesian students and the local Turkish community. I partner with a vibrant team to innovate and amplify our
                      outreach and effectiveness.
                    </p>
                    <p>Additionally, as the Media and Creative Manager at Radio PPI Turki, I work on enhancing our presence amongst Indonesians in Turkey through creative media strategies and compelling content development.</p>
                    <p>
                      My academic pursuit in Psychology continuously informs my approach to community service, ensuring compassionate and culturally sensitive engagement in all my initiatives. I believe in creating meaningful connections
                      and supporting both the Indonesian and Turkish communities.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section className="mb-16">
              <h2 className="font-prosto text-2xl text-secondary mb-6 pb-3 border-b border-secondary/10">Professional Experience</h2>
              <div className="ml-4">
                {experiences.map((item) => (
                  <ExperienceItem key={item.id} period={item.period} role={item.role} company={item.company} description={item.description} />
                ))}
              </div>
            </section>

            {/* Education Section */}
            <section className="mb-16">
              <h2 className="font-prosto text-2xl text-secondary mb-6 pb-3 border-b border-secondary/10">Education</h2>
              <div className="ml-4">
                {education.map((item) => (
                  <ExperienceItem key={item.id} period={item.period} role={item.role} company={item.company} description={item.description} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - Right side */}
          <aside className="lg:w-1/3">
            <div className="sticky top-20 space-y-8">
              {/* Skills Section */}
              <div className="bg-primary/95 backdrop-blur-sm p-6 rounded-lg border border-secondary/10">
                <h2 className="font-prosto text-xl text-secondary mb-6 pb-3 border-b border-secondary/10">Skills</h2>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <Skill key={skill.id} name={skill.name} level={skill.level} />
                  ))}
                </div>
              </div>

              {/* Interests Section */}
              <div className="bg-primary/95 backdrop-blur-sm p-6 rounded-lg border border-secondary/10">
                <h2 className="font-prosto text-xl text-secondary mb-6 pb-3 border-b border-secondary/10">Interests</h2>
                <div className="grid grid-cols-2 gap-3">
                  {interests.map((interest) => (
                    <InterestCard key={interest.id} icon={interest.icon} title={interest.title} />
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
                <h2 className="font-prosto text-xl text-secondary mb-4">Let&apos;s Connect</h2>
                <p className="text-sm text-secondary/80 font-geologica mb-6">Interested in community service collaborations or want to learn more about my work? I&apos;d love to hear from you!</p>
                <Link href="/contact" className="block w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors text-center">
                  Get in Touch
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
