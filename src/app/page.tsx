import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/ui/Hero";
import FeedPreview from "@/components/feed/FeedPreview";
import TokenPreview from "@/components/token/TokenPreview";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <FeedPreview />
      <TokenPreview />
    </main>
  );
}
