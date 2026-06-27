import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Line, Arc } from 'react-native-svg';
import { Colors } from '../theme/colors';

interface Props {
  equipped: string;
  size?: number;
}

export function PlayerAvatar({ equipped, size = 72 }: Props) {
  const r = size / 2;
  const headRadius = size / 3.5;
  const cx = r;
  const cy = r;

  // Eye positions
  const eyeOffX = size * 0.097;
  const eyeOffY = size * 0.042;
  const eyeR = size * 0.042;

  // Smile arc
  const smileW = size * 0.167;
  const smileH = size * 0.083;
  const smileX = cx - smileW / 2;
  const smileY = cy + size * 0.028;

  // Hair arc
  const hairR = headRadius;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={size} height={size}>
        {/* Shadow */}
        <Circle cx={cx} cy={cy} r={headRadius + 2} fill="rgba(0,0,0,0.12)" />

        {/* Head (skin) */}
        <Circle cx={cx} cy={cy} r={headRadius} fill="#FFD180" />

        {/* Eyes */}
        <Circle cx={cx - eyeOffX} cy={cy - eyeOffY} r={eyeR} fill={Colors.boldPrimaryText} />
        <Circle cx={cx + eyeOffX} cy={cy - eyeOffY} r={eyeR} fill={Colors.boldPrimaryText} />

        {/* Smile */}
        <Path
          d={`M ${smileX} ${smileY + smileH / 2} A ${smileW / 2} ${smileH / 2} 0 0 0 ${smileX + smileW} ${smileY + smileH / 2}`}
          stroke="#D84315"
          strokeWidth={size * 0.028}
          fill="none"
          strokeLinecap="round"
        />

        {/* Hair */}
        <Path
          d={`M ${cx - hairR} ${cy} A ${hairR} ${hairR * 0.75} 0 0 1 ${cx + hairR} ${cy}`}
          fill="#5D4037"
        />

        {/* Accessories */}
        {equipped === 'crown' && (
          <>
            <Path
              d={`M ${cx - 14} ${cy - 12} L ${cx - 18} ${cy - 25} L ${cx - 8} ${cy - 19} L ${cx} ${cy - 29} L ${cx + 8} ${cy - 19} L ${cx + 18} ${cy - 25} L ${cx + 14} ${cy - 12} Z`}
              fill={Colors.boldGold}
            />
            <Circle cx={cx} cy={cy - 29} r={3} fill="#E040FB" />
            <Circle cx={cx - 18} cy={cy - 25} r={3} fill="#00E5FF" />
            <Circle cx={cx + 18} cy={cy - 25} r={3} fill="#00E5FF" />
          </>
        )}

        {equipped === 'wings' && (
          <>
            <Path
              d={`M ${cx - headRadius - 2} ${cy} Q ${cx - headRadius - 16} ${cy - 16} ${cx - headRadius - 18} ${cy + 12} Q ${cx - headRadius - 10} ${cy + 4} ${cx - headRadius - 2} ${cy}`}
              fill={Colors.boldMagenta}
            />
            <Path
              d={`M ${cx + headRadius + 2} ${cy} Q ${cx + headRadius + 16} ${cy - 16} ${cx + headRadius + 18} ${cy + 12} Q ${cx + headRadius + 10} ${cy + 4} ${cx + headRadius + 2} ${cy}`}
              fill={Colors.boldMagenta}
            />
          </>
        )}

        {equipped === 'shield' && (
          <>
            <Path
              d={`M ${cx + 14} ${cy + 4} L ${cx + 28} ${cy + 8} L ${cx + 28} ${cy + 22} Q ${cx + 28} ${cy + 30} ${cx + 21} ${cy + 34} Q ${cx + 14} ${cy + 30} ${cx + 14} ${cy + 22} Z`}
              fill={Colors.boldCyan}
            />
            <Line
              x1={cx + 21} y1={cy + 10}
              x2={cx + 21} y2={cy + 30}
              stroke="white"
              strokeWidth={2}
            />
          </>
        )}

        {equipped === 'staff' && (
          <>
            <Line
              x1={cx - 22} y1={cy + 26}
              x2={cx - 14} y2={cy - 20}
              stroke="#8D6E63"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Circle cx={cx - 13} cy={cy - 22} r={6} fill={Colors.boldEmerald} />
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Colors.boldPrimaryContainer,
    borderWidth: 2,
    borderColor: Colors.boldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
