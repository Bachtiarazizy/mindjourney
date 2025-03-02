/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

// Function to generate metadata for the page
export async function generateMetadata() {
  return {
    title: "Mind Journey | Personal Growth Through Psychology",
    description: "Explore Azka Musfirah's journey through psychology, offering insights, resources, and community support for mental wellness and personal development",
  };
}

// Event Card Component
function EventCard({ title, date, location, image, description }: { title: string; date: string; location: string; image: string; description: string }) {
  return (
    <div className="border border-secondary/10 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-prosto text-lg text-secondary mb-2">{title}</h3>
        <div className="flex items-center gap-2 text-sm font-geologica text-accent/80 mb-2">
          <span>📅 {date}</span>
          <span className="text-secondary/30">•</span>
          <span>📍 {location}</span>
        </div>
        <p className="text-secondary/80 font-geologica text-sm">{description}</p>
        <Link href="#" className="inline-block mt-4 text-accent font-geologica text-sm hover:underline">
          Read more →
        </Link>
      </div>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({ name, role, image, quote }: { name: string; role: string; image: string; quote: string }) {
  return (
    <div className="text-center p-4">
      <img src={image} alt={name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-accent/20" />
      <h3 className="font-prosto text-lg text-secondary mb-1">{name}</h3>
      <p className="text-accent/80 font-geologica text-sm mb-3">{role}</p>
      <p className="text-secondary/80 font-geologica text-sm italic">&quot;{quote}&quot;</p>
    </div>
  );
}

// Impact Stat Component
function ImpactStat({ number, label, icon }: { number: string; label: string; icon: string }) {
  return (
    <div className="text-center p-6">
      <div className="text-4xl text-accent mb-2">{icon}</div>
      <div className="font-prosto text-3xl text-secondary mb-1">{number}</div>
      <p className="text-secondary/80 font-geologica text-sm">{label}</p>
    </div>
  );
}

// Main Mind Journey page component
export default function MindJourneyPage() {
  // Static data for upcoming workshops
  const upcomingWorkshops = [
    {
      id: 1,
      title: "Mindfulness Meditation Workshop",
      date: "April 15, 2025",
      location: "Virtual Session",
      image: "/api/placeholder/600/400",
      description: "Learn evidence-based mindfulness techniques to reduce stress, improve focus, and enhance overall mental well-being in this interactive workshop.",
    },
    {
      id: 2,
      title: "Cognitive Behavioral Therapy Basics",
      date: "April 22, 2025",
      location: "Psychology Center",
      image: "/api/placeholder/600/400",
      description: "Discover how to identify negative thought patterns and develop practical strategies to transform them using CBT principles.",
    },
    {
      id: 3,
      title: "Emotional Intelligence Masterclass",
      date: "May 5, 2025",
      location: "Community Center",
      image: "/api/placeholder/600/400",
      description: "Enhance your ability to understand and manage emotions, build stronger relationships, and navigate social complexities more effectively.",
    },
  ];

  // Static data for client testimonials
  const testimonials = [
    {
      id: 1,
      name: "Maya Rahman",
      role: "Student",
      image: "/api/placeholder/300/300",
      quote: "Mind Journey's resources helped me develop better coping strategies during my final exams. I've never felt more mentally prepared.",
    },
    {
      id: 2,
      name: "Tomas Alvarez",
      role: "Working Professional",
      image: "/api/placeholder/300/300",
      quote: "Azka's mindfulness sessions transformed how I handle workplace stress and improved my overall quality of life.",
    },
    {
      id: 3,
      name: "Sarah Chen",
      role: "Workshop Participant",
      image: "/api/placeholder/300/300",
      quote: "The emotional intelligence workshop gave me practical tools I use daily to improve my relationships and self-awareness.",
    },
  ];

  // Static data for impact statistics
  const impactStats = [
    { id: 1, number: "500+", label: "Workshop Participants", icon: "👥" },
    { id: 2, number: "20+", label: "Psychological Resources", icon: "📚" },
    { id: 3, number: "15", label: "Mindfulness Sessions", icon: "🧘" },
    { id: 4, number: "1,200+", label: "Hours of Research", icon: "⏰" },
  ];

  return (
    <main className="bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        {/* Hero Section */}
        <section className="relative rounded-xl overflow-hidden mb-16">
          <img src="/feature-1.jpg" alt="Mind Journey" className="w-full h-80 object-cover" />
          <div className="absolute inset-0 bg-secondary/50 flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-prosto text-4xl md:text-5xl text-primary font-normal mb-4">Mind Journey</h1>
            <p className="font-geologica text-primary/90 max-w-2xl">Exploring the depths of human psychology and guiding others toward mental wellness and personal growth</p>
          </div>
        </section>

        {/* About the Journey Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="font-prosto text-3xl text-secondary mb-6">About My Journey</h2>
              <div className="space-y-4 font-geologica text-secondary/80">
                <p>
                  <span className="text-accent font-semibold">Mind Journey</span> represents my path through the fascinating world of psychology. As a psychology student, I&apos;m passionate about understanding the human mind and helping
                  others navigate their own mental landscapes.
                </p>
                <p>
                  My mission is to bridge the gap between psychological theory and practical application, making mental wellness accessible to everyone. Through research, workshops, and community engagement, I explore various aspects of
                  psychology and share valuable insights and tools.
                </p>
                <p>
                  The name &quot;Mind Journey&quot; reflects the continuous process of psychological growth and self-discovery that we all experience. It emphasizes that mental wellness isn&apos;t a destination but a lifelong journey of
                  understanding ourselves and others better.
                </p>
              </div>
              <div className="mt-6">
                <Link href="/contact" className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-geologica inline-block">
                  Join the Journey
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img src="/feature-2.jpg" alt="Psychology Research and Practice" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </section>

        {/* Impact Statistics Section */}
        <section className="mb-16 bg-accent/5 rounded-xl p-8">
          <h2 className="font-prosto text-3xl text-secondary mb-8 text-center">Journey Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {impactStats.map((stat) => (
              <ImpactStat key={stat.id} number={stat.number} label={stat.label} icon={stat.icon} />
            ))}
          </div>
        </section>

        {/* Focus Areas Section */}
        <section className="mb-16">
          <h2 className="font-prosto text-3xl text-secondary mb-8 text-center">Focus Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-secondary/10 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-4xl text-accent mb-4">🧠</div>
              <h3 className="font-prosto text-xl text-secondary mb-3">Cognitive Psychology</h3>
              <p className="text-secondary/80 font-geologica text-sm">Exploring how we think, perceive, remember, and learn, with practical applications to improve cognitive functioning and mental clarity.</p>
            </div>
            <div className="border border-secondary/10 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-4xl text-accent mb-4">❤️</div>
              <h3 className="font-prosto text-xl text-secondary mb-3">Emotional Wellness</h3>
              <p className="text-secondary/80 font-geologica text-sm">Developing emotional intelligence and resilience through understanding how emotions function and how to manage them effectively.</p>
            </div>
            <div className="border border-secondary/10 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="text-4xl text-accent mb-4">🔄</div>
              <h3 className="font-prosto text-xl text-secondary mb-3">Behavioral Change</h3>
              <p className="text-secondary/80 font-geologica text-sm">Implementing evidence-based techniques to transform habits, overcome challenges, and create lasting positive changes in daily life.</p>
            </div>
          </div>
        </section>

        {/* Upcoming Workshops Section */}
        <section className="mb-16">
          <h2 className="font-prosto text-3xl text-secondary mb-8 text-center">Upcoming Workshops</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingWorkshops.map((workshop) => (
              <EventCard key={workshop.id} title={workshop.title} date={workshop.date} location={workshop.location} image={workshop.image} description={workshop.description} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="#" className="px-6 py-3 border border-accent text-accent rounded-md hover:bg-accent/5 transition-colors font-geologica inline-block">
              View All Workshops
            </Link>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16">
          <h2 className="font-prosto text-3xl text-secondary mb-8 text-center">Journey Companions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} name={testimonial.name} role={testimonial.role} image={testimonial.image} quote={testimonial.quote} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="#" className="px-6 py-3 border border-accent text-accent rounded-md hover:bg-accent/5 transition-colors font-geologica inline-block">
              Read More Stories
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-accent/10 rounded-xl p-8 text-center">
          <h2 className="font-prosto text-3xl text-secondary mb-4">Begin Your Own Journey</h2>
          <p className="font-geologica text-secondary/80 max-w-2xl mx-auto mb-8">
            Whether you&apos;re seeking personal growth, interested in psychology, or looking for resources to improve your mental well-being, I invite you to join me on this journey of discovery and transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-geologica">
              Schedule a Consultation
            </Link>
            <Link href="#" className="px-6 py-3 border border-accent text-accent rounded-md hover:bg-accent/5 transition-colors font-geologica">
              Access Resources
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
