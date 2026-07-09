"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";

/**
 * WorldCupEmblem — A custom football-inspired emblem with animated glow,
 * rotation, and particle effects. Uses pure SVG + CSS animations.
 * This is a placeholder emblem, NOT the official FIFA logo.
 */
export default function WorldCupEmblem() {
  const controls = useAnimationControls();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cinematic entrance: scale up + rotate + glow burst
    controls.start({
      scale: [0, 1.1, 1],
      rotate: [180, -10, 0],
      opacity: [0, 1],
      transition: {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 0.6 },
      },
    });
  }, [controls]);

  return (
    <motion.div
      ref={containerRef}
      animate={controls}
      initial={{ scale: 0, rotate: 180, opacity: 0 }}
      className="relative inline-flex items-center justify-center"
      role="img"
      aria-label="StadiumMind AI World Cup inspired emblem"
    >
      {/* Outer glow ring */}
      <div className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full animate-emblem-glow" />

      {/* Particle ring */}
      <div className="absolute w-48 h-48 md:w-64 md:h-64">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold-400"
            style={{
              top: `${Math.round((50 + 48 * Math.sin((i * 30 * Math.PI) / 180)) * 100) / 100}%`,
              left: `${Math.round((50 + 48 * Math.cos((i * 30 * Math.PI) / 180)) * 100) / 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main emblem */}
      <div className="relative w-28 h-28 md:w-40 md:h-40 animate-emblem-rotate">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_0_30px_rgba(240,201,41,0.4)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="emblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fad415" />
              <stop offset="50%" stopColor="#f0c929" />
              <stop offset="100%" stopColor="#c99f0f" />
            </linearGradient>
            <linearGradient
              id="emblemGrad2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <filter id="emblemGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer shield shape */}
          <path
            d="M100 10 L180 45 L180 130 Q180 170 100 195 Q20 170 20 130 L20 45 Z"
            fill="none"
            stroke="url(#emblemGrad)"
            strokeWidth="2.5"
            opacity="0.6"
            filter="url(#emblemGlow)"
          />

          {/* Inner shield */}
          <path
            d="M100 22 L170 52 L170 125 Q170 162 100 183 Q30 162 30 125 L30 52 Z"
            fill="rgba(5,5,16,0.8)"
            stroke="url(#emblemGrad)"
            strokeWidth="1"
            opacity="0.9"
          />

          {/* Football / Soccer ball pattern */}
          <g transform="translate(100, 95)" filter="url(#emblemGlow)">
            {/* Central pentagon */}
            <polygon
              points="0,-28 26.6,-8.7 16.4,22.7 -16.4,22.7 -26.6,-8.7"
              fill="none"
              stroke="url(#emblemGrad)"
              strokeWidth="2"
            />
            {/* Hexagon lines radiating from pentagon */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle1 = ((i * 72 - 90) * Math.PI) / 180;
              const angle2 = (((i + 1) * 72 - 90) * Math.PI) / 180;
              const midAngle = ((i * 72 + 36 - 90) * Math.PI) / 180;
              const innerR = 28;
              const outerR = 42;
              const x1 = innerR * Math.cos(angle1);
              const y1 = innerR * Math.sin(angle1);
              const x2 = innerR * Math.cos(angle2);
              const y2 = innerR * Math.sin(angle2);
              const mx = outerR * Math.cos(midAngle);
              const my = outerR * Math.sin(midAngle);
              return (
                <g key={i}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={mx}
                    y2={my}
                    stroke="url(#emblemGrad)"
                    strokeWidth="1.5"
                    opacity="0.7"
                  />
                  <line
                    x1={x2}
                    y1={y2}
                    x2={mx}
                    y2={my}
                    stroke="url(#emblemGrad)"
                    strokeWidth="1.5"
                    opacity="0.7"
                  />
                </g>
              );
            })}
            {/* Outer circle */}
            <circle
              cx="0"
              cy="0"
              r="44"
              fill="none"
              stroke="url(#emblemGrad)"
              strokeWidth="1.5"
              opacity="0.4"
            />
          </g>

          {/* "SM" text inside emblem */}
          <text
            x="100"
            y="155"
            textAnchor="middle"
            fill="url(#emblemGrad)"
            fontSize="18"
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
            letterSpacing="3"
            filter="url(#emblemGlow)"
          >
            SM
          </text>

          {/* Stars above */}
          {[0, 1, 2, 3, 4].map((i) => (
            <polygon
              key={i}
              points={`${60 + i * 20},38 ${62 + i * 20},32 ${64 + i * 20},38 ${60 + i * 20},34 ${64 + i * 20},34`}
              fill="url(#emblemGrad)"
              opacity="0.8"
            />
          ))}
        </svg>
      </div>

      {/* Reflection effect */}
      <div className="absolute bottom-0 w-28 md:w-40 h-14 md:h-20 bg-gradient-to-t from-gold-500/10 to-transparent rounded-b-full blur-sm" />
    </motion.div>
  );
}
