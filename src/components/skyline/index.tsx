import { CSSProperties, useId } from 'react';
import useBostonTime from '../../hooks/useBostonTime';
import useBostonWeather from '../../hooks/useBostonWeather';
import { CARS, CLOUDS, DROPS, FLAKES, GLINTS, GULLS, WINDOWS, skyPosition } from './scenery';
import './index.css';

export { skyPosition } from './scenery';

interface SkylineProps {
  className?: string;
}

/**
 * Simplified Boston skyline silhouette, drawn left to right: the Zakim
 * Bridge, Bunker Hill Monument, Custom House Tower, the Financial District,
 * Old North Church, the Prudential Tower, 200 Clarendon, Back Bay rowhouses,
 * and a couple of sailboats on the harbor. It keeps Boston time: a sun or
 * moon crosses the sky by the hour, the boats drift, and in dark mode the
 * tower windows light up and twinkle. It also wears Boston's live weather:
 * clouds, fog, rain, snow, or a storm. Decorative only; the silhouette
 * inherits `currentColor`.
 */
const Skyline = ({ className = '' }: SkylineProps) => {
  const { hour, sunrise, sunset } = useBostonTime();
  const sky = skyPosition(hour, sunrise, sunset);
  const condition = useBostonWeather()?.condition;
  // The skyline is drawn twice on the page, so gradient ids must not collide.
  const gradientId = useId().replace(/:/g, '');
  const beamId = `beam-${gradientId}`;
  const flareId = `flare-${gradientId}`;
  const haloId = `halo-${gradientId}`;
  const moonId = `moon-${gradientId}`;

  const cloudy = condition !== undefined && condition !== 'clear';
  const raining = condition === 'rain' || condition === 'storm';
  const classes = ['skyline', condition ? `skyline--${condition}` : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      className={classes}
      viewBox='0 0 1440 220'
      preserveAspectRatio='xMidYMax meet'
      aria-hidden='true'
      focusable='false'>
      <defs>
        <radialGradient id={haloId}>
          <stop offset='0' stopColor='#f6c15a' stopOpacity='0.45' />
          <stop offset='1' stopColor='#f6c15a' stopOpacity='0' />
        </radialGradient>
        {/* A second circle cut out of the first makes the crescent. */}
        <mask id={moonId}>
          <circle cx={sky.x} cy={sky.y} r='11' fill='#fff' />
          <circle cx={sky.x + 5.5} cy={sky.y - 3} r='9.5' fill='#000' />
        </mask>
        {/* Boston Light's beam and flare, shown in dark mode. */}
        <linearGradient id={beamId} x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0' stopColor='#ffe9b3' stopOpacity='0.55' />
          <stop offset='1' stopColor='#ffe9b3' stopOpacity='0' />
        </linearGradient>
        <radialGradient id={flareId}>
          <stop offset='0' stopColor='#fff6dc' stopOpacity='0.9' />
          <stop offset='0.35' stopColor='#ffe9b3' stopOpacity='0.35' />
          <stop offset='1' stopColor='#ffe9b3' stopOpacity='0' />
        </radialGradient>
      </defs>

      {sky.isNight ? (
        <circle className='skyline__moon' cx={sky.x} cy={sky.y} r='11' mask={`url(#${moonId})`} />
      ) : (
        <>
          <circle className='skyline__halo' cx={sky.x} cy={sky.y} r='34' fill={`url(#${haloId})`} />
          <circle className='skyline__sun' cx={sky.x} cy={sky.y} r='13' />
        </>
      )}

      {cloudy && (
        <g className='skyline__clouds'>
          {CLOUDS.map(cloud => (
            <g key={cloud.x} transform={`translate(${cloud.x} ${cloud.y}) scale(${cloud.scale})`}>
              <g className='skyline__cloud' style={{ animationDelay: `${cloud.delay}s` }}>
                <ellipse cx='0' cy='0' rx='44' ry='12' />
                <ellipse cx='-24' cy='4' rx='26' ry='10' />
                <ellipse cx='26' cy='3' rx='30' ry='11' />
              </g>
            </g>
          ))}
        </g>
      )}

      {/* Slow traffic behind the city: a ferry, a rowing shell, and a plane descending toward Logan */}
      <g className='skyline__traffic'>
        <g className='skyline__ferry'>
          <polygon points='1400,214 1462,214 1456,206 1406,206' />
          <rect x='1412' y='198' width='36' height='8' rx='1' />
          <rect x='1418' y='193' width='14' height='5' rx='1' />
          <rect x='1440' y='194' width='3' height='4' />
        </g>
        <g className='skyline__shell'>
          <polygon points='1226,213 1288,213 1292,211 1222,211' />
          <rect x='1254' y='205' width='3' height='6' rx='1' />
          <g className='skyline__oars'>
            <rect x='1243' y='208' width='11' height='1' />
            <rect x='1257' y='208' width='11' height='1' />
          </g>
        </g>
        <g className='skyline__plane'>
          <rect x='0' y='0.4' width='12' height='1.6' rx='0.8' />
          <polygon points='4,1.2 7.5,1.2 5.5,4.4' />
          <polygon points='4,1.2 7.5,1.2 5.5,-2' />
          <polygon points='0,1.2 2.2,1.2 0,-1.2' />
          <circle className='skyline__beacon' cx='12.6' cy='1.2' r='1' />
          <circle className='skyline__strobe' cx='5.5' cy='-2' r='0.9' />
        </g>
      </g>

      <g className='skyline__city' fill='currentColor'>
        {/* Zakim Bridge deck, towers, and masts */}
        <rect x='20' y='186' width='290' height='5' />
        <polygon points='100,220 107,100 113,100 120,220' />
        <rect x='108.5' y='62' width='3' height='40' />
        <polygon points='205,220 212,100 218,100 225,220' />
        <rect x='213.5' y='62' width='3' height='40' />

        {/* Bunker Hill Monument */}
        <polygon points='325,220 341,220 337,108 333,98 329,108' />

        {/* Charlestown and North End low-rise */}
        <rect x='355' y='178' width='30' height='42' />
        <rect x='390' y='168' width='25' height='52' />
        <rect x='418' y='185' width='20' height='35' />

        {/* Custom House Tower */}
        <rect x='440' y='150' width='70' height='70' />
        <rect x='458' y='70' width='34' height='80' />
        <polygon points='456,70 494,70 475,40' />
        <rect x='473' y='32' width='4' height='8' />

        {/* Financial District */}
        <rect x='520' y='135' width='45' height='85' />
        <rect x='570' y='112' width='55' height='108' />
        <rect x='630' y='145' width='40' height='75' />
        <rect x='675' y='125' width='32' height='95' />
        <rect x='712' y='160' width='28' height='60' />

        {/* Old North Church */}
        <rect x='745' y='175' width='36' height='45' />
        <rect x='753' y='120' width='20' height='55' />
        <polygon points='751,120 775,120 763,72' />

        {/* Prudential Tower */}
        <rect x='810' y='48' width='60' height='172' />
        <rect x='828' y='42' width='24' height='6' />
        <rect x='838' y='18' width='4' height='30' />

        {/* 200 Clarendon */}
        <polygon points='898,220 898,58 954,50 954,220' />

        {/* Back Bay rowhouses */}
        <rect x='985' y='165' width='26' height='55' />
        <polygon points='985,165 1011,165 998,153' />
        <rect x='1013' y='172' width='26' height='48' />
        <polygon points='1013,172 1039,172 1026,160' />
        <rect x='1041' y='168' width='26' height='52' />
        <polygon points='1041,168 1067,168 1054,156' />
        <rect x='1069' y='175' width='26' height='45' />
        <polygon points='1069,175 1095,175 1082,163' />
        <rect x='1097' y='170' width='26' height='50' />
        <polygon points='1097,170 1123,170 1110,158' />

        {/* Harbor, with Boston Light on its islet */}
        <rect x='1150' y='206' width='290' height='2' />
        <polygon points='1150,220 1158,212 1170,209 1190,209 1204,213 1212,220' />
        <polygon points='1173,209 1187,209 1185,170 1175,170' />
        <rect x='1172' y='164' width='16' height='6' />
        <rect x='1176' y='156' width='8' height='8' />
        <polygon points='1174,156 1186,156 1180,150' />
        <g className='skyline__boat'>
          <polygon points='1250,204 1300,204 1290,214 1258,214' />
          <rect x='1273' y='150' width='2' height='54' />
          <polygon points='1276,152 1276,202 1298,202' />
          <polygon points='1271,160 1271,202 1253,202' />
        </g>
        <g className='skyline__boat skyline__boat--small'>
          <polygon points='1380,208 1412,208 1406,214 1385,214' />
          <rect x='1394' y='175' width='2' height='33' />
          <polygon points='1397,177 1397,206 1411,206' />
        </g>

        {/* Ground line */}
        <rect x='0' y='218' width='1440' height='2' />
      </g>

      {/* Zakim cables */}
      <path
        className='skyline__cables'
        d='M110 66 L40 186 M110 66 L62 186 M110 66 L84 186 M110 66 L136 186 M110 66 L158 186 M110 66 L180 186 M215 66 L145 186 M215 66 L167 186 M215 66 L189 186 M215 66 L241 186 M215 66 L263 186 M215 66 L285 186'
        stroke='currentColor'
        strokeWidth='1.2'
        fill='none'
      />

      {/* Daytime life: gulls over the city, cars on the Zakim deck, and sun on the water */}
      <g className='skyline__gulls'>
        {GULLS.map(gull => (
          <g key={gull.y} transform={`translate(0 ${gull.y}) scale(${gull.scale})`}>
            <g
              className='skyline__gull'
              style={{ animationDuration: `${gull.duration}s`, animationDelay: `${gull.delay}s` }}>
              <path
                className='skyline__wing skyline__wing--left'
                d='M0 0 q-3.5 -3.5 -7 -0.5'
                style={{ animationDelay: `${gull.beat}s` }}
              />
              <path
                className='skyline__wing skyline__wing--right'
                d='M0 0 q3.5 -3.5 7 -0.5'
                style={{ animationDelay: `${gull.beat}s` }}
              />
            </g>
          </g>
        ))}
      </g>
      <g className='skyline__cars'>
        {CARS.map(car => (
          <rect
            key={`${car.back}-${car.duration}`}
            className={`skyline__car ${car.back ? 'skyline__car--back' : ''}`.trim()}
            x='22'
            y='183'
            width='6'
            height='2.2'
            rx='0.6'
            style={{ animationDuration: `${car.duration}s`, animationDelay: `${car.delay}s` }}
          />
        ))}
      </g>
      {!sky.isNight && (
        <g className='skyline__glints'>
          {GLINTS.map(glint => (
            <rect
              key={glint.x}
              className='skyline__glint'
              x={glint.x}
              y='209'
              width='6'
              height='1.2'
              rx='0.6'
              style={{ animationDuration: `${glint.duration}s`, animationDelay: `${glint.delay}s` }}
            />
          ))}
        </g>
      )}

      {/* Boston Light's lantern and beam, shown in dark mode. The beacon turns
          like the real one: the beam sweeps right along the horizon, swings
          toward the viewer and flares, sweeps left, dims as it turns away. */}
      <polygon
        className='skyline__beam'
        points='1180,160 1420,146 1420,174'
        fill={`url(#${beamId})`}
      />
      <circle className='skyline__flare' cx='1180' cy='160' r='36' fill={`url(#${flareId})`} />
      <circle className='skyline__lantern' cx='1180' cy='160' r='2.6' />

      {/* Lit windows, shown in dark mode */}
      <g className='skyline__windows'>
        {WINDOWS.map(window => (
          <rect
            key={`${window.x}-${window.y}`}
            className={`skyline__window skyline__window--${window.kind}`}
            x={window.x}
            y={window.y}
            width='3'
            height='4'
            style={{ animationDelay: `${window.delay}s`, animationDuration: `${window.duration}s` }}
          />
        ))}
      </g>

      {/* Weather over the city */}
      {condition === 'fog' && (
        <rect className='skyline__fog' x='0' y='90' width='1440' height='130' />
      )}
      {condition === 'snow' && (
        <g className='skyline__snow'>
          {FLAKES.map(flake => (
            <circle
              key={`${flake.x}-${flake.r}`}
              className='skyline__flake'
              cx={flake.x}
              cy='0'
              r={flake.r}
              style={
                {
                  'animationDuration': `${flake.duration}s`,
                  'animationDelay': `${flake.delay}s`,
                  '--sway': `${flake.sway}px`,
                } as CSSProperties
              }
            />
          ))}
        </g>
      )}
      {raining && (
        <g className='skyline__rain'>
          {DROPS.map(drop => (
            <line
              key={`${drop.x}-${drop.length}`}
              className='skyline__drop'
              x1={drop.x}
              y1='0'
              x2={drop.x - 3}
              y2={drop.length}
              style={{ animationDuration: `${drop.duration}s`, animationDelay: `${drop.delay}s` }}
            />
          ))}
        </g>
      )}
      {condition === 'storm' && (
        <rect className='skyline__lightning' x='0' y='0' width='1440' height='220' />
      )}
    </svg>
  );
};

export default Skyline;
