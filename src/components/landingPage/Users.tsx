import { SparklesCore } from "../mvpblocks/ui/sparkles";

export default function Users() {
  return (
    <div className="h-[90%] w-screen overflow-hidden bg-background">
      <div className="mx-auto mt-20 w-screen max-w-3xl">
        <div className="text-center text-3xl text-white">
          <span className="text-rose-200">Trusted by eCommerce sellers.</span>

          <br />

          <span>Used by the leaders.</span>
        </div>

        <div className="mt-14 grid grid-cols-4 text-xl font-semibold w-full">
          {[
            "D2C founders",
            "Marketplace sellers",
            "Digital brands",
            "Enterprise sellers",
          ].map((text) => (
            <div key={text} className="w-full text-center text-white">
              {text}
            </div>
          ))}
        </div>
      </div>

      <div className="relative -mt-32 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#e60a64,transparent_70%)] before:opacity-40 after:absolute after:top-1/2 after:-left-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-[#c5769066] after:bg-zinc-900">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          particleDensity={300}
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </div>
    </div>
  );
}
