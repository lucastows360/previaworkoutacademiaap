import { Header } from './components/Header';
import { Hero360 } from './components/Hero360';
import { About } from './components/About';
import { VirtualTour } from './components/VirtualTour';
import { ScrollModel } from './components/ScrollModel';
import { Benefits } from './components/Benefits';
import { Gallery } from './components/Gallery';
import { PlansCTA } from './components/PlansCTA';
import { Location } from './components/Location';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { ScrollProgress, WhatsAppButton } from './components/WhatsAppButton';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <ScrollProgress />
      <Header />
      <main id="conteudo">
        <Hero360 />
        <About />
        <VirtualTour />
        <ScrollModel />
        <Benefits />
        <Gallery />
        <PlansCTA />
        <Location />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
