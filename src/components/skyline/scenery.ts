/**
 * Static scenery for the Boston skyline drawing: where the sun and moon go,
 * which windows light up, and the timing of every snowflake, raindrop, gull,
 * car, glint, and cloud. Everything is computed once from a seeded noise
 * function so the scene is identical on every render and every visit.
 */

/** Stable pseudo-random value in [0, 1) so the lit pattern never reshuffles. */
export const noise = (n: number): number => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/** Rounds to one decimal place to keep SVG attributes short. */
export const round = (value: number): number => Math.round(value * 10) / 10;

export interface SkyPosition {
  isNight: boolean;
  x: number;
  y: number;
}

/**
 * Where the sun (sunrise to sunset) or moon (sunset to sunrise) sits in the
 * sky: an arc from the left horizon to the right, peaking in the middle.
 * Hours are fractional Boston hours.
 */
export const skyPosition = (hour: number, sunrise: number, sunset: number): SkyPosition => {
  const isNight = hour < sunrise || hour >= sunset;
  let t: number;
  if (isNight) {
    const nightLength = Math.max(1, 24 - sunset + sunrise);
    const sinceSunset = hour >= sunset ? hour - sunset : hour + 24 - sunset;
    t = Math.min(1, sinceSunset / nightLength);
  } else {
    t = (hour - sunrise) / Math.max(1, sunset - sunrise);
  }
  return {
    isNight,
    x: Math.round(120 + t * 1200),
    y: Math.round(150 - Math.sin(Math.PI * t) * 110),
  };
};

/** Tower facades that get lit windows: the face rectangle and its window grid. */
export const FACADES = [
  { x: 458, y: 76, w: 34, h: 72, cols: 2, rows: 4 }, // Custom House Tower
  { x: 520, y: 140, w: 45, h: 76, cols: 3, rows: 4 },
  { x: 570, y: 118, w: 55, h: 98, cols: 3, rows: 5 },
  { x: 630, y: 150, w: 40, h: 66, cols: 2, rows: 3 },
  { x: 675, y: 130, w: 32, h: 86, cols: 2, rows: 4 },
  { x: 810, y: 56, w: 60, h: 158, cols: 3, rows: 8 }, // Prudential Tower
  { x: 900, y: 66, w: 52, h: 148, cols: 3, rows: 7 }, // 200 Clarendon
];

export type WindowKind = 'lit' | 'twinkle' | 'dark';

export interface TowerWindow {
  x: number;
  y: number;
  kind: WindowKind;
  delay: number;
  duration: number;
}

/** Every window on every facade, with a stable lit/twinkle/dark assignment. */
export const WINDOWS: TowerWindow[] = FACADES.flatMap((facade, facadeIndex) => {
  const cellW = facade.w / facade.cols;
  const cellH = facade.h / facade.rows;
  const windows: TowerWindow[] = [];
  for (let row = 0; row < facade.rows; row += 1) {
    for (let col = 0; col < facade.cols; col += 1) {
      const seed = facadeIndex * 100 + row * facade.cols + col;
      const roll = noise(seed);
      let kind: WindowKind = 'lit';
      if (roll < 0.18) {
        kind = 'dark';
      } else if (roll < 0.5) {
        kind = 'twinkle';
      }
      windows.push({
        x: round(facade.x + cellW * col + cellW / 2 - 1.5),
        y: round(facade.y + cellH * row + cellH / 2 - 2),
        kind,
        delay: round(noise(seed + 7) * 6),
        duration: round(3 + noise(seed + 13) * 4),
      });
    }
  }
  return windows;
});

/** Snowflakes: where each starts, how big it is, and how it falls. */
export const FLAKES = Array.from({ length: 48 }, (_, i) => ({
  x: Math.round(noise(i * 3 + 1) * 1440),
  r: round(1.1 + noise(i * 3 + 2) * 1.6),
  duration: round(9 + noise(i * 3 + 3) * 8),
  delay: round(noise(i * 7 + 5) * -17),
  sway: Math.round((noise(i * 5 + 4) - 0.5) * 60),
}));

/** Raindrops: slanted streaks that fall fast. */
export const DROPS = Array.from({ length: 40 }, (_, i) => ({
  x: Math.round(noise(i * 3 + 11) * 1480),
  length: Math.round(9 + noise(i * 3 + 12) * 10),
  duration: round(0.9 + noise(i * 3 + 13) * 0.7),
  delay: round(noise(i * 7 + 15) * -1.6),
}));

/**
 * Gulls crossing the sky: height, size, where in their flight they start,
 * and an offset into the wing-beat cycle so they don't flap in unison.
 */
export const GULLS = [
  { y: 50, scale: 1, duration: 44, delay: -12, beat: 0 },
  { y: 72, scale: 0.8, duration: 38, delay: -27, beat: -1.1 },
  { y: 42, scale: 0.9, duration: 52, delay: -40, beat: -2.2 },
];

/** Cars on the Zakim deck: direction and timing. */
export const CARS = [
  { back: false, duration: 14, delay: 0 },
  { back: false, duration: 17, delay: -7 },
  { back: true, duration: 15, delay: -3 },
  { back: true, duration: 19, delay: -11 },
];

/** Sun glints on the harbor water. */
export const GLINTS = Array.from({ length: 9 }, (_, i) => ({
  x: 1160 + i * 32 + Math.round(noise(i + 40) * 14),
  delay: round(noise(i + 50) * -3),
  duration: round(2.4 + noise(i + 60) * 2),
}));

/** Cloud banks: position, scale, and drift offset. */
export const CLOUDS = [
  { x: 170, y: 72, scale: 1, delay: 0 },
  { x: 620, y: 38, scale: 1.35, delay: -30 },
  { x: 1090, y: 84, scale: 0.9, delay: -60 },
];
