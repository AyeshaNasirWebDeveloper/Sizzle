import { OrderProvider } from "@/lib/order";
import { SmoothScroll } from "@/lib/smooth";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { Story } from "@/components/Story";
import { TapeMarquee } from "@/components/TapeMarquee";
import { Manifesto } from "@/components/Manifesto";
import { Kitchen } from "@/components/Kitchen";
import { Signature } from "@/components/Signature";
import { Menu } from "@/components/Menu";
import { HowToOrder } from "@/components/HowToOrder";
import { Offers } from "@/components/Offers";
import { Reviews } from "@/components/Reviews";
import { Gallery } from "@/components/Gallery";
import { Faq } from "@/components/Faq";
import { Visit } from "@/components/Visit";
import { Closing } from "@/components/Closing";
import { OrderTray } from "@/components/OrderTray";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Cursor } from "@/components/Cursor";
import { ScrollReveals } from "@/components/ScrollReveals";

export default function Home() {
  return (
    <OrderProvider>
      <SmoothScroll />
      <Loader />
      <Nav />
      <main id="main">
        <span id="top" />
        {/* A–C: burger → broast → pizza */}
        <Story />
        <TapeMarquee />
        <Manifesto />
        <Kitchen />
        <Signature />
        {/* D: full menu */}
        <Menu />
        <HowToOrder />
        {/* E: offers */}
        <Offers />
        <Reviews />
        <Gallery />
        <Faq />
        <Visit />
        {/* F: closing + footer */}
        <Closing />
      </main>
      <OrderTray />
      <WhatsAppFloat />
      <Cursor />
      <ScrollReveals />
    </OrderProvider>
  );
}
