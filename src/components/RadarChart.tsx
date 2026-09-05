'use client';

import React, { useState } from 'react';

export interface RadarDataPoint {
  label: string;
  labelHi?: string;
  current: number; // 0 to 5
  target: number;  // 0 to 5
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  maxLevel?: number;
  className?: string;
  showLegend?: boolean;
}

export function RadarChart({
  data,
  size = 380,
  maxLevel = 5,
  className = '',
  showLegend = true,
}: RadarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length < 3) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        Radar chart requires at least 3 competencies
      </div>
    );
  }

  const center = size / 2;
  const radius = (size - 90) / 2; // Leave padding for labels
  const totalPoints = data.length;
  const angleStep = (Math.PI * 2) / totalPoints;

  // Function to calculate Cartesian coordinates from polar
  const getCoordinates = (value: number, index: number, maxVal = maxLevel) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top (-90 deg)
    const normalizedDist = (Math.min(Math.max(value, 0), maxVal) / maxVal) * radius;
    const x = center + normalizedDist * Math.cos(angle);
    const y = center + normalizedDist * Math.sin(angle);
    return { x, y };
  };

  // Generate background concentric polygons (L1 to L5)
  const gridLevels = Array.from({ length: maxLevel }, (_, i) => i + 1);

  // Generate SVG path for a polygon given a set of values
  const generatePolygonPath = (values: number[]) => {
    const points = values.map((val, idx) => {
      const { x, y } = getCoordinates(val, idx);
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  const targetPath = generatePolygonPath(data.map((d) => d.target));
  const currentPath = generatePolygonPath(data.map((d) => d.current));

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        className="overflow-visible"
        aria-label="Competency Radar Chart"
      >
        {/* Background Grid Polygons & Axis Rays */}
        {gridLevels.map((lvl) => {
          const points = data.map((_, idx) => {
            const { x, y } = getCoordinates(lvl, idx);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              key={`grid-${lvl}`}
              points={points}
              fill={lvl === maxLevel ? 'oklch(0.98 0.01 220)' : 'none'}
              stroke="currentColor"
              strokeWidth={1}
              className="text-slate-200 text-white"
            />
          );
        })}

        {/* Axis Rays */}
        {data.map((_, idx) => {
          const { x, y } = getCoordinates(maxLevel, idx);
          return (
            <line
              key={`ray-${idx}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth={1}
              strokeDasharray="2,2"
              className="text-slate-200 text-white"
            />
          );
        })}

        {/* Target Level Polygon (Dashed / Saffron/Amber tint) */}
        <polygon
          points={targetPath}
          fill="rgba(230, 126, 34, 0.12)"
          stroke="#E67E22"
          strokeWidth={2}
          strokeDasharray="4,4"
          className="transition-all duration-300"
        />

        {/* Current Level Polygon (Solid Primary Brand / Emerald) */}
        <polygon
          points={currentPath}
          fill="rgba(27, 94, 123, 0.25)"
          stroke="#1B5E7B"
          strokeWidth={2.5}
          className="transition-all duration-300"
        />

        {/* Data points (dots) on vertices */}
        {data.map((item, idx) => {
          const currentCoord = getCoordinates(item.current, idx);
          const targetCoord = getCoordinates(item.target, idx);
          const isHovered = hoveredIndex === idx;

          return (
            <g key={`points-${idx}`}>
              {/* Target point */}
              <circle
                cx={targetCoord.x}
                cy={targetCoord.y}
                r={3.5}
                fill="#E67E22"
                className="transition-transform duration-200"
              />
              {/* Current point */}
              <circle
                cx={currentCoord.x}
                cy={currentCoord.y}
                r={isHovered ? 6 : 4.5}
                fill="#1B5E7B"
                stroke="#ffffff"
                strokeWidth={2}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          );
        })}

        {/* Vertex Labels */}
        {data.map((item, idx) => {
          const angle = idx * angleStep - Math.PI / 2;
          const labelDist = radius + 24;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);

          // Alignment adjustments based on quadrant
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          if (Math.cos(angle) > 0.3) textAnchor = 'start';
          else if (Math.cos(angle) < -0.3) textAnchor = 'end';

          const isHovered = hoveredIndex === idx;

          return (
            <text
              key={`label-${idx}`}
              x={x}
              y={y + 4}
              textAnchor={textAnchor}
              className={`text-xs font-medium cursor-pointer transition-colors ${
                isHovered
                  ? 'fill-blue-700 fill-blue-600 font-semibold'
                  : 'fill-slate-700 fill-gray-600'
              }`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {item.label}
            </text>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredIndex !== null && data[hoveredIndex] && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white bg-gray-900 text-gray-900 px-3 py-1.5 rounded-lg text-xs shadow-lg pointer-events-none z-10 flex items-center gap-2 font-mono">
          <span className="font-sans font-medium">{data[hoveredIndex].label}:</span>
          <span>Current: L{data[hoveredIndex].current}</span>
          <span>/</span>
          <span className="text-amber-400 text-amber-500">Target: L{data[hoveredIndex].target}</span>
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-600 text-gray-500">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#1B5E7B]"></span>
            <span>Current Proficiency</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-dashed border-[#E67E22] bg-[#E67E22]/20"></span>
            <span>Role Target Level</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default RadarChart;
