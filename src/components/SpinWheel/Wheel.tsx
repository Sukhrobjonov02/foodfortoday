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

const SIZE = 300;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_OUTER = SIZE / 2;
const R_WHEEL = R_OUTER - 10;
const R_HUB = SIZE * 0.09;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
}

function arcPath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const [x1, y1] = polar(cx, cy, r, a1);
  const [x2, y2] = polar(cx, cy, r, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

export function Wheel({ foods, onSpinComplete, isSpinning, onSpinStart }: WheelProps) {
  const controls = useAnimationControls();
  const cumulativeRotation = useRef(0);
  const lastSegmentIndex = useRef(-1);
  const step = 360 / foods.length;

  const rotateValue = useMotionValue(0);
  const normalizedRotation = useTransform(rotateValue, (v) => ((v % 360) + 360) % 360);

  const tickHaptic = useCallback(() => {
    try { WebApp.HapticFeedback.impactOccurred('light'); } catch {}
  }, []);

  useEffect(() => {
    const unsub = normalizedRotation.on('change', (v) => {
      const seg = Math.floor(v / step) % foods.length;
      if (seg !== lastSegmentIndex.current && lastSegmentIndex.current !== -1) {
        tickHaptic();
      }
      lastSegmentIndex.current = seg;
    });
    return unsub;
  }, [normalizedRotation, step, foods.length, tickHaptic]);

  const spin = async () => {
    if (isSpinning) return;
    onSpinStart();

    const pickIdx = Math.floor(Math.random() * foods.length);
    const extraRotations = 5 + Math.floor(Math.random() * 3);
    const segmentMiddle = pickIdx * step + step / 2;
    const delta = extraRotations * 360 + (360 - segmentMiddle);

    cumulativeRotation.current += delta;

    await controls.start({
      rotate: cumulativeRotation.current,
      transition: { duration: 5.2, ease: [0.12, 0.8, 0.18, 1] },
    });

    try { WebApp.HapticFeedback.impactOccurred('heavy'); } catch {}
    onSpinComplete(foods[pickIdx]);
  };

  const fontSize = Math.max(11, Math.min(16, SIZE / (foods.length * 1.1)));

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative" style={{ width: SIZE, height: SIZE + 24 }}>
        {/* soft ground shadow */}
        <div
          className="absolute blur-[8px]"
          style={{
            left: SIZE * 0.08,
            right: SIZE * 0.08,
            bottom: -2,
            height: 18,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.28), transparent 70%)',
            zIndex: 0,
          }}
        />

        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ position: 'relative', zIndex: 1, overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="bezel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f0ead8" />
              <stop offset="20%" stopColor="#d6cbae" />
              <stop offset="50%" stopColor="#b3a177" />
              <stop offset="80%" stopColor="#d6cbae" />
              <stop offset="100%" stopColor="#e8dec0" />
            </linearGradient>
          </defs>

          {/* outer bezel */}
          <circle cx={CX} cy={CY} r={R_OUTER} fill="url(#bezel)" />
          <circle cx={CX} cy={CY} r={R_OUTER - 1} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <circle cx={CX} cy={CY} r={R_WHEEL + 1.5} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />

          {/* rotating group */}
          <motion.g animate={controls} style={{ rotate: rotateValue, transformOrigin: `${CX}px ${CY}px` }}>
            {foods.map((food, i) => {
              const a1 = i * step;
              const a2 = (i + 1) * step;
              const [sepX, sepY] = polar(CX, CY, R_WHEEL, a1);
              return (
                <g key={food.id}>
                  <path d={arcPath(CX, CY, R_WHEEL, a1, a2)} fill={getSegmentColor(i)} />
                  <line
                    x1={CX}
                    y1={CY}
                    x2={sepX}
                    y2={sepY}
                    stroke="rgba(255,255,255,0.45)"
                    strokeWidth="1.2"
                  />
                </g>
              );
            })}

            {/* labels */}
            {foods.map((food, i) => {
              const mid = i * step + step / 2;
              const [tx, ty] = polar(CX, CY, R_WHEEL * 0.62, mid);
              const label = food.name.length > 12 ? food.name.slice(0, 11) + '…' : food.name;
              return (
                <g key={`l${food.id}`} transform={`translate(${tx} ${ty}) rotate(${mid})`}>
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="Geist, system-ui, sans-serif"
                    fontSize={fontSize}
                    fontWeight="700"
                    fill="#fff"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.35)', letterSpacing: '0.01em' }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </motion.g>

          {/* center hub - small white dot */}
          <circle cx={CX} cy={CY} r={R_HUB * 0.42} fill="#ffffff" />
          <circle cx={CX} cy={CY} r={R_HUB * 0.42} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1" />

          {/* pointer - classic triangle */}
          <g style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.25))' }}>
            <path
              d={`M ${CX - 14} ${CY - R_OUTER + 6} L ${CX + 14} ${CY - R_OUTER + 6} L ${CX} ${CY - R_OUTER + 32} Z`}
              fill="oklch(0.56 0.17 42)"
            />
            <path
              d={`M ${CX - 14} ${CY - R_OUTER + 6} L ${CX + 14} ${CY - R_OUTER + 6} L ${CX} ${CY - R_OUTER + 32} Z`}
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1"
            />
          </g>
        </svg>
      </div>

      {/* spin button */}
      <motion.button
        onClick={spin}
        disabled={isSpinning}
        whileTap={{ scale: 0.98 }}
        className={clsx(
          'flex items-center gap-2.5 px-10 py-4 rounded-[22px]',
          'text-[17px] font-bold uppercase tracking-[0.08em]',
          'transition-all',
          isSpinning
            ? 'bg-surface-alt text-muted shadow-none'
            : 'text-white'
        )}
        style={
          isSpinning
            ? undefined
            : {
                background:
                  'linear-gradient(180deg, oklch(0.68 0.18 55), oklch(0.56 0.17 42))',
                boxShadow:
                  '0 12px 30px oklch(0.68 0.18 55 / 0.4), 0 2px 0 oklch(0.56 0.17 42)',
              }
        }
      >
        {isSpinning ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" className="animate-[spin_1s_linear_infinite]">
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="14 28"
                strokeLinecap="round"
              />
            </svg>
            Spinning…
          </>
        ) : (
          <>
            Spin the wheel
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" />
            </svg>
          </>
        )}
      </motion.button>
    </div>
  );
}
