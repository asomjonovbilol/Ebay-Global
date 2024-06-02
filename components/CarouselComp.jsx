const { Carousel } = require("react-responsive-carousel");
import "react-responsive-carousel/lib/styles/carousel.min.css";

import React from "react";
import Image from "next/image";

export default function () {
  return (
    <>
      <div className="max-w-[1200px] mx-auto">
        <Carousel
          showArrows={true}
          autoPlay={true}
          interval={3000}
          infiniteLoop={true}
          showThumbs={false}
        >
          <div className="relative w-full h-full">
            <Image
              src="/images/banner/1.png"
              alt="banner"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className="relative">
            <Image
              src="/images/banner/2.png"
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className="relative">
            <Image
              src="/images/banner/3.png"
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </Carousel>
      </div>
    </>
  );
}
