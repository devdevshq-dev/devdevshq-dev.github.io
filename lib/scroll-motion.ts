const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Content stays visible before hydration and when animation APIs are unavailable.
export function startScrollMotion() {
  const root = document.documentElement;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  const images = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-image]"));
  const revealed = new WeakSet<HTMLElement>();
  const animations = new Map<HTMLElement, Animation>();
  let observer: IntersectionObserver | undefined;
  let frame = 0;

  function reveal(element: HTMLElement, animate = true) {
    if (!animate) {
      animations.get(element)?.cancel();
      animations.delete(element);
    }
    observer?.unobserve(element);
    if (revealed.has(element)) return;
    revealed.add(element);
    element.classList.add("is-revealed");
    if (!animate || preference.matches || typeof element.animate !== "function") return;

    const animation = element.animate([
      { opacity: 0, transform: "translateY(24px)" },
      { opacity: 1, transform: "translateY(0)" },
    ], {
      duration: 650,
      delay: clamp(Number(element.dataset.revealDelay) || 0, 0, 240),
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "backwards",
    });
    animations.set(element, animation);
    animation.onfinish = () => animations.delete(element);
  }

  function update() {
    frame = 0;
    const travel = Math.max(0, root.scrollHeight - window.innerHeight);
    root.style.setProperty("--scroll-progress", String(travel ? clamp(window.scrollY / travel, 0, 1) : 0));
    root.classList.toggle("has-scrolled", window.scrollY > 24);
    if (preference.matches) return;

    // Batch geometry reads, then writes; cap drift so the image always covers its frame.
    const positions = images.map(image => ({ image, rect: image.parentElement!.getBoundingClientRect() }));
    for (const { image, rect } of positions) {
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) continue;
      const offset = clamp((window.innerHeight / 2 - rect.top - rect.height / 2) * 0.065, -18, 18);
      image.style.setProperty("--scroll-offset", `${offset.toFixed(2)}px`);
    }
  }

  function queueUpdate() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  function stopMotion() {
    observer?.disconnect();
    observer = undefined;
    for (const animation of animations.values()) animation.cancel();
    animations.clear();
    for (const image of images) image.style.removeProperty("--scroll-offset");
    root.classList.remove("motion-enabled");
  }

  function configure() {
    stopMotion();
    if (preference.matches) {
      targets.forEach(element => reveal(element, false));
    } else {
      root.classList.add("motion-enabled");
      if (typeof IntersectionObserver === "function") {
        observer = new IntersectionObserver(entries => {
          for (const entry of entries) if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        }, { threshold: 0.08, rootMargin: "0px 0px 60px 0px" });
        for (const target of targets) if (!revealed.has(target)) observer.observe(target);
      } else {
        targets.forEach(element => reveal(element, false));
      }
    }
    revealFocused(document.activeElement);
    queueUpdate();
  }

  function revealFocused(target: EventTarget | null) {
    if (!(target instanceof Element)) return;
    const element = target.closest<HTMLElement>("[data-reveal]");
    if (element) reveal(element, false);
  }

  const onFocus = (event: FocusEvent) => revealFocused(event.target);
  window.addEventListener("scroll", queueUpdate, { passive: true });
  window.addEventListener("resize", queueUpdate);
  document.addEventListener("focusin", onFocus);
  preference.addEventListener("change", configure);
  configure();

  return () => {
    stopMotion();
    window.cancelAnimationFrame(frame);
    window.removeEventListener("scroll", queueUpdate);
    window.removeEventListener("resize", queueUpdate);
    document.removeEventListener("focusin", onFocus);
    preference.removeEventListener("change", configure);
    root.style.removeProperty("--scroll-progress");
    root.classList.remove("has-scrolled");
    targets.forEach(target => target.classList.remove("is-revealed"));
  };
}
