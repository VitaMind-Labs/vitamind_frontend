import {
  Header,
  HeroSection,
  TechnologiesSection,
  DiscoverySection,
  ApproachSection,
  FooterSection,
  PricingSection,
  PlatformOverview,
} from "./_components";
import { HomeBackdrop } from "./animations";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-[var(--background)] text-[var(--on-background)]">
      <HomeBackdrop />
      <Header />

      <main className="relative z-10 flex w-full flex-col gap-28 px-5 py-20 md:px-16">
        <HeroSection />
        <section id="solutions" className="scroll-mt-32"><TechnologiesSection /></section>
        <section id="discovery" className="scroll-mt-32"><DiscoverySection /></section>
        <section id="how-it-works" className="scroll-mt-32"><ApproachSection /></section>
        <section id="pricing" className="scroll-mt-32"><PricingSection /></section>
        <section id="" className="scroll-mt-32"><PlatformOverview/></section>
      </main>

      <FooterSection />
    </div>
  );
}
