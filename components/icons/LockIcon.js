import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

export default function LockIcon({ size = 18, color = '#9CA3AF' }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <Rect
        x="4"
        y="10"
        width="16"
        height="10"
        rx="2.5"
        stroke={color}
        strokeWidth="1.8"
      />
      <Path
        d="M8 10V8.5A4 4 0 0 1 12 4a4 4 0 0 1 4 4V10"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}
