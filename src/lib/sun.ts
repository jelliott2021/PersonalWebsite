/** Boston, MA. */
export const boston = { lat: 42.36, lon: -71.06 };

const rad = (degrees: number): number => (degrees * Math.PI) / 180;
const deg = (radians: number): number => (radians * 180) / Math.PI;

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
}

/**
 * Sunrise and sunset for one calendar day at a location, from the NOAA
 * sunrise equation. `day` is that date at midnight UTC. Accurate to a minute
 * or two, which is plenty for placing a sun in a drawing. Returns null in
 * polar day or night, which Boston never sees.
 */
export const sunTimes = (day: Date, lat: number, lon: number): SunTimes | null => {
  const julianDay = day.getTime() / 86_400_000 + 2_440_587.5;
  const n = Math.ceil(julianDay - 2_451_545.0 + 0.0008);
  const meanSolar = n - lon / 360;
  const anomaly = (357.5291 + 0.985_600_28 * meanSolar) % 360;
  const centre =
    1.9148 * Math.sin(rad(anomaly)) + 0.02 * Math.sin(rad(2 * anomaly)) + 0.0003 * Math.sin(rad(3 * anomaly));
  const longitude = (anomaly + centre + 180 + 102.9372) % 360;
  const transit =
    2_451_545.0 + meanSolar + 0.0053 * Math.sin(rad(anomaly)) - 0.0069 * Math.sin(rad(2 * longitude));
  const declination = Math.asin(Math.sin(rad(longitude)) * Math.sin(rad(23.4397)));
  const cosHourAngle =
    (Math.sin(rad(-0.833)) - Math.sin(rad(lat)) * Math.sin(declination)) /
    (Math.cos(rad(lat)) * Math.cos(declination));
  if (cosHourAngle < -1 || cosHourAngle > 1) {
    return null;
  }
  const hourAngle = deg(Math.acos(cosHourAngle));
  const toDate = (julian: number): Date => new Date((julian - 2_440_587.5) * 86_400_000);
  return {
    sunrise: toDate(transit - hourAngle / 360),
    sunset: toDate(transit + hourAngle / 360),
  };
};
