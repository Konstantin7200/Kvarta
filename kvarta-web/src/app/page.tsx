import { About } from "@/components/About";
import { ContactSection } from "@/components/ContactSection";
import { Delivery } from "@/components/Delivery";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Lots } from "@/components/Lots";
import { Subscription } from "@/components/Subscription";

export default function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1">
        <About />
        <Lots />
        <HowItWorks />
        <Subscription />
        <Delivery />
        <Faq />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
