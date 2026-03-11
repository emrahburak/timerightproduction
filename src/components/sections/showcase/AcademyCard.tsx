'use client';

import React, { useId } from 'react';
import JSXStyle from 'styled-jsx/style';

interface AcademyCardProps {
  title: string;
  icon: string;
  courses: string[];
  themeColor: 'blue' | 'amber' | 'purple';
}

const colorMap = {
  blue:   '#3BAED4',
  amber:  '#7B4FBE',
  purple: '#E0368C',
};

const AcademyCard: React.FC<AcademyCardProps> = ({ title, icon, courses, themeColor }) => {
  const color = colorMap[themeColor];
  const reactId = useId();
  const filterId = `hue-${reactId.replace(/:/g, '')}`;

  const css = `
    .ec-wrap {
      position: relative;
      display: block;
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
      color-scheme: light dark;
    }

    @media (min-width: 640px) {
      .ec-wrap {
        display: inline-block;
        width: auto;
        max-width: none;
      }
    }

    .card-container {
      width: 100%;
      padding: 2px;
      border-radius: 1.5em;
      position: relative;
      --electric-light-color: oklch(
        from var(--electric-border-color) l c h
      );
      --gradient-color: oklch(
        from var(--electric-border-color)
        0.3 calc(c / 2) h / 0.4
      );
      background:
        linear-gradient(
          -30deg,
          var(--gradient-color),
          transparent,
          var(--gradient-color)
        ),
        linear-gradient(
          to bottom,
          oklch(0.185 0 0),
          oklch(0.185 0 0)
        );
      color: oklch(0.985 0 0);
    }

    .inner-container {
      position: relative;
    }

    .border-outer {
      border: 2px solid oklch(
        from var(--electric-border-color) l c h / 0.5
      );
      border-radius: 1.5em;
      padding-right: 0.15em;
      padding-bottom: 0.15em;
    }

    .main-card {
      border-radius: 1.5em;
      border: 2px solid var(--electric-border-color);
      margin-top: -4px;
      margin-left: -4px;
      background: oklch(0.09 0 0);
      width: 100%;
      min-height: 320px;
    }

    @media (max-width: 639px) {
      .main-card {
        width: 100%;
        min-height: 480px;
      }
    }

    @media (min-width: 1024px) {
      .main-card {
        width: 420px;
        min-height: 600px;
      }
    }

    .glow-layer-1,
    .glow-layer-2,
    .overlay-1,
    .overlay-2,
    .background-glow {
      border-radius: 24px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .glow-layer-1 {
      border: 2px solid oklch(
        from var(--electric-border-color) l c h / 0.6
      );
      filter: blur(1px);
    }

    .glow-layer-2 {
      border: 2px solid var(--electric-light-color);
      filter: blur(4px);
    }

    .overlay-1,
    .overlay-2 {
      mix-blend-mode: overlay;
      transform: scale(1.1);
      filter: blur(16px);
      background: linear-gradient(
        -30deg,
        white,
        transparent 30%,
        transparent 70%,
        white
      );
    }

    .overlay-1 { opacity: 0.25; }
    .overlay-2 { opacity: 0.1; }

    .background-glow {
      filter: blur(32px);
      transform: scale(1.1);
      opacity: 0.3;
      z-index: -1;
      background: linear-gradient(
        -30deg,
        var(--electric-light-color),
        transparent,
        var(--electric-border-color)
      );
    }

    .content-container {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      z-index: 10;
      border-radius: 1.5em;
      overflow: hidden;
    }

    .icon-section {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40%;
      min-height: 140px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(0, 0, 0, 0.2);
    }

    .text-section {
      flex: 1;
      overflow: hidden;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .card-title {
      font-family: var(--font-syne, sans-serif);
      font-weight: 700;
      font-size: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: white;
      margin-bottom: 1rem;
    }

    @media (min-width: 1024px) {
      .card-title {
        font-size: 1.875rem;
      }
    }

    .course-list {
      list-style: none;
      padding: 0;
      margin: 0;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .course-item {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      text-align: left;
    }

    .course-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-top: 8px;
      flex-shrink: 0;
    }

    .course-text {
      font-family: var(--font-cormorant, serif);
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @media (min-width: 1024px) {
      .text-section {
        padding: 1.5rem 1.75rem;
      }
      .course-text {
        font-size: 1.125rem;
      }
      .card-title {
        font-size: 2rem;
      }
    }
  `;

  return (
    <div className="ec-wrap">

      <JSXStyle id={filterId}>{css}</JSXStyle>

      {/* 1. SVG Filter — görünmez, sadece tanım */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}
           aria-hidden="true">
        <defs>
          <filter id={filterId}
            colorInterpolationFilters="sRGB"
            x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence"
              baseFrequency="0.02" numOctaves="7" />
            <feColorMatrix type="hueRotate" result="pt1">
              <animate attributeName="values"
                values="0;360;" dur=".6s"
                repeatCount="indefinite" calcMode="paced" />
            </feColorMatrix>
            <feComposite />
            <feTurbulence type="turbulence"
              baseFrequency="0.03" numOctaves="7" seed="5" />
            <feColorMatrix type="hueRotate" result="pt2">
              <animate attributeName="values"
                values="0;333;199;286;64;168;256;157;360;"
                dur="5s" repeatCount="indefinite"
                calcMode="paced" />
            </feColorMatrix>
            <feBlend in="pt1" in2="pt2"
              mode="normal" result="combinedNoise" />
            <feDisplacementMap in="SourceGraphic"
              scale="30" xChannelSelector="R"
              yChannelSelector="B" />
          </filter>
        </defs>
      </svg>

      {/* 2. Kart Ana Container */}
      <div className="card-container"
        style={{
          '--electric-border-color': color,
        } as React.CSSProperties}
      >

        {/* 3. Inner Container */}
        <div className="inner-container">

          {/* 4. Border Outer */}
          <div className="border-outer">

            {/* 5. Main Card — SVG filter BURAYA uygulanır */}
            <div className="main-card"
              style={{ filter: `url(#${filterId})` }}
            />

          </div>

          {/* 6. Glow Layer 1 */}
          <div className="glow-layer-1" />

          {/* 7. Glow Layer 2 */}
          <div className="glow-layer-2" />

        </div>{/* /inner-container */}

        {/* 8. Overlay 1 */}
        <div className="overlay-1" />

        {/* 9. Overlay 2 */}
        <div className="overlay-2" />

        {/* 10. Background Glow */}
        <div className="background-glow" />

        {/* 11. Content Container */}
        <div className="content-container">

          {/* İkon Bölümü */}
          <div className="icon-section">
            <svg
              width="80" height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              style={{ color: color, opacity: 0.85 }}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={0.6}
                d={icon}
              />
            </svg>
          </div>

          {/* Metin Bölümü */}
          <div className="text-section">
            <h3 className="card-title">{title}</h3>
            <ul className="course-list">
              {courses.map((course) => (
                <li key={course} className="course-item">
                  <span
                    className="course-dot"
                    style={{ backgroundColor: color }}
                  />
                  <span className="course-text">
                    {course}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>{/* /content-container */}

      </div>{/* /card-container */}

    </div>/* /ec-wrap */
  );
};

export default AcademyCard;
