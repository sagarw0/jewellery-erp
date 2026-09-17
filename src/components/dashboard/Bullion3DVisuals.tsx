import React from 'react';

/**
 * 3D Photorealistic Bullion Visuals for Swarna ERP
 * High-detail vector SVG renders with metallic gradients, bevels, depth, and specular glints.
 */

export const GoldBars3DVisual: React.FC<{ className?: string }> = ({ className = 'w-full h-24' }) => (
  <svg
    viewBox="0 0 240 120"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Gold Base & Highlight Gradients */}
      <linearGradient id="goldTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff3bf" />
        <stop offset="25%" stopColor="#fde047" />
        <stop offset="60%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>

      <linearGradient id="goldFront" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="20%" stopColor="#eab308" />
        <stop offset="70%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>

      <linearGradient id="goldSide" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ca8a04" />
        <stop offset="50%" stopColor="#a16207" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>

      <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
      </linearGradient>

      {/* Drop Shadows */}
      <radialGradient id="goldDropShadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
        <stop offset="60%" stopColor="#78350f" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="120" cy="106" rx="95" ry="12" fill="url(#goldDropShadow)" />

    {/* Bottom Left Bar */}
    <g transform="translate(-15, 10)">
      {/* Front Face */}
      <polygon points="40,82 120,82 110,98 30,98" fill="url(#goldFront)" />
      {/* Right Side */}
      <polygon points="120,82 145,66 135,82 110,98" fill="url(#goldSide)" />
      {/* Top Face */}
      <polygon points="65,66 145,66 120,82 40,82" fill="url(#goldTop)" />
      {/* Sheen Highlight */}
      <polygon points="65,66 145,66 120,82 40,82" fill="url(#goldSheen)" />
      {/* Stamp text */}
      <text x="82" y="76" fontSize="6.5" fontWeight="900" fill="#78350f" letterSpacing="1" opacity="0.65" transform="rotate(-5, 82, 76)">999.9 FINE GOLD</text>
    </g>

    {/* Bottom Right Bar */}
    <g transform="translate(45, 10)">
      {/* Front Face */}
      <polygon points="40,82 120,82 110,98 30,98" fill="url(#goldFront)" />
      {/* Right Side */}
      <polygon points="120,82 145,66 135,82 110,98" fill="url(#goldSide)" />
      {/* Top Face */}
      <polygon points="65,66 145,66 120,82 40,82" fill="url(#goldTop)" />
      {/* Sheen Highlight */}
      <polygon points="65,66 145,66 120,82 40,82" fill="url(#goldSheen)" />
      {/* Stamp text */}
      <text x="82" y="76" fontSize="6.5" fontWeight="900" fill="#78350f" letterSpacing="1" opacity="0.65" transform="rotate(-5, 82, 76)">999.9 FINE GOLD</text>
    </g>

    {/* Top Pyramid Bar */}
    <g transform="translate(15, -12)">
      {/* Front Face */}
      <polygon points="40,82 120,82 110,98 30,98" fill="url(#goldFront)" />
      {/* Front Bevel Edge */}
      <line x1="30" y1="98" x2="110" y2="98" stroke="#fef08a" strokeWidth="1" />
      {/* Right Side */}
      <polygon points="120,82 145,66 135,82 110,98" fill="url(#goldSide)" />
      {/* Top Face */}
      <polygon points="65,66 145,66 120,82 40,82" fill="url(#goldTop)" />
      {/* Top Sheen */}
      <polygon points="65,66 145,66 120,82 40,82" fill="url(#goldSheen)" />
      {/* Highlight Line */}
      <line x1="40" y1="82" x2="120" y2="82" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.9" />
      <line x1="120" y1="82" x2="145" y2="66" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.7" />
      {/* Stamped Logo & Text */}
      <circle cx="70" cy="74" r="3.5" stroke="#78350f" strokeWidth="0.75" fill="none" opacity="0.6" />
      <text x="82" y="76" fontSize="6.5" fontWeight="900" fill="#78350f" letterSpacing="1" opacity="0.75" transform="rotate(-5, 82, 76)">999.9 1000g</text>
      <text x="84" y="80" fontSize="4" fontWeight="bold" fill="#78350f" letterSpacing="0.8" opacity="0.6" transform="rotate(-5, 84, 80)">SWARNA BULLION</text>
    </g>

    {/* Brilliant Glint Sparkle */}
    <g transform="translate(68, 48)">
      <polygon points="10,0 12,8 20,10 12,12 10,20 8,12 0,10 8,8" fill="#ffffff" opacity="0.9" />
      <circle cx="10" cy="10" r="3" fill="#ffffff" />
    </g>
  </svg>
);

