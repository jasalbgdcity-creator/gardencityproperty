import React from "react";

interface CountryFlagProps {
  code: string;
  className?: string;
}

export default function CountryFlag({ code, className = "h-4 w-6" }: CountryFlagProps) {
  const upper = (code || "OM").toUpperCase();
  const flagClass = `shrink-0 ${className}`;

  switch (upper) {
    // 🇴🇲 Oman
    case "OM":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="100" fill="#ffffff" />
          <rect y="100" width="600" height="100" fill="#db161b" />
          <rect y="200" width="600" height="100" fill="#008000" />
          <rect width="200" height="300" fill="#db161b" />
          {/* Khanjar & Swords Emblem */}
          <g fill="#ffffff" transform="translate(100, 50) scale(0.42)">
            <path d="M-8 -30 L8 -30 L10 -15 L2 -12 L5 15 L0 30 L-5 15 L-2 -12 L-10 -15 Z" />
            <path d="M-40 -10 L40 10 L35 15 L-45 -5 Z" opacity="0.9" />
            <path d="M40 -10 L-40 10 L-35 15 L45 -5 Z" opacity="0.9" />
            <circle cx="0" cy="-35" r="4" />
          </g>
        </svg>
      );

    // 🇦🇪 United Arab Emirates
    case "AE":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="100" fill="#00732f" />
          <rect y="100" width="600" height="100" fill="#ffffff" />
          <rect y="200" width="600" height="100" fill="#000000" />
          <rect width="150" height="300" fill="#ff0000" />
        </svg>
      );

    // 🇸🇦 Saudi Arabia
    case "SA":
      return (
        <svg viewBox="0 0 600 400" className={flagClass} aria-hidden="true">
          <rect width="600" height="400" fill="#006c35" />
          <g fill="#ffffff">
            <path d="M190 280 h220 v8 h-220 z" />
            <polygon points="175,284 195,276 195,292" />
            <path d="M375 275 v18 h6 v-18 z" />
            <path d="M220 200 q20 -30 45 -5 q25 -25 50 0 q25 -25 50 0 v20 h-145 z" opacity="0.95" />
          </g>
        </svg>
      );

    // 🇶🇦 Qatar
    case "QA":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="300" fill="#8a1538" />
          <polygon
            fill="#ffffff"
            points="0,0 200,0 240,16.6 200,33.3 240,50 200,66.6 240,83.3 200,100 240,116.6 200,133.3 240,150 200,166.6 240,183.3 200,200 240,216.6 200,233.3 240,250 200,266.6 240,283.3 200,300 0,300"
          />
        </svg>
      );

    // 🇰🇼 Kuwait
    case "KW":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="100" fill="#007a3d" />
          <rect y="100" width="600" height="100" fill="#ffffff" />
          <rect y="200" width="600" height="100" fill="#ce1126" />
          <polygon points="0,0 150,100 150,200 0,300" fill="#000000" />
        </svg>
      );

    // 🇧🇭 Bahrain
    case "BH":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="300" fill="#ce1126" />
          <polygon
            fill="#ffffff"
            points="0,0 150,0 210,30 150,60 210,90 150,120 210,150 150,180 210,210 150,240 210,270 150,300 0,300"
          />
        </svg>
      );

    // 🇬🇧 United Kingdom
    case "GB":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <clipPath id="gb-cp">
            <rect width="600" height="300" />
          </clipPath>
          <g clipPath="url(#gb-cp)">
            <rect width="600" height="300" fill="#012169" />
            <path d="M0,0 L600,300 M600,0 L0,300" stroke="#fff" strokeWidth="60" />
            <path d="M0,0 L600,300 M600,0 L0,300" stroke="#c8102e" strokeWidth="20" />
            <path d="M300,0 V300 M0,150 H600" stroke="#fff" strokeWidth="100" />
            <path d="M300,0 V300 M0,150 H600" stroke="#c8102e" strokeWidth="60" />
          </g>
        </svg>
      );

    // 🇺🇸 USA
    case "US":
      return (
        <svg viewBox="0 0 600 315" className={flagClass} aria-hidden="true">
          <rect width="600" height="315" fill="#fff" />
          {[...Array(7)].map((_, i) => (
            <rect key={i} y={i * 48.46} width="600" height="24.23" fill="#b22234" />
          ))}
          <rect width="240" height="169.6" fill="#3c3b6e" />
          <g fill="#fff" transform="translate(15, 12)">
            {[...Array(9)].map((_, row) => (
              <g key={row} transform={`translate(0, ${row * 16.5})`}>
                {[...Array(row % 2 === 0 ? 6 : 5)].map((_, col) => (
                  <circle
                    key={col}
                    cx={(row % 2 === 0 ? col * 40 : col * 40 + 20) + 10}
                    cy="8"
                    r="4.5"
                  />
                ))}
              </g>
            ))}
          </g>
        </svg>
      );

    // 🇮🇳 India
    case "IN":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="100" fill="#ff9933" />
          <rect y="100" width="600" height="100" fill="#ffffff" />
          <rect y="200" width="600" height="100" fill="#138808" />
          <circle cx="300" cy="150" r="35" fill="none" stroke="#000080" strokeWidth="5" />
          <circle cx="300" cy="150" r="7" fill="#000080" />
        </svg>
      );

    // 🇵🇰 Pakistan
    case "PK":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="300" fill="#01411c" />
          <rect width="150" height="300" fill="#ffffff" />
          <circle cx="390" cy="150" r="75" fill="#ffffff" />
          <circle cx="410" cy="135" r="70" fill="#01411c" />
          <polygon
            fill="#ffffff"
            points="390,95 397,115 418,115 401,128 407,148 390,135 373,148 379,128 362,115 383,115"
          />
        </svg>
      );

    // 🇪🇬 Egypt
    case "EG":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="100" fill="#ce1126" />
          <rect y="100" width="600" height="100" fill="#ffffff" />
          <rect y="200" width="600" height="100" fill="#000000" />
          <circle cx="300" cy="150" r="22" fill="#c09300" />
        </svg>
      );

    // 🇯🇴 Jordan
    case "JO":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="100" fill="#000000" />
          <rect y="100" width="600" height="100" fill="#ffffff" />
          <rect y="200" width="600" height="100" fill="#007a3d" />
          <polygon points="0,0 200,150 0,300" fill="#ce1126" />
          <polygon points="65,140 70,147 80,145 74,153 77,162 68,157 60,163 62,154 56,147 64,147" fill="#ffffff" />
        </svg>
      );

    // 🇱🇧 Lebanon
    case "LB":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="75" fill="#ee161f" />
          <rect y="75" width="600" height="150" fill="#ffffff" />
          <rect y="225" width="600" height="75" fill="#ee161f" />
          {/* Green Cedar */}
          <polygon points="300,90 260,180 340,180" fill="#00a850" />
          <polygon points="300,120 250,210 350,210" fill="#00a850" />
          <rect x="292" y="210" width="16" height="20" fill="#00a850" />
        </svg>
      );

    // 🇹🇷 Turkey
    case "TR":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="300" fill="#e30a17" />
          <circle cx="250" cy="150" r="75" fill="#ffffff" />
          <circle cx="270" cy="150" r="60" fill="#e30a17" />
          <polygon
            fill="#ffffff"
            points="340,150 360,157 375,142 371,162 388,172 368,173 358,190 354,171 334,164 352,156"
          />
        </svg>
      );

    // 🇩🇪 Germany
    case "DE":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="100" fill="#000000" />
          <rect y="100" width="600" height="100" fill="#dd0000" />
          <rect y="200" width="600" height="100" fill="#ffce00" />
        </svg>
      );

    // 🇫🇷 France
    case "FR":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="200" height="300" fill="#002395" />
          <rect x="200" width="200" height="300" fill="#ffffff" />
          <rect x="400" width="200" height="300" fill="#ed2939" />
        </svg>
      );

    // 🇮🇹 Italy
    case "IT":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="200" height="300" fill="#009246" />
          <rect x="200" width="200" height="300" fill="#ffffff" />
          <rect x="400" width="200" height="300" fill="#ce2b37" />
        </svg>
      );

    // 🇨🇭 Switzerland
    case "CH":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="300" fill="#d52b1e" />
          <rect x="260" y="80" width="80" height="140" fill="#ffffff" />
          <rect x="230" y="110" width="140" height="80" fill="#ffffff" />
        </svg>
      );

    // 🇳🇱 Netherlands
    case "NL":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="100" fill="#ae1c28" />
          <rect y="100" width="600" height="100" fill="#ffffff" />
          <rect y="200" width="600" height="100" fill="#21468b" />
        </svg>
      );

    // 🇪🇸 Spain
    case "ES":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="75" fill="#aa151b" />
          <rect y="75" width="600" height="150" fill="#f1bf00" />
          <rect y="225" width="600" height="75" fill="#aa151b" />
          <circle cx="150" cy="150" r="22" fill="#aa151b" />
        </svg>
      );

    // 🇷🇺 Russia
    case "RU":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="100" fill="#ffffff" />
          <rect y="100" width="600" height="100" fill="#0039a6" />
          <rect y="200" width="600" height="100" fill="#d52b1e" />
        </svg>
      );

    // 🇨🇳 China
    case "CN":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="300" fill="#de2910" />
          <polygon points="100,50 110,80 140,80 115,100 125,130 100,110 75,130 85,100 60,80 90,80" fill="#ffde00" />
          <circle cx="160" cy="40" r="7" fill="#ffde00" />
          <circle cx="190" cy="70" r="7" fill="#ffde00" />
          <circle cx="190" cy="110" r="7" fill="#ffde00" />
          <circle cx="160" cy="140" r="7" fill="#ffde00" />
        </svg>
      );

    // 🇸🇬 Singapore
    case "SG":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="150" fill="#ee2536" />
          <rect y="150" width="600" height="150" fill="#ffffff" />
          <circle cx="100" cy="75" r="45" fill="#ffffff" />
          <circle cx="115" cy="75" r="42" fill="#ee2536" />
        </svg>
      );

    // 🇲🇾 Malaysia
    case "MY":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="300" fill="#ffffff" />
          {[...Array(7)].map((_, i) => (
            <rect key={i} y={i * 42.8} width="600" height="21.4" fill="#cc0000" />
          ))}
          <rect width="300" height="171" fill="#000066" />
          <circle cx="130" cy="85" r="50" fill="#ffcc00" />
          <circle cx="145" cy="85" r="45" fill="#000066" />
          <polygon points="190,85 200,98 215,90 208,105 220,116 205,116 200,130 193,116 178,118 190,105 180,92" fill="#ffcc00" />
        </svg>
      );

    // 🇦🇺 Australia
    case "AU":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="300" fill="#00008b" />
          <g transform="scale(0.5)">
            <rect width="600" height="300" fill="#012169" />
            <path d="M0,0 L600,300 M600,0 L0,300" stroke="#fff" strokeWidth="60" />
            <path d="M0,0 L600,300 M600,0 L0,300" stroke="#c8102e" strokeWidth="20" />
            <path d="M300,0 V300 M0,150 H600" stroke="#fff" strokeWidth="100" />
            <path d="M300,0 V300 M0,150 H600" stroke="#c8102e" strokeWidth="60" />
          </g>
          {/* Southern cross stars */}
          <circle cx="450" cy="60" r="12" fill="#ffffff" />
          <circle cx="500" cy="110" r="12" fill="#ffffff" />
          <circle cx="450" cy="220" r="14" fill="#ffffff" />
          <circle cx="400" cy="140" r="12" fill="#ffffff" />
          <circle cx="470" cy="160" r="8" fill="#ffffff" />
          {/* Commonwealth star */}
          <circle cx="150" cy="220" r="24" fill="#ffffff" />
        </svg>
      );

    // 🇿🇦 South Africa
    case "ZA":
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="150" fill="#e03c31" />
          <rect y="150" width="600" height="150" fill="#001489" />
          <polygon points="0,0 200,150 0,300" fill="#000000" />
          <polygon points="0,0 220,150 0,300" stroke="#ffb81c" strokeWidth="20" fill="none" />
          <path d="M0,150 L200,150 L600,150" stroke="#007749" strokeWidth="60" fill="none" />
          <path d="M0,0 L200,150 L600,150 L200,150 L0,300" stroke="#ffffff" strokeWidth="20" fill="none" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 600 300" className={flagClass} aria-hidden="true">
          <rect width="600" height="100" fill="#ffffff" />
          <rect y="100" width="600" height="100" fill="#db161b" />
          <rect y="200" width="600" height="100" fill="#008000" />
          <rect width="200" height="300" fill="#db161b" />
        </svg>
      );
  }
}
