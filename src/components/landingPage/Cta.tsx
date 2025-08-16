import { Globe, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { calendlyLink } from "@/constants";

export default function CTA() {
  return (
    <div className="w-full dark">
      <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-20">
        <div
          className="relative isolate w-full overflow-hidden rounded-2xl"
          style={{
            background:
              "linear-gradient(100.5deg,rgba(57,18,241,.4) 29.55%,rgba(164,129,255,.4) 93.8%),radial-gradient(38.35% 93.72% at 18.31% 6.28%,rgba(170,135,252,.8) 0,rgba(61,27,205,.8) 100%)",
          }}
        >
          {/* <img
            alt="bg"
            loading="lazy"
            width="1840"
            height="694"
            className="absolute top-0"
            src="/assets/cta/grid.svg"
          /> */}
          <div className="relative isolate overflow-hidden px-4 py-12 sm:px-24">
            <p className="w-fit rounded-xl bg-white px-4 py-1 text-center text-base leading-7 font-semibold text-black uppercase lg:text-left">
              Unleash Product Brilliance{" "}
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold text-white md:text-6xl">
              Ready to Dazzle Your Customers and Sell More?
            </h2>
            <p className="my-auto mt-3 max-w-2xl text-base text-gray-300 md:text-lg">
              If you need to get in touch, there are several ways to contact us.
            </p>
            <Button size={"lg"} variant={"default"} className="font-bold mt-4">
              <Link href={calendlyLink} target="_blank">
                Book a Call
              </Link>
            </Button>
            <ul className="mt-2 ml-0 list-none text-xs text-gray-300 md:text-base">
              <li>Let us know your requirements—we’ll help you get started!</li>
            </ul>
            <div className="mt-8 flex w-full flex-col justify-between gap-4 text-lg md:flex-row">
              {/* <a
                className="flex items-center gap-2 text-white"
                href="mailto:harshwardhan847@gmail.com"
              >
                <Mail className="h-7 w-7 text-red-500" />
                harshwardhan847@gmail.com
              </a> */}
              <a
                className="flex items-center gap-2 text-white"
                href="tel:+91-7988543957"
              >
                <Phone className="h-7 w-7 text-green-500" />
                +91-7988543957
              </a>
              <div></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