export const SilverBars3DVisual: React.FC<{ className?: string }> = ({ className = 'w-full h-24' }) => (
  <svg
    viewBox="0 0 240 120"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Silver Gradients */}
      <linearGradient id="silverTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#e2e8f0" />
        <stop offset="70%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>

      <linearGradient id="silverFront" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#cbd5e1" />
        <stop offset="75%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>

      <linearGradient id="silverSide" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="60%" stopColor="#64748b" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>

      <linearGradient id="silverSheen" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
      </linearGradient>

      {/* Shadow */}
      <radialGradient id="silverDropShadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0f172a" stopOpacity="0.3" />
        <stop offset="60%" stopColor="#334155" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="120" cy="106" rx="95" ry="12" fill="url(#silverDropShadow)" />

    {/* Bottom Left Silver Bar */}
    <g transform="translate(-15, 10)">
      <polygon points="40,82 120,82 110,98 30,98" fill="url(#silverFront)" />
      <polygon points="120,82 145,66 135,82 110,98" fill="url(#silverSide)" />
      <polygon points="65,66 145,66 120,82 40,82" fill="url(#silverTop)" />
      <polygon points="65,66 145,66 120,82 40,82" fill="url(#silverSheen)" />
      <text x="80" y="76" fontSize="6.5" fontWeight="900" fill="#334155" letterSpacing="1" opacity="0.65" transform="rotate(-5, 80, 76)">999 FINE SILVER</text>
    </g>

    {/* Bottom Right Silver Bar */}
    <g transform="translate(45, 10)">
      <polygon points="40,82 120,82 110,98 30,98" fill="url(#silverFront)" />
      <polygon points="120,82 145,66 135,82 110,98" fill="url(#silverSide)" />
      <polygon points="65,66 145,66 120,82 40,82" fill="url(#silverTop)" />
      <polygon points="65,66 145,66 120,82 40,82" fill="url(#silverSheen)" />
      <text x="80" y="76" fontSize="6.5" fontWeight="900" fill="#334155" letterSpacing="1" opacity="0.65" transform="rotate(-5, 80, 76)">999 FINE SILVER</text>
    </g>

    {/* Top Pyramid Silver Bar */}
    <g transform="translate(15, -12)">
      <polygon points="40,82 120,82 110,98 30,98" fill="url(#silverFront)" />
      <line x1="30" y1="98" x2="110" y2="98" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.8" />
      <polygon points="120,82 145,66 135,82 110,98" fill="url(#silverSide)" />
      <polygon points="65,66 145,66 120,82 40,82" fill="url(#silverTop)" />
      <polygon points="65,66 145,66 120,82 40,82" fill="url(#silverSheen)" />
      {/* Crisp Chrome Highlights */}
      <line x1="40" y1="82" x2="120" y2="82" stroke="#ffffff" strokeWidth="1.75" strokeOpacity="0.95" />
      <line x1="120" y1="82" x2="145" y2="66" stroke="#ffffff" strokeWidth="1.25" strokeOpacity="0.8" />
      <circle cx="70" cy="74" r="3.5" stroke="#334155" strokeWidth="0.75" fill="none" opacity="0.6" />
      <text x="80" y="76" fontSize="6.5" fontWeight="900" fill="#1e293b" letterSpacing="1" opacity="0.8" transform="rotate(-5, 80, 76)">999 1000g</text>
      <text x="82" y="80" fontSize="4" fontWeight="bold" fill="#334155" letterSpacing="0.8" opacity="0.65" transform="rotate(-5, 82, 80)">PURE BULLION</text>
    </g>

    {/* Silver Star Glint */}
    <g transform="translate(68, 48)">
      <polygon points="10,0 12,8 20,10 12,12 10,20 8,12 0,10 8,8" fill="#ffffff" opacity="0.95" />
      <circle cx="10" cy="10" r="3" fill="#ffffff" />
    </g>
  </svg>
);

