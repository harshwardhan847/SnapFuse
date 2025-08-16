import React from "react";
import Header2 from "../mvpblocks/header-2";
import Hero from "./Hero";
import Feature from "./Features";
import Testimonials from "./Testimonials";
import CTA from "./Cta";
import ContactUs from "./Contact";
import Team6 from "./Team";
import PricingSection from "./Pricing";
import Faq from "./Faqs";
import FooterGlow from "./Footer";
import Users from "./Users";
import { VelocityScroll } from "../mvpblocks/ui/scroll-based-velocity";

type Props = {};

const LandingPage = (props: Props) => {
  return (
    <div className="min-h-screen">
      <Header2 />
      <Hero />

      <Users />
      <Feature />
      <VelocityScroll
        className="px-6 text-center text-4xl font-bold tracking-tight md:text-7xl md:leading-[5rem]"
        text="Welcome to SnapFuse"
        default_velocity={5}
      />
      <div className="mx-auto w-full">
        <Testimonials />
      </div>
      <CTA />
      <PricingSection />
      <Team6 teamMembers={[]} />

      <ContactUs />
      <Faq />
      <FooterGlow />
    </div>
  );
};

export default LandingPage;
