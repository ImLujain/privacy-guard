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
 * Helper function to make Ollama requests through background script (bypasses CORS)
 */
async function ollamaFetch(url: string, options: any = {}): Promise<Response> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: 'ollamaRequest',
      url: url,
      method: options.method || 'GET',
      headers: options.headers || {},
      body: options.body ? JSON.parse(JSON.stringify(options.body)) : undefined,
      timeout: options.timeout
    }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      if (response.success) {
        // Create a mock Response object
        resolve({
          ok: true,
          status: 200,
          json: async () => response.data
        } as Response);
      } else {
        reject(new Error(response.error));
      }
    });
  });
}

/**
 * Check if Ollama is available
 */
export async function checkOllamaAvailability(config: OllamaConfig = DEFAULT_CONFIG): Promise<boolean> {
  try {
    const response = await ollamaFetch(`${config.baseUrl}/api/tags`, {
      method: 'GET',
      timeout: 5000
    });

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
    console.log('[AI Service] Config disabled, skipping AI generation');
    return null;
  }

  console.log('[AI Service] Starting AI insight generation...');
  console.log('[AI Service] Ollama URL:', config.baseUrl);
  console.log('[AI Service] Model:', config.model);
  console.log('[AI Service] Timeout:', config.timeout);

  try {
    // Check if Ollama is available
    console.log('[AI Service] Checking Ollama availability...');
    const isAvailable = await checkOllamaAvailability(config);
    if (!isAvailable) {
      console.warn('[AI Service] ✗ Ollama service not available at', config.baseUrl);
      return null;
    }
    console.log('[AI Service] ✓ Ollama is available');

    // Prepare tracker summary for AI
    const trackerSummary = prepareTrackerSummary(trackerData);
    console.log('[AI Service] Prepared tracker summary:', trackerSummary.substring(0, 100) + '...');

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

    // Call Ollama API through background script (bypasses CORS)
    console.log('[AI Service] Sending request to Ollama via background script...');

    const response = await ollamaFetch(`${config.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        model: config.model,
        prompt: prompt,
        stream: false,
        format: 'json'
      },
      timeout: config.timeout
    });

    if (!response.ok) {
      console.error('[AI Service] ✗ Ollama API returned error');
      throw new Error('Ollama API error');
    }

    console.log('[AI Service] ✓ Received response from Ollama');
    const data = await response.json();
    console.log('[AI Service] Response data:', data);

    // Parse Ollama response
    let aiResponse;
    try {
      aiResponse = JSON.parse(data.response);
      console.log('[AI Service] ✓ Successfully parsed JSON response');
    } catch (e) {
      console.warn('[AI Service] JSON parsing failed, using text parser');
      // If JSON parsing fails, try to extract info from text
      aiResponse = parseTextResponse(data.response);
    }

    // Normalize recommendations to ensure they're strings
    let recommendations = aiResponse.recommendations || [];
    if (Array.isArray(recommendations)) {
      recommendations = recommendations.map(rec => {
        if (typeof rec === 'string') {
          return rec;
        } else if (typeof rec === 'object' && rec !== null) {
          // If it's an object, try to extract a text property or stringify it
          return rec.text || rec.recommendation || JSON.stringify(rec);
        }
        return String(rec);
      });
    } else {
      recommendations = [];
    }

    // Normalize riskAnalysis to ensure it's a string
    let riskAnalysis = aiResponse.riskAnalysis || 'No detailed analysis available';
    if (typeof riskAnalysis !== 'string') {
      if (typeof riskAnalysis === 'object' && riskAnalysis !== null) {
        riskAnalysis = riskAnalysis.text || riskAnalysis.analysis || JSON.stringify(riskAnalysis);
      } else {
        riskAnalysis = String(riskAnalysis);
      }
    }

    // Normalize summary to ensure it's a string
    let summary = aiResponse.summary || 'AI analysis completed';
    if (typeof summary !== 'string') {
      if (typeof summary === 'object' && summary !== null) {
        summary = summary.text || summary.summary || JSON.stringify(summary);
      } else {
        summary = String(summary);
      }
    }

    const result = {
      summary: summary,
      recommendations: recommendations.slice(0, 5),
      privacyScore: aiResponse.privacyScore || 50,
      riskAnalysis: riskAnalysis,
      timestamp: new Date().toISOString()
    };

    console.log('[AI Service] ✓ AI insights generated successfully:', result);
    return result;

  } catch (error) {
    console.error('[AI Service] ✗ Error generating AI insights:', error);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[AI Service] Request timed out after', config.timeout, 'ms');
    }
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
    // Only count valid string categories
    if (tracker.category && typeof tracker.category === 'string') {
      categories[tracker.category] = (categories[tracker.category] || 0) + 1;
    }
    if (tracker.company && typeof tracker.company === 'string') {
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
  const categories = [...new Set(trackerData.map(t => t.category).filter(c => c && typeof c === 'string'))];
  const categoryText = categories.length > 0 ? categories.join(', ') : 'various categories';
  const riskAnalysis = `Detected ${trackerData.length} trackers across ${categories.length} categories: ${categoryText}. ${
    hasHighRisk
      ? 'High-risk trackers can create detailed profiles of your behavior and interests.'
      : 'Most trackers are standard analytics tools.'
  }`;

  console.log('[AI Service] Risk analysis generated:', riskAnalysis);

  const result = {
    summary,
    recommendations: recommendations.slice(0, 5),
    privacyScore,
    riskAnalysis,
    timestamp: new Date().toISOString()
  };

  console.log('[AI Service] Rule-based insights result:', result);
  return result;
}

/**
 * Get insights (AI or rule-based depending on configuration)
 */
export async function getInsights(
  trackerData: any[],
  riskScore: number,
  riskLevel: string
): Promise<AIInsight & { source: 'ai' | 'rule-based' }> {
  const config = await getAIConfig();

  console.log('[AI Service] Configuration:', config);
  console.log('[AI Service] Tracker data count:', trackerData.length);

  if (config.enabled) {
    console.log('[AI Service] AI is enabled, attempting to generate AI insights...');
    const aiInsights = await generateAIInsights(trackerData, riskScore, config);
    if (aiInsights) {
      console.log('[AI Service] ✓ AI insights generated successfully!');
      return { ...aiInsights, source: 'ai' };
    }
    // If AI fails, fall back to rule-based
    console.warn('[AI Service] AI insights failed, falling back to rule-based analysis');
  } else {
    console.log('[AI Service] AI is disabled, using rule-based analysis');
  }

  // Use rule-based insights
  const ruleBasedInsights = generateRuleBasedInsights(trackerData, riskScore, riskLevel);
  console.log('[AI Service] Generated rule-based insights');
  return { ...ruleBasedInsights, source: 'rule-based' };
}
