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
    <div className="dark min-h-screen bg-background">
      <Header2 />
      <Hero />
      <Users />
      <Feature />

      {/* <div className="mx-auto w-full">
        <Testimonials />
      </div> */}
      <VelocityScroll
        className="px-6 text-center dark dark:text-white text-4xl font-bold tracking-tight md:text-7xl md:leading-[5rem]"
        text="Welcome to SnapFuse — AI that empowers your listings."
        default_velocity={3}
      />
      <CTA />
      <PricingSection />
      {/* <Team6 teamMembers={[]} /> */}

      {/* <ContactUs /> */}
      <Faq />
      <FooterGlow />
    </div>
  );
};

export default LandingPage;
