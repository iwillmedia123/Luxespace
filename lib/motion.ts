import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger only on the client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Utility to check if user prefers reduced motion (accessibility)
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// 1. Fade Up Reveal
export const fadeUp = (
  element: gsap.TweenTarget,
  delay = 0,
  duration = 1.0,
  trigger?: gsap.DOMTarget
) => {
  if (typeof window === "undefined") return null;
  const isReduced = prefersReducedMotion();

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: isReduced ? 0 : 30,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: trigger
        ? {
            trigger: trigger,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          }
        : undefined,
    }
  );
};

// 2. Fade Left Reveal (slides from right to left)
export const fadeLeft = (
  element: gsap.TweenTarget,
  delay = 0,
  duration = 1.0,
  trigger?: gsap.DOMTarget
) => {
  if (typeof window === "undefined") return null;
  const isReduced = prefersReducedMotion();

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      x: isReduced ? 0 : 30,
    },
    {
      opacity: 1,
      x: 0,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: trigger
        ? {
            trigger: trigger,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          }
        : undefined,
    }
  );
};

// 3. Fade Right Reveal (slides from left to right)
export const fadeRight = (
  element: gsap.TweenTarget,
  delay = 0,
  duration = 1.0,
  trigger?: gsap.DOMTarget
) => {
  if (typeof window === "undefined") return null;
  const isReduced = prefersReducedMotion();

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      x: isReduced ? 0 : -30,
    },
    {
      opacity: 1,
      x: 0,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: trigger
        ? {
            trigger: trigger,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          }
        : undefined,
    }
  );
};

// 4. Stagger Cards Reveal
export const staggerCards = (
  elements: gsap.TweenTarget,
  trigger: gsap.DOMTarget,
  delay = 0,
  duration = 1.0,
  stagger = 0.1
) => {
  if (typeof window === "undefined") return null;
  const isReduced = prefersReducedMotion();

  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: isReduced ? 0 : 40,
      scale: isReduced ? 1 : 0.97,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      delay,
      stagger,
      ease: "power2.out",
      scrollTrigger: {
        trigger: trigger,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
    }
  );
};

// 5. Draw Decorative Line
export const drawLine = (
  element: gsap.TweenTarget,
  trigger: gsap.DOMTarget,
  delay = 0,
  duration = 1.0,
  direction: "horizontal" | "vertical" = "horizontal"
) => {
  if (typeof window === "undefined") return null;

  return gsap.fromTo(
    element,
    {
      scaleX: direction === "horizontal" ? 0 : 1,
      scaleY: direction === "vertical" ? 0 : 1,
      transformOrigin: direction === "horizontal" ? "left center" : "center top",
    },
    {
      scaleX: 1,
      scaleY: 1,
      duration,
      delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: trigger,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
    }
  );
};

// 6. Split Text Heading Reveal (line-by-line helper)
export const splitHeadingReveal = (
  elements: gsap.TweenTarget,
  trigger?: gsap.DOMTarget,
  delay = 0,
  duration = 1.2,
  stagger = 0.1
) => {
  if (typeof window === "undefined") return null;
  const isReduced = prefersReducedMotion();

  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: isReduced ? 0 : 25,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: "power3.out",
      scrollTrigger: trigger
        ? {
            trigger: trigger,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          }
        : undefined,
    }
  );
};

// 7. Parallax Background Image Scroll Effect
export const parallaxImage = (
  imageElement: gsap.TweenTarget,
  containerElement: gsap.DOMTarget,
  movementPercent = 15
) => {
  if (typeof window === "undefined" || prefersReducedMotion()) return null;

  return gsap.fromTo(
    imageElement,
    {
      yPercent: -movementPercent,
    },
    {
      yPercent: movementPercent,
      ease: "none",
      scrollTrigger: {
        trigger: containerElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
};

// 8. Timeline Process Path & Steps Reveal
export const timelineReveal = (
  lineElement: gsap.TweenTarget,
  stepElements: gsap.TweenTarget,
  trigger: gsap.DOMTarget,
  direction: "horizontal" | "vertical" = "horizontal",
  lineDuration = 1.0,
  stepDuration = 0.8
) => {
  if (typeof window === "undefined") return null;
  const isReduced = prefersReducedMotion();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: trigger,
      start: "top 80%",
      toggleActions: "play none none none",
      once: true,
    },
  });

  // Draw the timeline line first
  tl.fromTo(
    lineElement,
    {
      scaleX: direction === "horizontal" ? 0 : 1,
      scaleY: direction === "vertical" ? 0 : 1,
      transformOrigin: direction === "horizontal" ? "left center" : "center top",
    },
    {
      scaleX: 1,
      scaleY: 1,
      duration: lineDuration,
      ease: "none",
    }
  );

  // Stagger steps in sequence
  tl.fromTo(
    stepElements,
    {
      opacity: 0,
      scale: isReduced ? 1 : 0.9,
      y: isReduced ? 0 : 20,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: stepDuration,
      stagger: 0.15,
      ease: "power2.out",
    },
    "-=0.5" // overlap slightly with line drawing
  );

  return tl;
};

// 9. Interactive Counter Animation (counts numbers upward)
export const counterReveal = (
  element: HTMLElement | null,
  trigger: gsap.DOMTarget,
  toValue: number,
  fromValue = 0,
  duration = 1.5,
  delay = 0
) => {
  if (!element || typeof window === "undefined") return null;

  const countObj = { value: fromValue };

  return gsap.to(countObj, {
    value: toValue,
    duration,
    delay,
    ease: "power1.out",
    scrollTrigger: {
      trigger: trigger,
      start: "top 85%",
      toggleActions: "play none none none",
      once: true,
    },
    onUpdate: () => {
      element.innerText = Math.floor(countObj.value).toString();
    },
  });
};

// 10. Magnetic Button Hover / Cursor Pull Effect (desktop only)
export const magneticHover = (
  element: HTMLElement | null,
  magneticStrength = 0.3
) => {
  if (!element || typeof window === "undefined" || prefersReducedMotion()) return;

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: x * magneticStrength,
      y: y * magneticStrength,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};
