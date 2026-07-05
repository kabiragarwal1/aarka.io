import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhatWeDo from "@/components/WhatWeDo";
import Journey from "@/components/Journey";
import WorkWithMe from "@/components/WorkWithMe";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <WhatWeDo />
        <Journey />
        <WorkWithMe />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
