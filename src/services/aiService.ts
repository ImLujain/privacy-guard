// AI Service for Ollama Integration
export interface AIInsight {
  summary: string;
  recommendations: string[];
  privacyScore: number;
  riskAnalysis: string;
  timestamp: string;
}

export interface OllamaConfig {
  enabled: boolean;
  baseUrl: string;
  model: string;
  timeout: number;
}

const DEFAULT_CONFIG: OllamaConfig = {
  enabled: false,
  baseUrl: 'http://localhost:11434',
  model: 'llama2',
  timeout: 30000
};

/**
 * Check if Ollama is available
 */
export async function checkOllamaAvailability(config: OllamaConfig = DEFAULT_CONFIG): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${config.baseUrl}/api/tags`, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('Ollama not available:', error);
    return false;
  }
}

/**
 * Get AI configuration from storage
 */
export async function getAIConfig(): Promise<OllamaConfig> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['aiConfig'], (data) => {
      resolve(data.aiConfig || DEFAULT_CONFIG);
    });
  });
}

/**
 * Save AI configuration to storage
 */
export async function saveAIConfig(config: OllamaConfig): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ aiConfig: config }, () => {
      resolve();
    });
  });
}

/**
 * Generate AI insights using Ollama
 */
export async function generateAIInsights(
  trackerData: any[],
  riskScore: number,
  config: OllamaConfig = DEFAULT_CONFIG
): Promise<AIInsight | null> {
  if (!config.enabled) {
    return null;
  }

  try {
    // Check if Ollama is available
    const isAvailable = await checkOllamaAvailability(config);
    if (!isAvailable) {
      console.warn('Ollama service not available');
      return null;
    }

    // Prepare tracker summary for AI
    const trackerSummary = prepareTrackerSummary(trackerData);

    // Create prompt for Ollama
    const prompt = `You are a privacy and security expert analyzing browser tracking data.

Tracker Data:
${trackerSummary}

Overall Risk Score: ${riskScore}/100

Please analyze this tracking data and provide:
1. A brief summary (2-3 sentences) of the privacy risks
2. Three specific recommendations to improve privacy
3. A privacy score assessment (0-100, where 100 is excellent privacy)
4. Risk analysis explaining the main concerns

Format your response as JSON with these keys: summary, recommendations (array), privacyScore (number), riskAnalysis`;

    // Call Ollama API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(`${config.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        prompt: prompt,
        stream: false,
        format: 'json'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();

    // Parse Ollama response
    let aiResponse;
    try {
      aiResponse = JSON.parse(data.response);
    } catch (e) {
      // If JSON parsing fails, try to extract info from text
      aiResponse = parseTextResponse(data.response);
    }

    return {
      summary: aiResponse.summary || 'AI analysis completed',
      recommendations: aiResponse.recommendations || [],
      privacyScore: aiResponse.privacyScore || 50,
      riskAnalysis: aiResponse.riskAnalysis || 'No detailed analysis available',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error generating AI insights:', error);
    return null;
  }
}

/**
 * Prepare tracker data summary for AI analysis
 */
function prepareTrackerSummary(trackerData: any[]): string {
  const categories: Record<string, number> = {};
  const companies: Record<string, number> = {};

  trackerData.forEach(tracker => {
    categories[tracker.category] = (categories[tracker.category] || 0) + 1;
    if (tracker.company) {
      companies[tracker.company] = (companies[tracker.company] || 0) + 1;
    }
  });

  let summary = `Total Trackers: ${trackerData.length}\n\n`;

  summary += 'Categories:\n';
  Object.entries(categories).forEach(([category, count]) => {
    summary += `- ${category}: ${count}\n`;
  });

  if (Object.keys(companies).length > 0) {
    summary += '\nTop Companies:\n';
    Object.entries(companies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([company, count]) => {
        summary += `- ${company}: ${count} trackers\n`;
      });
  }

  return summary;
}

/**
 * Parse text response if JSON parsing fails
 */
function parseTextResponse(text: string): any {
  return {
    summary: text.substring(0, 200),
    recommendations: ['Enable profile switching', 'Clear cookies regularly', 'Use privacy-focused browser'],
    privacyScore: 50,
    riskAnalysis: text
  };
}

/**
 * Generate rule-based insights (fallback when AI is disabled)
 */
export function generateRuleBasedInsights(
  trackerData: any[],
  riskScore: number,
  riskLevel: string
): AIInsight {
  const recommendations: string[] = [];
  const hasHighRisk = riskLevel === 'high' || riskLevel === 'critical';

  // Generate recommendations based on risk level
  if (hasHighRisk) {
    recommendations.push('Switch to a privacy profile to mask your real identity');
    recommendations.push('Critical trackers detected - consider blocking them with uBlock Origin');
  }

  if (trackerData.some(t => t.category === 'Advertising')) {
    recommendations.push('Advertising trackers found - they build profiles for targeted ads');
  }

  if (trackerData.some(t => t.category === 'Social')) {
    recommendations.push('Social media trackers can follow you across websites');
  }

  recommendations.push('Regularly clear cookies and browsing data');
  recommendations.push('Consider using a VPN for additional privacy protection');

  // Calculate privacy score (inverse of risk score)
  const privacyScore = Math.max(0, 100 - riskScore);

  // Generate summary
  let summary = '';
  if (riskLevel === 'critical') {
    summary = 'Critical privacy risk detected! Multiple high-risk trackers are monitoring your activity. Immediate action recommended.';
  } else if (riskLevel === 'high') {
    summary = 'High privacy risk detected. Several trackers are collecting your browsing data across websites.';
  } else if (riskLevel === 'medium') {
    summary = 'Moderate tracking detected. Some data collection is occurring, but risk is manageable with proper precautions.';
  } else {
    summary = 'Low tracking activity. Your privacy is relatively well protected on visited sites.';
  }

  // Generate risk analysis
  const categories = [...new Set(trackerData.map(t => t.category))];
  const riskAnalysis = `Detected ${trackerData.length} trackers across ${categories.length} categories: ${categories.join(', ')}. ${
    hasHighRisk
      ? 'High-risk trackers can create detailed profiles of your behavior and interests.'
      : 'Most trackers are standard analytics tools.'
  }`;

  return {
    summary,
    recommendations: recommendations.slice(0, 5),
    privacyScore,
    riskAnalysis,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get insights (AI or rule-based depending on configuration)
 */
export async function getInsights(
  trackerData: any[],
  riskScore: number,
  riskLevel: string
): Promise<AIInsight> {
  const config = await getAIConfig();

  if (config.enabled) {
    const aiInsights = await generateAIInsights(trackerData, riskScore, config);
    if (aiInsights) {
      return aiInsights;
    }
    // If AI fails, fall back to rule-based
    console.log('AI insights failed, falling back to rule-based analysis');
  }

  // Use rule-based insights
  return generateRuleBasedInsights(trackerData, riskScore, riskLevel);
}