export const GoldScrap3DVisual: React.FC<{ className?: string }> = ({ className = 'w-full h-24' }) => (
  <svg
    viewBox="0 0 240 120"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="nuggetG1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
      <linearGradient id="nuggetG2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="30%" stopColor="#fde047" />
        <stop offset="80%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
      <linearGradient id="nuggetG3" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef9c3" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#a16207" />
      </linearGradient>
      <radialGradient id="scrapDropShadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.32" />
        <stop offset="70%" stopColor="#78350f" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="120" cy="104" rx="85" ry="12" fill="url(#scrapDropShadow)" />

    {/* Cluster of Raw Gold Scrap & Faceted Nuggets */}
    {/* Left Cluster */}
    <path d="M50 94 L65 72 L85 76 L92 95 L72 102 Z" fill="url(#nuggetG1)" />
    <path d="M65 72 L78 62 L95 68 L85 76 Z" fill="url(#nuggetG2)" stroke="#fef08a" strokeWidth="0.5" />
    <path d="M85 76 L95 68 L104 82 L92 95 Z" fill="url(#nuggetG3)" />

    {/* Center High Peak Nugget */}
    <path d="M90 98 L102 65 L125 50 L145 68 L138 98 L115 104 Z" fill="url(#nuggetG2)" />
    <path d="M102 65 L120 42 L132 46 L125 50 Z" fill="#fffbeb" />
    <path d="M125 50 L132 46 L148 58 L145 68 Z" fill="url(#nuggetG1)" />
    <path d="M115 65 L128 72 L120 90 L108 82 Z" fill="url(#nuggetG3)" stroke="#fef08a" strokeWidth="0.5" />
    <path d="M128 72 L142 66 L148 85 L138 98 Z" fill="url(#nuggetG1)" />

    {/* Right Cluster */}
    <path d="M135 98 L152 74 L176 70 L188 92 L165 102 Z" fill="url(#nuggetG3)" />
    <path d="M152 74 L165 58 L182 64 L176 70 Z" fill="url(#nuggetG2)" stroke="#fffbeb" strokeWidth="0.5" />
    <path d="M176 70 L182 64 L194 78 L188 92 Z" fill="url(#nuggetG1)" />

    {/* Small Foreground Fragments */}
    <path d="M78 98 L86 92 L94 96 L88 103 Z" fill="url(#nuggetG2)" />
    <path d="M148 98 L158 92 L166 97 L156 103 Z" fill="url(#nuggetG2)" />
    <path d="M112 100 L122 95 L130 99 L124 105 Z" fill="#fffbeb" />

    {/* Specular Highlights / Glints */}
    <circle cx="120" cy="43" r="1.5" fill="#ffffff" />
    <circle cx="78" cy="63" r="1.5" fill="#ffffff" />
    <circle cx="165" cy="59" r="1.5" fill="#ffffff" />
    <g transform="translate(112, 36)">
      <polygon points="6,0 7,4 12,6 7,8 6,12 5,8 0,6 5,4" fill="#ffffff" opacity="0.9" />
    </g>
  </svg>
);

