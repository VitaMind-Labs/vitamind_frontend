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
        <PlatformOverview />
        <TechnologiesSection />
        <DiscoverySection />
        <ApproachSection />
        <FocusSection />
        <CTASection />
      </main>

      <FooterSection />
    </div>
  );
}
