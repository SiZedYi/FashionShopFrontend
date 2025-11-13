"use client";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getActiveSliders } from "@/service/slider";
import { Slider } from "@/types/slider";

function HeroBanner() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getActiveSliders();
        if (!mounted) return;
        if (data && data.length > 0) {
          const sorted = [...data].sort(
            (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
          );
          setSliders(sorted);
          setActiveIndex(0);
        } else {
          setSliders([]);
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // autoplay effect must be declared before any conditional return
  useEffect(() => {
    if (!sliders.length) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sliders.length);
    }, 5000); // 5s
    return () => clearInterval(id);
  }, [sliders.length]);

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-gray-500 to-gray-800 text-white py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center">Loading banner...</div>
        </div>
      </section>
    );
  }

  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % sliders.length);

  console.log("Slider", sliders);

  return (
    <section className="text-white">
      <div className="w-full">
        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
          {sliders.length === 0 && (
            <div className="absolute inset-0">
              <Image
                src={"/images/products/apple-watch-9-removebg-preview.png"}
                alt={"fallback"}
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <span className="uppercase tracking-[0.25em] text-white/80 text-sm">
                  PRODUCTS
                </span>
                <h1 className="mt-3 text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow">
                  Discover the Latest in Tech
                </h1>
                <Link
                  href={"/shop"}
                  className="mt-6 inline-flex items-center gap-2 border border-white/70 text-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors"
                >
                  <ArrowRight /> Shop Now
                </Link>
              </div>
            </div>
          )}

          {sliders.map((s, idx) => {
            const image = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${s.imageUrl}`;
            const textAlign = s.textAlign || "center";
            const alignClass =
              textAlign === "left"
                ? "items-start text-left"
                : textAlign === "right"
                ? "items-end text-right"
                : "items-center text-center";
            return (
              <div
                key={s.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  idx === activeIndex
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <Image
                  src={image}
                  alt={s.title || "slide"}
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div
                  className={`absolute inset-0 flex flex-col ${alignClass} justify-center px-4 md:px-8`}
                >
                  <span className="uppercase tracking-[0.25em] text-white/80 text-sm">
                    {s.subtitle || "PRODUCTS"}
                  </span>
                  <h2 className="mt-3 text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow max-w-4xl mx-auto">
                    {s.title || "The beauty of nature is hidden in details."}
                  </h2>
                  <div
                    className={`${
                      textAlign === "left"
                        ? ""
                        : textAlign === "right"
                        ? ""
                        : "mx-auto"
                    }`}
                  >
                    <Link
                      href={s.buttonLink || "/shop"}
                      className="mt-6 inline-flex items-center gap-2 border border-white/70 text-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors"
                    >
                      <ArrowRight /> {s.buttonText || "Shop Now"}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {sliders.length > 1 && (
            <>
              <button
                aria-label="Previous slide"
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-black/80 hover:bg-white/90 rounded-full p-2 shadow"
              >
                <ChevronLeft />
              </button>
              <button
                aria-label="Next slide"
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black/80 hover:bg-white/90 rounded-full p-2 shadow"
              >
                <ChevronRight />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {sliders.map((_, idx) => (
                  <button
                    key={idx}
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full ${
                      idx === activeIndex ? "bg-white" : "bg-white/50"
                    } hover:bg-white`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