export const SilverScrap3DVisual: React.FC<{ className?: string }> = ({ className = 'w-full h-24' }) => (
  <svg
    viewBox="0 0 240 120"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="sNugget1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
      <linearGradient id="sNugget2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#e2e8f0" />
        <stop offset="80%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <linearGradient id="sNugget3" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="50%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
      <radialGradient id="silverScrapShadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0f172a" stopOpacity="0.32" />
        <stop offset="70%" stopColor="#334155" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Shadow */}
    <ellipse cx="120" cy="104" rx="85" ry="12" fill="url(#silverScrapShadow)" />

    {/* Cluster of Raw Silver Scrap & Multidirectional Chunks */}
    {/* Left */}
    <path d="M50 94 L65 72 L85 76 L92 95 L72 102 Z" fill="url(#sNugget1)" />
    <path d="M65 72 L78 62 L95 68 L85 76 Z" fill="url(#sNugget2)" stroke="#ffffff" strokeWidth="0.5" />
    <path d="M85 76 L95 68 L104 82 L92 95 Z" fill="url(#sNugget3)" />

    {/* Center High Peak */}
    <path d="M90 98 L102 65 L125 50 L145 68 L138 98 L115 104 Z" fill="url(#sNugget2)" />
    <path d="M102 65 L120 42 L132 46 L125 50 Z" fill="#ffffff" />
    <path d="M125 50 L132 46 L148 58 L145 68 Z" fill="url(#sNugget1)" />
    <path d="M115 65 L128 72 L120 90 L108 82 Z" fill="url(#sNugget3)" stroke="#ffffff" strokeWidth="0.5" />
    <path d="M128 72 L142 66 L148 85 L138 98 Z" fill="url(#sNugget1)" />

    {/* Right */}
    <path d="M135 98 L152 74 L176 70 L188 92 L165 102 Z" fill="url(#sNugget3)" />
    <path d="M152 74 L165 58 L182 64 L176 70 Z" fill="url(#sNugget2)" stroke="#ffffff" strokeWidth="0.5" />
    <path d="M176 70 L182 64 L194 78 L188 92 Z" fill="url(#sNugget1)" />

    {/* Small Foreground Chunks */}
    <path d="M78 98 L86 92 L94 96 L88 103 Z" fill="url(#sNugget2)" />
    <path d="M148 98 L158 92 L166 97 L156 103 Z" fill="url(#sNugget2)" />
    <path d="M112 100 L122 95 L130 99 L124 105 Z" fill="#ffffff" />

    {/* Glints */}
    <circle cx="120" cy="43" r="1.5" fill="#ffffff" />
    <g transform="translate(112, 36)">
      <polygon points="6,0 7,4 12,6 7,8 6,12 5,8 0,6 5,4" fill="#ffffff" opacity="0.95" />
    </g>
  </svg>
);

export const ImitationBar3DVisual: React.FC<{ className?: string }> = ({ className = 'w-full h-24' }) => (
  <svg
    viewBox="0 0 240 120"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Rose Gold / Copper Metallic Gradients */}
      <linearGradient id="roseTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffe4e6" />
        <stop offset="35%" stopColor="#fbcfe8" />
        <stop offset="70%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#e11d48" />
      </linearGradient>

      <linearGradient id="roseFront" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fecdd3" />
        <stop offset="30%" stopColor="#fb7185" />
        <stop offset="75%" stopColor="#e11d48" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>

      <linearGradient id="roseSide" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e11d48" />
        <stop offset="60%" stopColor="#9f1239" />
        <stop offset="100%" stopColor="#4c0519" />
      </linearGradient>

      <linearGradient id="roseSheen" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
        <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.35" />
      </linearGradient>

      <radialGradient id="roseDropShadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#881337" stopOpacity="0.35" />
        <stop offset="65%" stopColor="#4c0519" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Shadow */}
    <ellipse cx="120" cy="102" rx="90" ry="12" fill="url(#roseDropShadow)" />

    {/* Rose-Gold Micro-Plate Ingot */}
    <g transform="translate(15, 2)">
      {/* Front Face */}
      <polygon points="40,80 140,80 128,96 28,96" fill="url(#roseFront)" />
      {/* Bevel Highlight */}
      <line x1="28" y1="96" x2="128" y2="96" stroke="#ffe4e6" strokeWidth="1" strokeOpacity="0.7" />
      {/* Right Face */}
      <polygon points="140,80 170,62 158,78 128,96" fill="url(#roseSide)" />
      {/* Top Face */}
      <polygon points="70,62 170,62 140,80 40,80" fill="url(#roseTop)" />
      {/* Sheen */}
      <polygon points="70,62 170,62 140,80 40,80" fill="url(#roseSheen)" />
      {/* Crisp Highlight Rim */}
      <line x1="40" y1="80" x2="140" y2="80" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.9" />
      <line x1="140" y1="80" x2="170" y2="62" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.8" />
      {/* Laser Inscription */}
      <circle cx="85" cy="71" r="3.5" stroke="#4c0519" strokeWidth="0.75" fill="none" opacity="0.6" />
      <text x="96" y="73" fontSize="6.5" fontWeight="900" fill="#4c0519" letterSpacing="1" opacity="0.75" transform="rotate(-5, 96, 73)">1GM MICRO-PLATE</text>
      <text x="98" y="77" fontSize="4" fontWeight="bold" fill="#4c0519" letterSpacing="0.8" opacity="0.6" transform="rotate(-5, 98, 77)">IMITATION ALLOY</text>
    </g>

    {/* Sparkle */}
    <g transform="translate(85, 48)">
      <polygon points="8,0 9.5,6 16,8 9.5,10 8,16 6.5,10 0,8 6.5,6" fill="#ffffff" opacity="0.9" />
      <circle cx="8" cy="8" r="2.5" fill="#ffffff" />
    </g>
  </svg>
);

