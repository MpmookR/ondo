/** Plank seams on the tabletop, running towards a vanishing point behind the table (0–1000 wide). */
const seams = [60, 190, 320, 450, 580, 710, 840, 970];
/** Fine grain between the seams. */
const grain = [120, 255, 385, 515, 645, 775, 905];
/** Where a line at the back (x) lands at the front edge, in perspective. */
const front = (x: number) => 500 + (x - 500) * 1.35;

/**
 * The wooden table the scene stands on, in 3D: a top surface seen in perspective (planks and grain
 * running away from you, lighter where the window light falls nearest), a lit front edge, and its
 * shadow on the floor. Decorative. Shared by the homepage hero and the preloader, so the page
 * opens onto the same table.
 */
export function Tabletop({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="relative h-40 overflow-hidden bg-linear-to-b from-illo-table-back to-illo-table-front lg:h-64">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
          <g stroke="var(--illo-table-grain)" fill="none" vectorEffect="non-scaling-stroke">
            {seams.map((x) => (
              <line key={x} x1={x} y1="0" x2={front(x)} y2="100" strokeOpacity="0.28" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            ))}
            {grain.map((x) => (
              <path
                key={x}
                d={`M${x} 0 C${x + 6} 35 ${front(x) - 8} 65 ${front(x)} 100`}
                strokeOpacity="0.1"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
        </svg>
      </div>
      <div className="h-16 border-t-2 border-illo-table-bevel bg-linear-to-b from-illo-table-edge-top to-illo-table-edge-bottom lg:h-40" />
      <div className="h-16 bg-bg-page lg:h-24">
        <div className="h-full bg-linear-to-b from-illo-table-shadow to-transparent" />
      </div>
    </div>
  );
}

