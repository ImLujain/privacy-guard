// Tracker Risk Database
// Rule-based scoring system for known tracking domains

export interface TrackerInfo {
  category: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  description: string;
  dataCollected: string[];
  company?: string;
}

export const trackerDatabase: Record<string, TrackerInfo> = {
  // Google tracking domains
  'google-analytics.com': {
    category: 'Analytics',
    riskLevel: 'high',
    riskScore: 75,
    description: 'Tracks user behavior, page views, and interactions across websites',
    dataCollected: ['browsing history', 'user behavior', 'device info', 'location'],
    company: 'Google'
  },
  'googletagmanager.com': {
    category: 'Analytics',
    riskLevel: 'high',
    riskScore: 80,
    description: 'Manages multiple tracking tags and collects comprehensive user data',
    dataCollected: ['browsing history', 'user interactions', 'conversion data', 'demographics'],
    company: 'Google'
  },
  'doubleclick.net': {
    category: 'Advertising',
    riskLevel: 'critical',
    riskScore: 90,
    description: 'Tracks users across sites for targeted advertising and ad performance',
    dataCollected: ['browsing history', 'interests', 'purchase intent', 'demographics', 'location'],
    company: 'Google'
  },
  'googlesyndication.com': {
    category: 'Advertising',
    riskLevel: 'high',
    riskScore: 85,
    description: 'Serves targeted ads and tracks ad impressions and clicks',
    dataCollected: ['ad interactions', 'browsing patterns', 'interests'],
    company: 'Google'
  },

  // Facebook tracking domains
  'facebook.com': {
    category: 'Social',
    riskLevel: 'critical',
    riskScore: 95,
    description: 'Tracks user activity across websites with Facebook integration',
    dataCollected: ['browsing history', 'social connections', 'interests', 'demographics', 'location'],
    company: 'Meta'
  },
  'facebook.net': {
    category: 'Social',
    riskLevel: 'critical',
    riskScore: 90,
    description: 'Facebook pixel tracking for ad targeting and conversion tracking',
    dataCollected: ['purchase behavior', 'page views', 'button clicks', 'form submissions'],
    company: 'Meta'
  },
  'connect.facebook.net': {
    category: 'Social',
    riskLevel: 'high',
    riskScore: 85,
    description: 'Facebook SDK for tracking user interactions and social features',
    dataCollected: ['user interactions', 'social graph', 'app usage'],
    company: 'Meta'
  },

  // Amazon tracking
  'amazon-adsystem.com': {
    category: 'Advertising',
    riskLevel: 'high',
    riskScore: 80,
    description: 'Amazon advertising network tracking user behavior for ad targeting',
    dataCollected: ['browsing history', 'purchase intent', 'product interests'],
    company: 'Amazon'
  },

  // Microsoft tracking
  'bing.com': {
    category: 'Analytics',
    riskLevel: 'medium',
    riskScore: 60,
    description: 'Bing Ads tracking for conversion and user behavior analysis',
    dataCollected: ['search queries', 'ad interactions', 'browsing patterns'],
    company: 'Microsoft'
  },

  // Adobe tracking
  'omtrdc.net': {
    category: 'Analytics',
    riskLevel: 'high',
    riskScore: 70,
    description: 'Adobe Analytics tracking for comprehensive user behavior analysis',
    dataCollected: ['user behavior', 'page analytics', 'conversion tracking', 'A/B test data'],
    company: 'Adobe'
  },

  // Other common trackers
  'hotjar.com': {
    category: 'Analytics',
    riskLevel: 'high',
    riskScore: 75,
    description: 'Records user sessions including mouse movements, clicks, and scrolls',
    dataCollected: ['session recordings', 'heatmaps', 'form interactions', 'user behavior'],
    company: 'Hotjar'
  },
  'mixpanel.com': {
    category: 'Analytics',
    riskLevel: 'high',
    riskScore: 70,
    description: 'Advanced product analytics tracking user journeys and events',
    dataCollected: ['user events', 'funnel data', 'retention metrics', 'user properties'],
    company: 'Mixpanel'
  },
  'segment.com': {
    category: 'Analytics',
    riskLevel: 'medium',
    riskScore: 65,
    description: 'Data pipeline that forwards tracking data to multiple analytics services',
    dataCollected: ['user events', 'traits', 'page views'],
    company: 'Segment'
  },
  'clarity.ms': {
    category: 'Analytics',
    riskLevel: 'high',
    riskScore: 75,
    description: 'Microsoft Clarity records user sessions with heatmaps and recordings',
    dataCollected: ['session recordings', 'heatmaps', 'rage clicks', 'user behavior'],
    company: 'Microsoft'
  }
};

/**
 * Get tracker information from database
 */
export function getTrackerInfo(domain: string): TrackerInfo | null {
  // Direct match
  if (trackerDatabase[domain]) {
    return trackerDatabase[domain];
  }

  // Check if domain is subdomain of known tracker
  for (const [knownDomain, info] of Object.entries(trackerDatabase)) {
    if (domain.endsWith(knownDomain)) {
      return info;
    }
  }

  // Unknown tracker - return default medium risk
  return {
    category: 'Unknown',
    riskLevel: 'medium',
    riskScore: 50,
    description: 'Unknown tracking service',
    dataCollected: ['unknown']
  };
}

/**
 * Calculate overall risk score for a collection of trackers
 */
export function calculateOverallRisk(trackerDomains: string[]): {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
} {
  const counts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  };

  let totalScore = 0;

  trackerDomains.forEach(domain => {
    const info = getTrackerInfo(domain);
    if (info) {
      totalScore += info.riskScore;
      counts[info.riskLevel]++;
    }
  });

  const avgScore = trackerDomains.length > 0 ? totalScore / trackerDomains.length : 0;

  let level: 'low' | 'medium' | 'high' | 'critical';
  if (avgScore >= 80) level = 'critical';
  else if (avgScore >= 65) level = 'high';
  else if (avgScore >= 40) level = 'medium';
  else level = 'low';

  return {
    score: Math.round(avgScore),
    level,
    criticalCount: counts.critical,
    highCount: counts.high,
    mediumCount: counts.medium,
    lowCount: counts.low
  };
}

/**
 * Get risk color for UI display
 */
export function getRiskColor(level: string): string {
  switch (level) {
    case 'critical': return '#d32f2f';
    case 'high': return '#f57c00';
    case 'medium': return '#fbc02d';
    case 'low': return '#388e3c';
    default: return '#757575';
  }
}
