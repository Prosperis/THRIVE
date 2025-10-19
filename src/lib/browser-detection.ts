/**
 * Browser Detection Utilities
 * Detect browser type, version, and capabilities
 */

export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  os: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsWebP: boolean;
  supportsAvif: boolean;
  supportsGrid: boolean;
  supportsFlexbox: boolean;
  supportsContainerQueries: boolean;
}

/**
 * Detect browser information
 */
export function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;
  const vendor = navigator.vendor || '';
  
  let name = 'Unknown';
  let version = 'Unknown';
  let engine = 'Unknown';
  
  // Detect browser name and version
  if (/Firefox\/(\d+\.\d+)/.test(ua)) {
    name = 'Firefox';
    version = RegExp.$1;
    engine = 'Gecko';
  } else if (/Edg\/(\d+\.\d+)/.test(ua)) {
    name = 'Edge';
    version = RegExp.$1;
    engine = 'Blink';
  } else if (/Chrome\/(\d+\.\d+)/.test(ua) && /Google Inc/.test(vendor)) {
    name = 'Chrome';
    version = RegExp.$1;
    engine = 'Blink';
  } else if (/Safari\/(\d+\.\d+)/.test(ua) && /Apple/.test(vendor)) {
    name = 'Safari';
    version = RegExp.$1;
    engine = 'WebKit';
  } else if (/MSIE|Trident/.test(ua)) {
    name = 'Internet Explorer';
    version = (/MSIE (\d+\.\d+)/.exec(ua) || [])[1] || 'Unknown';
    engine = 'Trident';
  }
  
  // Detect OS
  let os = 'Unknown';
  if (/Windows/.test(ua)) {
    os = 'Windows';
  } else if (/Mac OS X/.test(ua)) {
    os = 'macOS';
  } else if (/Linux/.test(ua)) {
    os = 'Linux';
  } else if (/Android/.test(ua)) {
    os = 'Android';
  } else if (/iOS|iPhone|iPad|iPod/.test(ua)) {
    os = 'iOS';
  }
  
  // Detect device type
  const isMobile = /Mobile|Android|iPhone|iPod/.test(ua);
  const isTablet = /Tablet|iPad/.test(ua);
  const isDesktop = !isMobile && !isTablet;
  
  // Feature detection
  const supportsWebP = detectWebPSupport();
  const supportsAvif = false; // Would need async check
  const supportsGrid = CSS.supports('display', 'grid');
  const supportsFlexbox = CSS.supports('display', 'flex');
  const supportsContainerQueries = CSS.supports('container-type', 'inline-size');
  
  return {
    name,
    version,
    engine,
    os,
    isMobile,
    isTablet,
    isDesktop,
    supportsWebP,
    supportsAvif,
    supportsGrid,
    supportsFlexbox,
    supportsContainerQueries,
  };
}

/**
 * Check if browser is supported
 */
export function isBrowserSupported(): boolean {
  const browser = detectBrowser();
  
  const minVersions: Record<string, number> = {
    Chrome: 90,
    Firefox: 88,
    Safari: 14,
    Edge: 90,
  };
  
  const minVersion = minVersions[browser.name];
  if (!minVersion) return false;
  
  const currentVersion = parseFloat(browser.version);
  return currentVersion >= minVersion;
}

/**
 * Detect WebP support
 */
function detectWebPSupport(): boolean {
  const canvas = document.createElement('canvas');
  if (canvas.getContext?.('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

/**
 * Detect if touch is supported
 */
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    ((navigator as unknown as { msMaxTouchPoints?: number }).msMaxTouchPoints ?? 0) > 0
  );
}

/**
 * Detect viewport size category
 */
export function getViewportSize(): 'mobile' | 'tablet' | 'desktop' | 'wide' {
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1920) return 'desktop';
  return 'wide';
}

/**
 * Detect if running in standalone mode (PWA)
 */
export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

interface NetworkInformation {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

/**
 * Get connection information
 */
export function getConnectionInfo(): {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
} | null {
  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  
  if (!connection) return null;
  
  return {
    effectiveType: connection.effectiveType || 'unknown',
    downlink: connection.downlink || 0,
    rtt: connection.rtt || 0,
    saveData: connection.saveData || false,
  };
}

/**
 * Check if browser supports specific CSS feature
 */
export function supportsCSS(property: string, value: string): boolean {
  return CSS.supports(property, value);
}

/**
 * Get device pixel ratio
 */
export function getDevicePixelRatio(): number {
  return window.devicePixelRatio || 1;
}

/**
 * Detect color scheme preference
 */
export function getColorScheme(): 'light' | 'dark' {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * Detect if user prefers reduced data
 */
export function prefersReducedData(): boolean {
  const connection = getConnectionInfo();
  return connection?.saveData || false;
}

/**
 * Log browser info to console (for debugging)
 */
export function logBrowserInfo(): void {
  const browser = detectBrowser();
  const viewport = getViewportSize();
  const connection = getConnectionInfo();
  const pixelRatio = getDevicePixelRatio();
  const colorScheme = getColorScheme();
  
  console.group('🌐 Browser Information');
  console.log('Browser:', browser.name, browser.version);
  console.log('Engine:', browser.engine);
  console.log('OS:', browser.os);
  console.log('Device:', browser.isMobile ? 'Mobile' : browser.isTablet ? 'Tablet' : 'Desktop');
  console.log('Touch:', isTouchDevice() ? 'Supported' : 'Not supported');
  console.log('Viewport:', viewport);
  console.log('Pixel Ratio:', pixelRatio);
  console.log('Color Scheme:', colorScheme);
  console.log('WebP Support:', browser.supportsWebP);
  console.log('CSS Grid:', browser.supportsGrid);
  console.log('Flexbox:', browser.supportsFlexbox);
  console.log('Container Queries:', browser.supportsContainerQueries);
  if (connection) {
    console.log('Connection:', connection.effectiveType);
    console.log('Save Data:', connection.saveData);
  }
  console.groupEnd();
}

/**
 * Add browser-specific classes to <html> element
 */
export function addBrowserClasses(): void {
  const browser = detectBrowser();
  const html = document.documentElement;
  
  // Add browser name class
  html.classList.add(`browser-${browser.name.toLowerCase()}`);
  
  // Add OS class
  html.classList.add(`os-${browser.os.toLowerCase()}`);
  
  // Add device type class
  if (browser.isMobile) html.classList.add('device-mobile');
  if (browser.isTablet) html.classList.add('device-tablet');
  if (browser.isDesktop) html.classList.add('device-desktop');
  
  // Add touch class
  if (isTouchDevice()) html.classList.add('touch');
  
  // Add feature classes
  if (browser.supportsWebP) html.classList.add('webp');
  if (browser.supportsGrid) html.classList.add('css-grid');
  if (browser.supportsFlexbox) html.classList.add('flexbox');
}
