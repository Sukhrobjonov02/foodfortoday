import { useRef, useEffect, useCallback } from 'react';
import { motion, useAnimationControls, useMotionValue, useTransform } from 'framer-motion';
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
const RADIUS = WHEEL_SIZE / 2 - 10;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export function Wheel({ foods, onSpinComplete, isSpinning, onSpinStart }: WheelProps) {
  const controls = useAnimationControls();
  const cumulativeRotation = useRef(0);
  const lastSegmentIndex = useRef(-1);
  const segmentAngle = 360 / foods.length;

  const rotateValue = useMotionValue(0);
  const normalizedRotation = useTransform(rotateValue, (v) => ((v % 360) + 360) % 360);

  const triggerTickHaptic = useCallback(() => {
    try {
      WebApp.HapticFeedback.impactOccurred('light');
    } catch {}
  }, []);

  // Watch rotation and fire haptic on each segment boundary crossing
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
        duration: 4.5,
        ease: [0.15, 0.85, 0.25, 1],
      },
    });

    // Final heavy haptic when it stops
    try {
      WebApp.HapticFeedback.impactOccurred('heavy');
    } catch {}

    onSpinComplete(foods[winIndex]);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Pointer */}
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-[var(--tg-theme-button-color,#6c5ce7)] drop-shadow-md" />
        </div>

        <motion.div
          animate={controls}
          style={{ rotate: rotateValue }}
          className="rounded-full shadow-xl"
        >
          <svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
            {foods.map((food, i) => {
              const startAngle = i * segmentAngle;
              const endAngle = startAngle + segmentAngle;
              const midAngle = startAngle + segmentAngle / 2;
              const labelPos = polarToCartesian(CENTER, CENTER, RADIUS * 0.65, midAngle);
              const displayName = food.name.length > 10 ? food.name.slice(0, 10) + '...' : food.name;

              return (
                <g key={food.id}>
                  <path
                    d={describeArc(CENTER, CENTER, RADIUS, startAngle, endAngle)}
                    fill={getSegmentColor(i)}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    fontSize={foods.length > 8 ? 10 : 12}
                    fontWeight="600"
                    style={{
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      transform: `rotate(${midAngle}deg)`,
                      transformOrigin: `${labelPos.x}px ${labelPos.y}px`,
                    }}
                  >
                    {displayName}
                  </text>
                </g>
              );
            })}
            {/* Center circle */}
            <circle cx={CENTER} cy={CENTER} r={20} fill="#fff" stroke="#e0e0e0" strokeWidth="2" />
            <circle cx={CENTER} cy={CENTER} r={8} fill="var(--tg-theme-button-color, #6c5ce7)" />
          </svg>
        </motion.div>
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className="bg-[var(--tg-theme-button-color,#6c5ce7)] text-[var(--tg-theme-button-text-color,#fff)] px-10 py-4 rounded-2xl text-lg font-bold tracking-wide active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg"
      >
        {isSpinning ? 'Spinning...' : 'SPIN!'}
      </button>
    </div>
  );
}
