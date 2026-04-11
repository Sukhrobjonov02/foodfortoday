import { useRef, useEffect, useCallback } from 'react';
import { motion, useAnimationControls, useMotionValue, useTransform } from 'framer-motion';
import clsx from 'clsx';
import type { FoodItem } from '../../types';
import { getSegmentColor } from '../../utils/colors';
import WebApp from '@twa-dev/sdk';

interface WheelProps {
  foods: FoodItem[];
  onSpinComplete: (food: FoodItem) => void;
  isSpinning: boolean;
  onSpinStart: () => void;
}

const WHEEL_SIZE = 300;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = 125;
const OUTER_RING_WIDTH = 12;
const OUTER_RADIUS = RADIUS + OUTER_RING_WIDTH;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function Wheel({ foods, onSpinComplete, isSpinning, onSpinStart }: WheelProps) {
  const controls = useAnimationControls();
  const cumulativeRotation = useRef(0);
  const lastSegmentIndex = useRef(-1);
  const segmentAngle = 360 / foods.length;

  const rotateValue = useMotionValue(0);
  const normalizedRotation = useTransform(rotateValue, (v) => ((v % 360) + 360) % 360);

  const triggerTickHaptic = useCallback(() => {
    try { WebApp.HapticFeedback.impactOccurred('light'); } catch {}
  }, []);

  useEffect(() => {
    const unsubscribe = normalizedRotation.on('change', (v) => {
      const currentSegment = Math.floor(v / segmentAngle) % foods.length;
      if (currentSegment !== lastSegmentIndex.current && lastSegmentIndex.current !== -1) {
        triggerTickHaptic();
      }
      lastSegmentIndex.current = currentSegment;
    });
    return unsubscribe;
  }, [normalizedRotation, segmentAngle, foods.length, triggerTickHaptic]);

  const spin = async () => {
    if (isSpinning) return;
    onSpinStart();

    const winIndex = Math.floor(Math.random() * foods.length);
    const extraRotations = 5 + Math.floor(Math.random() * 4);
    const segmentMiddle = winIndex * segmentAngle + segmentAngle / 2;
    const targetAngle = extraRotations * 360 + (360 - segmentMiddle);

    cumulativeRotation.current += targetAngle;

    await controls.start({
      rotate: cumulativeRotation.current,
      transition: {
        duration: 5,
        ease: [0.12, 0.8, 0.18, 1],
      },
    });

    try { WebApp.HapticFeedback.impactOccurred('heavy'); } catch {}
    onSpinComplete(foods[winIndex]);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}>
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
          <svg width="28" height="32" viewBox="0 0 28 32">
            <defs>
              <linearGradient id="pointer-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--tg-theme-button-color, #6c5ce7)" />
                <stop offset="100%" stopColor="var(--tg-theme-button-color, #5a4bd1)" />
              </linearGradient>
            </defs>
            <path d="M14 0 L26 28 Q14 24 2 28 Z" fill="url(#pointer-grad)" />
          </svg>
        </div>

        <motion.div
          animate={controls}
          style={{ rotate: rotateValue }}
          className="rounded-full"
        >
          <svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
            <defs>
              {/* Segment gradients */}
              {foods.map((_, i) => {
                const baseColor = getSegmentColor(i);
                const darkColor = darkenColor(baseColor, 20);
                const midAngle = (i * segmentAngle + segmentAngle / 2 - 90) * Math.PI / 180;
                const x1 = 0.5 + 0.5 * Math.cos(midAngle);
                const y1 = 0.5 + 0.5 * Math.sin(midAngle);
                return (
                  <linearGradient key={i} id={`seg-${i}`} x1={1 - x1} y1={1 - y1} x2={x1} y2={y1}>
                    <stop offset="0%" stopColor={baseColor} />
                    <stop offset="100%" stopColor={darkColor} />
                  </linearGradient>
                );
              })}
              {/* Metallic ring gradient */}
              <linearGradient id="metal-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e8e8e8" />
                <stop offset="25%" stopColor="#f5f5f5" />
                <stop offset="50%" stopColor="#d0d0d0" />
                <stop offset="75%" stopColor="#f0f0f0" />
                <stop offset="100%" stopColor="#c8c8c8" />
              </linearGradient>
              {/* Center hub gradient */}
              <radialGradient id="hub-outer">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e0e0e0" />
              </radialGradient>
              <radialGradient id="hub-inner">
                <stop offset="0%" stopColor="var(--tg-theme-button-color, #7c6cf7)" />
                <stop offset="100%" stopColor="var(--tg-theme-button-color, #5a4bd1)" />
              </radialGradient>
              {/* Drop shadow filter */}
              <filter id="hub-shadow">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.2" />
              </filter>
            </defs>

            {/* Metallic outer ring */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={OUTER_RADIUS}
              fill="none"
              stroke="url(#metal-ring)"
              strokeWidth={OUTER_RING_WIDTH}
            />
            {/* Ring inner border */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS + 1}
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1"
            />

            {/* Segments */}
            {foods.map((food, i) => {
              const startAngle = i * segmentAngle;
              const endAngle = startAngle + segmentAngle;
              const midAngle = startAngle + segmentAngle / 2;
              const labelPos = polarToCartesian(CENTER, CENTER, RADIUS * 0.6, midAngle);
              const displayName = food.name.length > 10 ? food.name.slice(0, 10) + '...' : food.name;

              return (
                <g key={food.id}>
                  <path
                    d={describeArc(CENTER, CENTER, RADIUS, startAngle, endAngle)}
                    fill={`url(#seg-${i})`}
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    fontSize={foods.length > 8 ? 9 : foods.length > 5 ? 11 : 12}
                    fontWeight="600"
                    style={{
                      textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                      transform: `rotate(${midAngle}deg)`,
                      transformOrigin: `${labelPos.x}px ${labelPos.y}px`,
                    }}
                  >
                    {displayName}
                  </text>
                </g>
              );
            })}

            {/* Center hub — layered */}
            <circle cx={CENTER} cy={CENTER} r={24} fill="url(#hub-outer)" filter="url(#hub-shadow)" />
            <circle cx={CENTER} cy={CENTER} r={20} fill="#fff" stroke="#e8e8e8" strokeWidth="1" />
            <circle cx={CENTER} cy={CENTER} r={10} fill="url(#hub-inner)" />
          </svg>
        </motion.div>
      </div>

      {/* Spin button */}
      <motion.button
        onClick={spin}
        disabled={isSpinning}
        whileTap={{ scale: 0.95 }}
        className={clsx(
          'px-12 py-4 rounded-2xl text-lg font-bold tracking-wide',
          'shadow-lg transition-all',
          'bg-[var(--tg-theme-button-color,#6c5ce7)]',
          'text-[var(--tg-theme-button-text-color,#fff)]',
          'shadow-[var(--tg-theme-button-color,#6c5ce7)]/30',
          isSpinning && 'opacity-50 scale-100'
        )}
      >
        {isSpinning ? 'Spinning...' : 'SPIN!'}
      </motion.button>
    </div>
  );
}
