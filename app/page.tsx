import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Work from "@/components/Work";

export const revalidate = 86400;

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Work />
      <Contact />
    </main>
  );
}
