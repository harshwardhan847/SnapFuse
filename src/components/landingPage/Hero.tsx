"use client";
import React from "react";
import { ArrowRight, X } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";

export default function Hero() {
  const { openSignUp, isSignedIn } = useClerk();
  return (
    <div className="relative dark w-full bg-background">
      <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(222,47,79,0.3),rgba(255,255,255,0))]"></div>
      <section className="relative z-1 mx-auto max-w-full">
        <div className="pointer-events-none absolute h-full w-full overflow-hidden opacity-50 -z-10 [perspective:200px]">
          <div className="absolute inset-0 [transform:rotateX(35deg)]">
            <div className="animate-grid [inset:0%_0px] [margin-left:-50%] [height:300vh] [width:600vw] [transform-origin:100%_0_0] [background-image:linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)] [background-size:120px_120px] [background-repeat:repeat]"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent to-90%"></div>
        </div>

        <div className="z-10 mx-auto max-w-screen-xl gap-12 px-4 py-28 text-gray-600 md:px-8">
          <div className="mx-auto max-w-4xl space-y-5 text-center leading-0 lg:leading-5">
            <h1 className="font-geist group mx-auto w-fit rounded-3xl border-[2px] border-white/10 bg-gradient-to-tr from-zinc-300/5 via-gray-400/5 to-transparent px-5 py-2 text-sm text-gray-400">
              Unleash Product Brilliance
              <ArrowRight className="ml-2 inline h-4 w-4 duration-300 group-hover:translate-x-1" />
            </h1>

            <h2 className="font-geist italic mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-4xl tracking-tighter text-transparent sm:text-6xl md:text-7xl">
              Create, Enhance, and Launch{" "}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Every Listing with <b className="inline">Snapfuse</b>.
              </span>
            </h2>

            <p className="mx-auto max-w-2xl text-gray-300 leading-normal">
              Unlock instant, studio-quality images, videos, and SEO-ready
              product content
            </p>
            <div className="space-y-8">
              <div className="items-center justify-center space-y-3 gap-x-3 sm:flex sm:space-y-0">
                <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#DE2F4F_0%,#393BB2_50%,#DE2F4F_100%)]" />
                  <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 text-xs font-medium text-gray-50 backdrop-blur-3xl">
                    {isSignedIn ? (
                      <Link
                        href={"/dashboard/home"}
                        className="group border-input inline-flex w-full items-center justify-center rounded-full border-[1px] bg-gradient-to-tr from-blue-300/5 via-red-400/20 to-transparent px-10 py-4 text-center text-white transition-colors hover:bg-transparent/90 sm:w-auto"
                      >
                        Go to Dashboard{" "}
                        <ArrowRight size={15} className="inline ml-2" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => openSignUp()}
                        className="group border-input inline-flex w-full items-center justify-center rounded-full border-[1px] bg-gradient-to-tr from-blue-300/5 via-red-400/20 to-transparent px-10 py-4 text-center text-white transition-colors hover:bg-transparent/90 sm:w-auto"
                      >
                        Start for Free
                      </button>
                    )}
                  </div>
                </span>
              </div>
              <span className="text-xs text-white p-2 px-4 rounded-full border border-indigo-500/40 ">
                <X className="text-red-600 inline" size={15} /> Graphic
                Designer, Video Editor, Copywriter
              </span>
            </div>
          </div>
          <div className="mx-10 mt-32">
            <img
              src="https://i.postimg.cc/0yk8Vz7t/dashboard.webp"
              className="w-full rounded-lg border shadow-lg"
              alt=""
            />
          </div>
        </div>
      </section>
    </div>
  );
}
