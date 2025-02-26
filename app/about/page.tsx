/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

// Function to generate metadata for the page
export async function generateMetadata() {
  return {
    title: "About Me | My Personal Journey",
    description: "Learn more about who I am, my experience, and what drives me",
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
    { id: 1, name: "Web Development", level: 90 },
    { id: 2, name: "UI/UX Design", level: 85 },
    { id: 3, name: "Content Writing", level: 80 },
    { id: 4, name: "Photography", level: 75 },
    { id: 5, name: "Digital Marketing", level: 70 },
  ];

  // Static data for experience
  const experiences = [
    {
      id: 1,
      period: "2021 - Present",
      role: "Front-end Developer",
      company: "Tech Innovations Inc.",
      description: "Leading front-end development for various client projects. Specializing in React, Next.js, and TypeScript to create responsive and accessible web applications.",
    },
    {
      id: 2,
      period: "2018 - 2021",
      role: "Web Designer",
      company: "Creative Solutions Agency",
      description: "Designed and developed websites for small to medium businesses. Collaborated with marketing teams to create cohesive brand experiences across digital platforms.",
    },
    {
      id: 3,
      period: "2016 - 2018",
      role: "Freelance Designer",
      company: "Self-employed",
      description: "Worked with a variety of clients on web design, branding, and digital marketing projects. Built a portfolio of diverse work across multiple industries.",
    },
  ];

  // Static data for education
  const education = [
    {
      id: 1,
      period: "2014 - 2016",
      role: "Master's in Interactive Media",
      company: "Design University",
      description: "Focused on interactive design, user experience, and emerging technologies. Thesis project explored the intersection of web design and accessibility.",
    },
    {
      id: 2,
      period: "2010 - 2014",
      role: "Bachelor's in Computer Science",
      company: "Tech State University",
      description: "Studied programming fundamentals, web development, and graphic design. Active member of the Web Development Club and organized campus hackathons.",
    },
  ];

  // Static data for interests
  const interests = [
    { id: 1, icon: "📷", title: "Photography" },
    { id: 2, icon: "✈️", title: "Travel" },
    { id: 3, icon: "📚", title: "Reading" },
    { id: 4, icon: "🎮", title: "Gaming" },
    { id: 5, icon: "🏃", title: "Running" },
    { id: 6, icon: "🎵", title: "Music" },
  ];

  return (
    <main className="bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        {/* Page Header */}
        <header className="mb-16 text-center">
          <h1 className="font-prosto text-4xl md:text-5xl text-secondary font-normal mb-6">About Me</h1>
          <p className="font-geologica text-secondary/80 max-w-2xl mx-auto">Developer, designer, and creative thinker sharing my journey and insights</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main content - Left side */}
          <div className="lg:w-2/3">
            {/* Profile Section */}
            <section className="mb-16">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="shrink-0">
                  <img src="/api/placeholder/300/300" alt="Profile picture" className="w-48 h-48 rounded-full object-cover border-4 border-accent/20" />
                </div>
                <div>
                  <h2 className="font-prosto text-2xl text-secondary mb-4 text-center md:text-left">Hello, I&apos;m Alex Morgan</h2>
                  <div className="space-y-4 font-geologica text-secondary/80">
                    <p>
                      I&apos;m a passionate front-end developer and designer with over 7 years of experience creating beautiful, functional websites and applications. Currently based in Seattle, I enjoy combining technical skills with
                      creative thinking to build digital experiences that connect with people.
                    </p>
                    <p>
                      My journey in web development began during college when I built my first portfolio website. What started as a hobby quickly evolved into a career that I&apos;m deeply passionate about. I love the constant learning and
                      evolution that comes with working in tech.
                    </p>
                    <p>
                      When I&apos;m not coding or designing, you&apos;ll find me exploring the outdoors with my camera, trying new coffee shops, or getting lost in a good book. I believe that these diverse interests help fuel my creativity
                      and bring fresh perspectives to my work.
                    </p>
                    <p>Through this blog, I share my thoughts on design, development, and the intersection of technology and creativity. I also document my learning journey and occasional tutorials to help others in the field.</p>
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
                <p className="text-sm text-secondary/80 font-geologica mb-6">Have a project in mind or just want to say hello? I&apos;d love to hear from you!</p>
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
