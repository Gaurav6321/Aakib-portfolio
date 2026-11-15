import { Capabilities, Featured, Hero, HomeAbout } from "@/components/home";
import { Contact, Footer } from "@/components/ui";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeAbout />
      <Featured />
      <Capabilities />
      <Contact />
      <Footer />
    </>
  );
}