export const LuxuryRingsBannerVisual: React.FC<{ className?: string }> = ({ className = 'w-48 h-20' }) => (
  <svg
    viewBox="0 0 200 90"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="ringGold1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="25%" stopColor="#fde047" />
        <stop offset="60%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
      <linearGradient id="ringGold2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef9c3" />
        <stop offset="40%" stopColor="#eab308" />
        <stop offset="80%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fde047" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Soft Gold Radial Glow */}
    <ellipse cx="100" cy="45" rx="70" ry="35" fill="url(#ringGlow)" />

    {/* Back Ring (Tilted Oval) */}
    <g transform="translate(45, 10)">
      <ellipse cx="40" cy="35" rx="32" ry="18" stroke="url(#ringGold2)" strokeWidth="6.5" fill="none" transform="rotate(-15, 40, 35)" />
      <ellipse cx="40" cy="35" rx="32" ry="18" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" fill="none" transform="rotate(-15, 40, 35)" />
    </g>

    {/* Front Interlocking Ring with Embedded Diamond Studs */}
    <g transform="translate(85, 16)">
      <ellipse cx="40" cy="35" rx="34" ry="20" stroke="url(#ringGold1)" strokeWidth="7" fill="none" transform="rotate(20, 40, 35)" />
      <ellipse cx="40" cy="35" rx="34" ry="20" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.85" fill="none" transform="rotate(20, 40, 35)" />

      {/* Diamond Sparkles on the Rim */}
      <circle cx="28" cy="22" r="2" fill="#ffffff" />
      <circle cx="34" cy="19" r="2.2" fill="#ffffff" />
      <circle cx="41" cy="18" r="2.5" fill="#ffffff" />
      <circle cx="48" cy="19" r="2.2" fill="#ffffff" />
      <circle cx="54" cy="22" r="2" fill="#ffffff" />

      {/* Hallmark inscription */}
      <text x="32" y="44" fontSize="4.5" fontWeight="900" fill="#78350f" letterSpacing="0.8" opacity="0.6">TRUST</text>
    </g>

    {/* Star Sparkles */}
    <g transform="translate(120, 15)">
      <polygon points="5,0 6,3.5 10,5 6,6.5 5,10 4,6.5 0,5 4,3.5" fill="#ffffff" opacity="0.9" />
    </g>
    <g transform="translate(65, 30)">
      <polygon points="4,0 5,2.5 8,4 5,5.5 4,8 3,5.5 0,4 3,2.5" fill="#ffffff" opacity="0.85" />
    </g>
  </svg>
);
