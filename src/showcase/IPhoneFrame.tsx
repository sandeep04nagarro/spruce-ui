import type { ReactNode } from 'react';
import { MockFrame, type DeviceColor } from 'react-mockframe';
import { FRAME_H, FRAME_W } from '../lib/utils';

export type FrameColor = DeviceColor<'iPhone 17'>;

export const FRAME_COLORS: Array<{ id: FrameColor; label: string; swatch: string }> = [
  { id: 'sage', label: 'Sage', swatch: '#A9B89A' },
  { id: 'black', label: 'Black', swatch: '#2A2A2C' },
  { id: 'white', label: 'White', swatch: '#ECEBE6' },
  { id: 'mist-blue', label: 'Mist Blue', swatch: '#A9BFD3' },
  { id: 'lavender', label: 'Lavender', swatch: '#C9BEE0' },
  { id: 'cosmic-orange', label: 'Cosmic Orange', swatch: '#E8793A' },
  { id: 'deep-blue', label: 'Deep Blue', swatch: '#2E3E5C' },
];

/**
 * iPhone 17 hardware frame (react-mockframe, MIT) scaled as a block so it
 * takes up its scaled size in layout. The Dynamic Island is rendered by the
 * app itself so it can morph into live activities.
 */
export function IPhoneFrame({ scale, color, children, className }: { scale: number; color: FrameColor; children: ReactNode; className?: string }) {
  return (
    <div className={className} style={{ width: FRAME_W * scale, height: FRAME_H * scale }}>
      <div style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
        <MockFrame device="iPhone 17" color={color} hideNotch>
          {children}
        </MockFrame>
      </div>
    </div>
  );
}
