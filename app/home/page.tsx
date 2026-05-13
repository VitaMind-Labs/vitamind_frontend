import {
  Header,
  HeroSection,
  PlatformOverview,
  TechnologiesSection,
  DiscoverySection,
  ApproachSection,
  FocusSection,
  CTASection,
  FooterSection,
} from "./_components";

export default function Home() {
  return (
    <div className="bg-[var(--background)] text-[var(--on-background)]">
      <Header />

      <main className="w-full flex flex-col gap-32 px-5 py-20 md:px-16">
        <HeroSection />
        <section id="platform" className="scroll-mt-32"><PlatformOverview /></section>
        <section id="solutions" className="scroll-mt-32"><TechnologiesSection /></section>
        <section id="discovery" className="scroll-mt-32"><DiscoverySection /></section>
        <section id="how-it-works" className="scroll-mt-32"><ApproachSection /></section>
        <section id="clinical-safety" className="scroll-mt-32"><FocusSection /></section>
        <section id="pricing" className="scroll-mt-32"><CTASection /></section>
      </main>

      <FooterSection />
    </div>
  );
}
