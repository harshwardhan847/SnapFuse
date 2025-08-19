import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

type Props = {};

const items = [
  {
    inputImage: "/showcase/showcase1-image-input.avif",
    outputImage: "/showcase/showcase1-image-output.webp",
    outputVideo: "/showcase/showcase1-video-output.mp4",
  },
  {
    inputImage: "/showcase/showcase3-image-input.jpeg",
    outputImage: "/showcase/showcase3-image-output.jpeg",
    outputVideo: "/showcase/showcase3-video-output.mp4",
  },
  {
    inputImage: "/showcase/showcase2-image-input.avif",
    outputImage: "/showcase/showcase2-image-output.webp",
    outputVideo: "/showcase/showcase2-video-output.mp4",
  },
];

const Showcase = (props: Props) => {
  return (
    <div className="w-full mt-12">
      <Carousel
        opts={{}}
        plugins={[
          Autoplay({
            delay: 6000,
          }),
        ]}
      >
        <CarouselContent>
          {items?.map((item) => (
            <CarouselItem>
              <div className="w-full relative gap-4 grid grid-cols-3 place-items-center ">
                <ArrowRight
                  className="text-white text-3xl scale-50 md:scale-100 drop-shadow-md absolute top-1/2 -translate-y-1/2 left-1/3 -translate-x-2/4 md:-translate-x-2/3"
                  size={120}
                  strokeWidth={1}
                />
                <ArrowRight
                  className="text-white text-3xl scale-50 md:scale-100 drop-shadow-md absolute top-1/2 -translate-y-1/2 left-2/3 -translate-x-2/4 md:-translate-x-2/3"
                  size={120}
                  strokeWidth={1}
                />
                <div className="w-full border rounded-2xl shadow flex items-center justify-center overflow-hidden">
                  <Image
                    src={item.inputImage}
                    alt="Input Image"
                    width={500}
                    height={500}
                    className="object-cover w-full"
                  />
                </div>
                <div className="w-full border rounded-2xl shadow flex items-center justify-center overflow-hidden">
                  <Image
                    src={item.outputImage}
                    alt="Output Image"
                    width={500}
                    height={500}
                    className="object-cover w-full"
                  />
                </div>
                <div className="w-full border rounded-2xl shadow flex items-center justify-center overflow-hidden">
                  <video
                    src={item.outputVideo}
                    className=" w-full object-cover rounded"
                    autoPlay
                    loop
                    muted
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Showcase;
