// ==========================================================================
// Color Utilities & Design Token Engine for Swarna ERP
// Provides RGB/HSL conversions, relative luminance, contrast calculation,
// brightness shifting, and dynamic CSS variable injection on :root.
// ==========================================================================

import { GlassBlurIntensity, CardCornerRadius, ShadowGlowDepth } from '../types/erp';

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface ThemeTokens {
  appBg: string;
  appBgGradient: string;
  appSurface: string;
  appSurfaceGlass: string;
  appHeaderBg: string;
  appPrimary: string;
  appPrimaryHover: string;
  appPrimaryText: string;
  appPrimaryGlow: string;
  appAccent: string;
  appAccentBg: string;
  appTextPrimary: string;
  appTextSecondary: string;
  appTextMuted: string;
  appBorder: string;
  appCardBorder: string;
  appCardShadow: string;
  appInputBg: string;
  appInputBorder: string;
  appTableHeaderBg: string;
  appBlur: string;
  appRadius: string;
  isDark: boolean;
}

/**
 * Parse hex color (e.g. #fff, #1e293b, #10b981) to RGB
 */
export function hexToRgb(hex: string): RgbColor {
  let cleaned = hex.replace(/^#/, '');
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) {
    return { r: 240, g: 244, b: 248 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Convert RGB to Hex string (#rrggbb)
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): HslColor {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): RgbColor {
  h = (h % 360 + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Calculate WCAG standard Relative Luminance (0 = black, 1 = white)
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Adjust lightness of a hex color by delta percentage (-50 to +50)
 */
export function adjustColorLightness(hex: string, deltaPercent: number): string {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  // Scale lightness gracefully
  let newL = hsl.l;
  if (deltaPercent > 0) {
    newL = hsl.l + (100 - hsl.l) * (deltaPercent / 100);
  } else if (deltaPercent < 0) {
    newL = hsl.l + hsl.l * (deltaPercent / 100);
  }
  newL = Math.max(0, Math.min(100, Math.round(newL)));
  const adjustedRgb = hslToRgb(hsl.h, hsl.s, newL);
  return rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);
}

/**
 * Generate subtle gradient stops from a base background hex
 */
export function generateBgGradient(baseHex: string, brightnessDelta: number): {
  gradient: string;
  effectiveBg: string;
  isDark: boolean;
} {
  const adjustedHex = adjustColorLightness(baseHex, brightnessDelta);
  const rgb = hexToRgb(adjustedHex);
  const lum = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
  const isDark = lum < 0.38;

  // Derive subtle gradient nuances based on hue
  const stop1 = adjustColorLightness(adjustedHex, isDark ? 4 : 5);
  const stop2 = adjustedHex;
  const stop3 = adjustColorLightness(adjustedHex, isDark ? -4 : -5);

  const gradient = `linear-gradient(135deg, ${stop1} 0%, ${stop2} 50%, ${stop3} 100%)`;

  return {
    gradient,
    effectiveBg: adjustedHex,
    isDark,
  };
}

/**
 * Compute the complete design token set dynamically based on user selections
 */
export function computeThemeTokens(
  bgBaseHex: string,
  accentHex: string,
  brightnessDelta: number, // -50 to +50
  glassBlur: GlassBlurIntensity = 'standard',
  cornerRadius: CardCornerRadius = 'squircle',
  shadowDepth: ShadowGlowDepth = 'deep'
): ThemeTokens {
  const { gradient, effectiveBg, isDark } = generateBgGradient(bgBaseHex, brightnessDelta);
  const accentRgb = hexToRgb(accentHex);
  const accentLum = getRelativeLuminance(accentRgb.r, accentRgb.g, accentRgb.b);
  const primaryText = accentLum < 0.5 ? '#ffffff' : '#0f172a';
  const primaryGlow = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.45)`;

  const primaryHover = adjustColorLightness(accentHex, isDark ? 10 : -10);

  // Blur string
  let blurVal = '24px';
  if (glassBlur === 'low') blurVal = '12px';
  else if (glassBlur === 'ultra') blurVal = '36px';
  else if (glassBlur === 'solid') blurVal = '0px';

  // Radius string
  let radiusVal = '1.25rem'; // squircle 20px
  if (cornerRadius === 'standard') radiusVal = '0.75rem'; // 12px
  else if (cornerRadius === 'ultra') radiusVal = '1.75rem'; // 28px

  // Shadow calculation
  let shadowVal = isDark
    ? '0 12px 36px 0 rgba(0, 0, 0, 0.45)'
    : '0 12px 40px 0 rgba(15, 23, 42, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.02)';

  if (shadowDepth === 'minimal') {
    shadowVal = isDark ? '0 4px 12px 0 rgba(0,0,0,0.3)' : '0 4px 12px 0 rgba(15,23,42,0.04)';
  } else if (shadowDepth === 'glow') {
    shadowVal = isDark
      ? `0 14px 44px 0 rgba(0, 0, 0, 0.6), 0 0 25px 0 ${primaryGlow}`
      : `0 14px 40px 0 rgba(15, 23, 42, 0.10), 0 0 20px 0 ${primaryGlow}`;
  }

  if (isDark) {
    // Dark mode design tokens
    return {
      appBg: effectiveBg,
      appBgGradient: gradient,
      appSurface: glassBlur === 'solid' ? '#0f172a' : 'rgba(15, 23, 42, 0.85)',
      appSurfaceGlass: glassBlur === 'solid' ? '#1e293b' : 'rgba(30, 41, 59, 0.70)',
      appHeaderBg: glassBlur === 'solid' ? '#070b14' : 'rgba(15, 23, 42, 0.92)',
      appPrimary: accentHex,
      appPrimaryHover: primaryHover,
      appPrimaryText: primaryText,
      appPrimaryGlow: primaryGlow,
      appAccent: accentHex,
      appAccentBg: `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.20)`,
      appTextPrimary: '#f8fafc',
      appTextSecondary: '#cbd5e1',
      appTextMuted: '#94a3b8',
      appBorder: 'rgba(255, 255, 255, 0.14)',
      appCardBorder: 'rgba(255, 255, 255, 0.16)',
      appCardShadow: shadowVal,
      appInputBg: glassBlur === 'solid' ? '#0f172a' : 'rgba(15, 23, 42, 0.75)',
      appInputBorder: 'rgba(255, 255, 255, 0.20)',
      appTableHeaderBg: glassBlur === 'solid' ? '#1e293b' : 'rgba(30, 41, 59, 0.80)',
      appBlur: blurVal,
      appRadius: radiusVal,
      isDark: true,
    };
  } else {
    // Light mode design tokens (Apple Frosted Glass Clarity)
    return {
      appBg: effectiveBg,
      appBgGradient: gradient,
      appSurface: glassBlur === 'solid' ? '#ffffff' : 'rgba(255, 255, 255, 0.96)',
      appSurfaceGlass: glassBlur === 'solid' ? '#f8fafc' : 'rgba(255, 255, 255, 0.88)',
      appHeaderBg: glassBlur === 'solid' ? '#ffffff' : 'rgba(255, 255, 255, 0.94)',
      appPrimary: accentHex,
      appPrimaryHover: primaryHover,
      appPrimaryText: primaryText,
      appPrimaryGlow: primaryGlow,
      appAccent: accentHex,
      appAccentBg: `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.12)`,
      appTextPrimary: '#0f172a',
      appTextSecondary: '#334155',
      appTextMuted: '#64748b',
      appBorder: 'rgba(15, 23, 42, 0.12)',
      appCardBorder: 'rgba(255, 255, 255, 0.98)',
      appCardShadow: shadowVal,
      appInputBg: '#ffffff',
      appInputBorder: '#cbd5e1',
      appTableHeaderBg: 'rgba(241, 245, 249, 0.90)',
      appBlur: blurVal,
      appRadius: radiusVal,
      isDark: false,
    };
  }
}

/**
 * Apply the computed tokens onto the DOM document root
 */
export function applyCssTokensToDocument(tokens: ThemeTokens): void {
  const root = document.documentElement;

  root.style.setProperty('--color-bg', tokens.appBg);
  root.style.setProperty('--color-bg-gradient', tokens.appBgGradient);
  root.style.setProperty('--color-surface', tokens.appSurface);
  root.style.setProperty('--color-surface-glass', tokens.appSurfaceGlass);
  root.style.setProperty('--color-header-bg', tokens.appHeaderBg);
  root.style.setProperty('--color-primary', tokens.appPrimary);
  root.style.setProperty('--color-primary-hover', tokens.appPrimaryHover);
  root.style.setProperty('--color-primary-text', tokens.appPrimaryText);
  root.style.setProperty('--color-primary-glow', tokens.appPrimaryGlow);
  root.style.setProperty('--color-accent', tokens.appAccent);
  root.style.setProperty('--color-accent-bg', tokens.appAccentBg);
  root.style.setProperty('--color-text-primary', tokens.appTextPrimary);
  root.style.setProperty('--color-text-secondary', tokens.appTextSecondary);
  root.style.setProperty('--color-text-muted', tokens.appTextMuted);
  root.style.setProperty('--color-border', tokens.appBorder);
  root.style.setProperty('--color-card-border', tokens.appCardBorder);
  root.style.setProperty('--color-card-shadow', tokens.appCardShadow);
  root.style.setProperty('--color-input-bg', tokens.appInputBg);
  root.style.setProperty('--color-input-border', tokens.appInputBorder);
  root.style.setProperty('--color-table-header-bg', tokens.appTableHeaderBg);
  root.style.setProperty('--app-blur', tokens.appBlur);
  root.style.setProperty('--app-radius', tokens.appRadius);

  // Set browser native color-scheme
  root.style.colorScheme = tokens.isDark ? 'dark' : 'light';

  // Toggle dark class
  if (tokens.isDark) {
    root.classList.add('dark');
    document.body.classList.add('dark');
  } else {
    root.classList.remove('dark');
    document.body.classList.remove('dark');
  }
}
