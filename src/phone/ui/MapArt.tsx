import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

/**
 * Hand-drawn vector city map in a 400×600 coordinate space.
 * Children are SVG nodes drawn on top (pins, routes, riders).
 */
export function MapArt({ children, className, idPrefix = 'm' }: { children?: ReactNode; className?: string; idPrefix?: string }) {
  const blocks = `${idPrefix}-blocks`;
  return (
    <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" className={cn('block h-full w-full', className)} aria-hidden>
      <defs>
        <pattern id={blocks} width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-4)">
          <rect x="3" y="3" width="20" height="20" rx="5" fill="#E4EADF" />
        </pattern>
      </defs>
      <rect width="400" height="600" fill="#EEF2E9" />
      <rect width="400" height="600" fill={`url(#${blocks})`} />

      {/* water */}
      <path d="M430 318C340 338 300 420 214 462C130 503 60 552-30 612" stroke="#CFE5F3" strokeWidth="74" fill="none" strokeLinecap="round" />
      <path d="M430 318C340 338 300 420 214 462C130 503 60 552-30 612" stroke="#BCDCEF" strokeWidth="2" strokeDasharray="2 10" fill="none" opacity=".8" />

      {/* parks */}
      <rect x="252" y="150" width="124" height="96" rx="26" fill="#D2EBC4" />
      <circle cx="292" cy="190" r="10" fill="#BFE2AE" />
      <circle cx="330" cy="214" r="14" fill="#BFE2AE" />
      <circle cx="58" cy="420" r="38" fill="#D2EBC4" />
      <circle cx="48" cy="410" r="9" fill="#BFE2AE" />

      {/* roads: casing then surface */}
      <g fill="none" strokeLinecap="round" stroke="#DCE3D6">
        <path d="M-20 120C120 100 260 140 420 118" strokeWidth="19" />
        <path d="M-20 330L420 300" strokeWidth="17" />
        <path d="M-20 520L420 540" strokeWidth="14" />
        <path d="M90-20L112 620" strokeWidth="15" />
        <path d="M225-20L238 620" strokeWidth="17" />
        <path d="M345-20L330 620" strokeWidth="14" />
      </g>
      <g fill="none" strokeLinecap="round" stroke="#FFFFFF">
        <path d="M-20 120C120 100 260 140 420 118" strokeWidth="15" />
        <path d="M-20 330L420 300" strokeWidth="13" />
        <path d="M-20 520L420 540" strokeWidth="10" />
        <path d="M90-20L112 620" strokeWidth="11" />
        <path d="M225-20L238 620" strokeWidth="13" />
        <path d="M345-20L330 620" strokeWidth="10" />
      </g>
      <path d="M-20 610C120 470 230 380 420 214" stroke="#F1D07A" strokeWidth="17" fill="none" strokeLinecap="round" />
      <path d="M-20 610C120 470 230 380 420 214" stroke="#FFE7A3" strokeWidth="13" fill="none" strokeLinecap="round" />

      {/* labels */}
      <g fill="#97A399" fontFamily="Urbanist Variable, sans-serif" fontWeight="700" fontSize="8.5" letterSpacing="1.4">
        <text x="40" y="326" transform="rotate(-3.9 40 326)">MARKET ST</text>
        <text x="236" y="112" transform="rotate(-4 236 112)">GREEN AVE</text>
        <text x="282" y="202" fill="#7FA673">CENTRAL PARK</text>
        <text x="250" y="458" fill="#8DB6CF" transform="rotate(-30 250 458)">HARBOR</text>
        <text x="244" y="280" transform="rotate(88 244 280)">OAK ST</text>
      </g>
      {children}
    </svg>
  );
}
