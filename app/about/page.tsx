import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4">About Coupons</h2>
        <p className="text-gray-700 mb-6">Coupons started as a small side project to collect and surface the best promo codes and deals across popular online stores. Over time it grew into a curated catalog of stores and time-limited deals seeded in the app for demo and local development.</p>

        <div className="rounded-lg overflow-hidden shadow-sm">
          <Image src="/about-hero.svg" alt="About hero" width={800} height={240} className="w-full h-auto" />
        </div>
      </section>

      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-3">Our brief history</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>2023 — Project initiated with a basic Next.js starter.</li>
          <li>2024 — Prisma models and seed data added for categories, stores and deals.</li>
          <li>2025 — UI components and layout improvements; demo header/footer added.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-3">The team</h3>
        <p className="text-gray-700 mb-4">A small group of contributors and demo users maintain the curated list of deals and stores. Here is a playful representation of the team.</p>

        <div className="w-full max-w-md">
          <Image src="/about-team.svg" alt="Team illustration" width={400} height={160} className="rounded-md" />
        </div>
      </section>
    </div>
  )
}
