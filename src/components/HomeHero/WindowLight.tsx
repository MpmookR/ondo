/**
 * Sunlight through a window on the right: the far wall in soft shade, a broad warm glow and two
 * brighter shafts, each drifting and brightening on its own slow cycle. Decorative; sits behind
 * content in a `relative` parent. Shared by the homepage hero and onboarding so both feel like the
 * same room. Every loop stops under prefers-reduced-motion.
 */
export function WindowLight() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-illo-shade to-transparent" />
      <div className="absolute inset-y-0 right-0 w-1/2 -skew-x-12 bg-illo-glow blur-3xl animate-brew-ray-slow motion-reduce:animate-none" />
      <div className="absolute inset-y-0 right-64 w-1/4 -skew-x-12 bg-illo-light blur-2xl animate-brew-ray motion-reduce:animate-none" />
      <div className="absolute inset-y-0 right-1/3 w-1/12 -skew-x-12 bg-illo-light blur-xl animate-brew-ray-late motion-reduce:animate-none" />
    </div>
  );
}
