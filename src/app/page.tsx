import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />

      {/* CTA Section Separator */}
      <section className="bg-brand-purple py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">Pronta para realçar o seu brilho?</h2>
          <p className="text-brand-pink mb-8 text-lg">Agende uma avaliação e tire todas as suas dúvidas.</p>
          <a
            href="https://wa.me/5551996715427?text=Ol%C3%A1%20Neclair%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%3F"
            target="_blank"
            className="inline-block bg-white text-brand-purple font-bold py-4 px-10 rounded-full hover:bg-brand-pink transition-colors shadow-lg"
          >
            Falar com Neclair
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
