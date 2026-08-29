"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import type { ImageRef } from "@/lib/content";

const SLIDE_INTERVAL_MS = 4_000;

const FALLBACK_FIRST_SLIDE: ImageRef = {
  id: "hero-slide-teapot",
  url: "/upwork-assets/hero-slide-01-teapot.jpg",
  alt: "Floral porcelain teapot pouring into a cup",
};

const SUPPORTING_SLIDES = [
  {
    id: "hero-slide-camera",
    url: "/upwork-assets/hero-slide-02-camera.jpg",
    alt: "Exploded 3D rendering of a camera lens",
    tone: "charcoal",
  },
  {
    id: "hero-slide-character",
    url: "/upwork-assets/hero-slide-03-character.jpg",
    alt: "Stylized 3D character wearing a tan coat and hat",
    tone: "black",
  },
  {
    id: "hero-slide-workshop",
    url: "/upwork-assets/hero-slide-04-workshop.png",
    alt: "Wooden mechanical workshop enclosure concept rendering",
    tone: "cream",
  },
] as const;

export default function HeroSlideshow({ image }: { image: ImageRef | null }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isPointerOver, setIsPointerOver] = useState(false);
  const slides = [
    { ...(image ?? FALLBACK_FIRST_SLIDE), tone: "gray" },
    ...SUPPORTING_SLIDES,
  ];

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const honorReducedMotion = () => {
      if (reducedMotion.matches) setIsPlaying(false);
    };

    honorReducedMotion();
    reducedMotion.addEventListener("change", honorReducedMotion);

    return () => {
      reducedMotion.removeEventListener("change", honorReducedMotion);
    };
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsPageVisible(!document.hidden);

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (!isPlaying || !isPageVisible || isPointerOver) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [isPageVisible, isPlaying, isPointerOver, slides.length]);

  const showRelativeSlide = (offset: number) => {
    setActiveIndex((current) => (current + offset + slides.length) % slides.length);
    setIsPlaying(false);
  };

  return (
    <div
      className="avk-hero-slideshow"
      role="group"
      aria-roledescription="carousel"
      aria-label="Avokodo 3D renderings"
      onFocusCapture={() => setIsPlaying(false)}
      onMouseEnter={() => setIsPointerOver(true)}
      onMouseLeave={() => setIsPointerOver(false)}
    >
      <div className="avk-hero-slide-track" aria-live={isPlaying ? "off" : "polite"}>
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <figure
              className={`avk-hero-slide avk-hero-slide--${slide.tone}${
                isActive ? " avk-hero-slide--active" : ""
              }`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              aria-hidden={!isActive}
              key={slide.id}
            >
              <img
                src={slide.url}
                alt={isActive ? slide.alt : ""}
                decoding="async"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            </figure>
          );
        })}
      </div>

      <div className="avk-hero-slide-controls">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => showRelativeSlide(-1)}
        >
          ←
        </button>
        <button
          type="button"
          aria-label={isPlaying ? "Stop slide rotation" : "Start slide rotation"}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? "Ⅱ" : "▶"}
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => showRelativeSlide(1)}
        >
          →
        </button>
      </div>

      <div className="avk-hero-slide-indicators" aria-hidden="true">
        {slides.map((slide, index) => (
          <span
            className={index === activeIndex ? "is-active" : undefined}
            key={`${slide.id}-indicator`}
          />
        ))}
      </div>
    </div>
  );
}
