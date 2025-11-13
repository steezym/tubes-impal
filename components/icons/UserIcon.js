import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export default function UserIcon({ size = 18, color = '#9CA3AF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="7" r="3.5" stroke={color} strokeWidth="1.8" />
      <Path
        d="M4.5 19c1.8-3.2 4.6-4.8 7.5-4.8S17.7 15.8 19.5 19"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}
