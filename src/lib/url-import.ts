/**
 * URL Import Utility
 * Fetches job posting data from URLs and extracts relevant information
 */

/**
 * Extracted job data from URL
 */
export interface ExtractedJobData {
  position?: string;
  companyName?: string;
  location?: string;
  workType?: 'remote' | 'hybrid' | 'onsite';
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  jobDescription?: string;
  jobUrl: string;
  source?: string;
}

/**
 * Common job board patterns for extraction
 */
interface JobBoardPattern {
  domain: string;
  name: string;
  selectors: {
    title?: string[];
    company?: string[];
    location?: string[];
    salary?: string[];
    description?: string[];
    employmentType?: string[];
    workType?: string[];
  };
}

/**
 * Known job board patterns
 */
const JOB_BOARD_PATTERNS: JobBoardPattern[] = [
  {
    domain: 'linkedin.com',
    name: 'LinkedIn',
    selectors: {
      title: ['.top-card-layout__title', '.job-details-jobs-unified-top-card__job-title', 'h1'],
      company: ['.topcard__org-name-link', '.job-details-jobs-unified-top-card__company-name', '.topcard__flavor'],
      location: ['.topcard__flavor--bullet', '.job-details-jobs-unified-top-card__bullet'],
      description: ['.description__text', '.jobs-description__content'],
    },
  },
  {
    domain: 'indeed.com',
    name: 'Indeed',
    selectors: {
      title: ['.jobsearch-JobInfoHeader-title', '[data-testid="jobsearch-JobInfoHeader-title"]', 'h1'],
      company: ['.jobsearch-CompanyInfoContainer', '[data-testid="inlineHeader-companyName"]', '.companyName'],
      location: ['.jobsearch-JobInfoHeader-subtitle', '[data-testid="job-location"]', '.companyLocation'],
      salary: ['[data-testid="attribute_snippet_testid"]', '.salary-snippet-container'],
      description: ['#jobDescriptionText', '.jobsearch-jobDescriptionText'],
    },
  },
  {
    domain: 'glassdoor.com',
    name: 'Glassdoor',
    selectors: {
      title: ['.job-title', '[data-test="job-title"]', 'h1'],
      company: ['.employer-name', '[data-test="employer-name"]'],
      location: ['.location', '[data-test="emp-location"]'],
      salary: ['.salary-estimate', '[data-test="detailSalary"]'],
      description: ['.jobDescriptionContent', '[data-test="description"]'],
    },
  },
  {
    domain: 'greenhouse.io',
    name: 'Greenhouse',
    selectors: {
      title: ['.app-title', '.job-title', 'h1'],
      company: ['.company-name', '.heading'],
      location: ['.location', '.job-location'],
      description: ['#content', '.job-description', '#job_description'],
    },
  },
  {
    domain: 'lever.co',
    name: 'Lever',
    selectors: {
      title: ['.posting-headline h2', '.posting-title'],
      company: ['.main-header-logo img[alt]', '.company-name'],
      location: ['.location', '.posting-categories .sort-by-time'],
      description: ['.posting-page .section-wrapper', '.posting-description'],
    },
  },
  {
    domain: 'workday.com',
    name: 'Workday',
    selectors: {
      title: ['[data-automation-id="jobPostingHeader"]', '.job-title', 'h1'],
      company: ['.css-1h9qwzj', '.company-name'],
      location: ['[data-automation-id="locations"]', '.location'],
      description: ['[data-automation-id="jobPostingDescription"]', '.job-description'],
    },
  },
  {
    domain: 'monster.com',
    name: 'Monster',
    selectors: {
      title: ['.job-title', 'h1'],
      company: ['.company-name', '.company'],
      location: ['.location', '.job-location'],
      description: ['#JobDescription', '.job-description'],
    },
  },
  {
    domain: 'ziprecruiter.com',
    name: 'ZipRecruiter',
    selectors: {
      title: ['.job_title', 'h1'],
      company: ['.hiring_company', '.company_name'],
      location: ['.location', '.job_location'],
      description: ['.jobDescriptionSection', '.job_description'],
    },
  },
];

/**
 * Parse salary string to extract min/max values
 */
export function parseSalary(salaryText: string): {
  min?: number;
  max?: number;
  currency?: string;
} {
  if (!salaryText) return {};

  // Clean the text
  const cleanText = salaryText.replace(/,/g, '').toLowerCase();

  // Currency detection
  let currency = 'USD';
  if (cleanText.includes('£') || cleanText.includes('gbp')) currency = 'GBP';
  else if (cleanText.includes('€') || cleanText.includes('eur')) currency = 'EUR';
  else if (cleanText.includes('cad') || cleanText.includes('c$')) currency = 'CAD';
  else if (cleanText.includes('aud') || cleanText.includes('a$')) currency = 'AUD';

  // Extract numbers
  const numbers = cleanText.match(/\d+(?:\.\d+)?(?:k)?/g);
  if (!numbers || numbers.length === 0) return {};

  const parseNumber = (str: string): number => {
    const hasK = str.toLowerCase().includes('k');
    const num = parseFloat(str.replace(/k/i, ''));
    return hasK ? num * 1000 : num;
  };

  // Handle annual vs hourly
  const isHourly = cleanText.includes('hour') || cleanText.includes('/hr') || cleanText.includes('per hr');
  const multiplier = isHourly ? 2080 : 1; // Convert hourly to annual (40hrs * 52 weeks)

  if (numbers.length >= 2) {
    return {
      min: Math.round(parseNumber(numbers[0]) * multiplier),
      max: Math.round(parseNumber(numbers[1]) * multiplier),
      currency,
    };
  } else if (numbers.length === 1) {
    const value = Math.round(parseNumber(numbers[0]) * multiplier);
    return { min: value, max: value, currency };
  }

  return {};
}

/**
 * Detect work type from text
 */
export function detectWorkType(text: string): 'remote' | 'hybrid' | 'onsite' | undefined {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('fully remote') || lowerText.includes('100% remote') || lowerText.includes('work from home')) {
    return 'remote';
  }
  if (lowerText.includes('hybrid') || lowerText.includes('flexible')) {
    return 'hybrid';
  }
  if (lowerText.includes('on-site') || lowerText.includes('onsite') || lowerText.includes('in-office')) {
    return 'onsite';
  }
  if (lowerText.includes('remote')) {
    return 'remote';
  }

  return undefined;
}

/**
 * Detect employment type from text
 */
export function detectEmploymentType(text: string): 'full-time' | 'part-time' | 'contract' | 'internship' | undefined {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('intern') || lowerText.includes('internship')) {
    return 'internship';
  }
  if (lowerText.includes('contract') || lowerText.includes('contractor') || lowerText.includes('freelance')) {
    return 'contract';
  }
  if (lowerText.includes('part-time') || lowerText.includes('part time')) {
    return 'part-time';
  }
  if (lowerText.includes('full-time') || lowerText.includes('full time') || lowerText.includes('permanent')) {
    return 'full-time';
  }

  return undefined;
}

/**
 * Extract text content from HTML element
 */
function extractText(html: string, selectors: string[]): string | undefined {
  // Create a temporary DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  for (const selector of selectors) {
    try {
      const element = doc.querySelector(selector);
      if (element) {
        const text = element.textContent?.trim();
        if (text) return text;
      }
    } catch {
      // Invalid selector, continue to next
    }
  }

  return undefined;
}

/**
 * Extract job data from HTML using meta tags and common patterns
 */
function extractFromMetaTags(html: string): Partial<ExtractedJobData> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const data: Partial<ExtractedJobData> = {};

  // Try Open Graph and other meta tags
  const metaSelectors = {
    position: [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      'meta[name="title"]',
    ],
    companyName: [
      'meta[property="og:site_name"]',
      'meta[name="author"]',
    ],
    jobDescription: [
      'meta[property="og:description"]',
      'meta[name="description"]',
      'meta[name="twitter:description"]',
    ],
  };

  for (const [field, selectors] of Object.entries(metaSelectors)) {
    for (const selector of selectors) {
      const meta = doc.querySelector(selector);
      const content = meta?.getAttribute('content')?.trim();
      if (content) {
        (data as Record<string, unknown>)[field] = content;
        break;
      }
    }
  }

  // Try to extract from JSON-LD
  const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
  for (const script of jsonLdScripts) {
    try {
      const jsonData = JSON.parse(script.textContent || '');
      const jobPosting = Array.isArray(jsonData) 
        ? jsonData.find(item => item['@type'] === 'JobPosting')
        : jsonData['@type'] === 'JobPosting' ? jsonData : null;

      if (jobPosting) {
        data.position = data.position || jobPosting.title;
        data.companyName = data.companyName || jobPosting.hiringOrganization?.name;
        data.location = data.location || jobPosting.jobLocation?.address?.addressLocality;
        data.jobDescription = data.jobDescription || jobPosting.description;
        
        if (jobPosting.baseSalary) {
          const salary = jobPosting.baseSalary;
          data.salaryCurrency = salary.currency;
          if (salary.value) {
            if (typeof salary.value === 'object') {
              data.salaryMin = salary.value.minValue;
              data.salaryMax = salary.value.maxValue;
            } else {
              data.salaryMin = salary.value;
              data.salaryMax = salary.value;
            }
          }
        }

        if (jobPosting.employmentType) {
          const empType = Array.isArray(jobPosting.employmentType) 
            ? jobPosting.employmentType[0] 
            : jobPosting.employmentType;
          data.employmentType = detectEmploymentType(empType);
        }

        if (jobPosting.jobLocationType === 'TELECOMMUTE') {
          data.workType = 'remote';
        }
      }
    } catch {
      // Invalid JSON, continue
    }
  }

  // Extract from page title as fallback
  if (!data.position) {
    const title = doc.querySelector('title')?.textContent?.trim();
    if (title) {
      // Common patterns: "Job Title at Company" or "Job Title - Company"
      const match = title.match(/^(.+?)\s*(?:at|@|-|–|—|\|)\s*(.+?)(?:\s*[-|]|$)/);
      if (match) {
        data.position = match[1].trim();
        if (!data.companyName) {
          data.companyName = match[2].trim();
        }
      } else {
        data.position = title;
      }
    }
  }

  return data;
}

/**
 * Find job board pattern for URL
 */
function findJobBoardPattern(url: string): JobBoardPattern | undefined {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return JOB_BOARD_PATTERNS.find(pattern => hostname.includes(pattern.domain));
  } catch {
    return undefined;
  }
}

/**
 * Get source name from URL
 */
export function getSourceFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const pattern = JOB_BOARD_PATTERNS.find(p => hostname.includes(p.domain));
    if (pattern) return pattern.name;

    // Extract domain name
    const parts = hostname.replace('www.', '').split('.');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  } catch {
    return 'Web';
  }
}

/**
 * Fetch and parse job posting from URL
 * Uses a CORS proxy for cross-origin requests
 */
export async function fetchJobFromUrl(url: string): Promise<ExtractedJobData> {
  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new Error('Invalid URL format');
  }

  const result: ExtractedJobData = {
    jobUrl: url,
    source: getSourceFromUrl(url),
  };

  try {
    // Try fetching directly first (works for same-origin or CORS-enabled sites)
    let html: string;
    
    try {
      // Try direct fetch first
      const response = await fetch(url, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      html = await response.text();
    } catch {
      // Try using a public CORS proxy
      const proxyUrls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
      ];

      let lastError: Error | null = null;
      
      for (const proxyUrl of proxyUrls) {
        try {
          const response = await fetch(proxyUrl);
          if (response.ok) {
            html = await response.text();
            break;
          }
        } catch (e) {
          lastError = e as Error;
        }
      }

      if (!html!) {
        throw lastError || new Error('Failed to fetch URL');
      }
    }

    // Find matching job board pattern
    const pattern = findJobBoardPattern(url);

    // Extract from meta tags and JSON-LD first (most reliable)
    const metaData = extractFromMetaTags(html);
    Object.assign(result, metaData);

    // If we have a pattern, try to extract more specific data
    if (pattern) {
      if (pattern.selectors.title && !result.position) {
        result.position = extractText(html, pattern.selectors.title);
      }
      if (pattern.selectors.company && !result.companyName) {
        result.companyName = extractText(html, pattern.selectors.company);
      }
      if (pattern.selectors.location && !result.location) {
        result.location = extractText(html, pattern.selectors.location);
      }
      if (pattern.selectors.salary) {
        const salaryText = extractText(html, pattern.selectors.salary);
        if (salaryText && !result.salaryMin) {
          const salary = parseSalary(salaryText);
          result.salaryMin = salary.min;
          result.salaryMax = salary.max;
          result.salaryCurrency = salary.currency;
        }
      }
      if (pattern.selectors.description && !result.jobDescription) {
        result.jobDescription = extractText(html, pattern.selectors.description);
      }
    }

    // Try generic selectors if we're still missing data
    const genericSelectors: Record<keyof Pick<ExtractedJobData, 'position' | 'companyName' | 'location' | 'jobDescription'>, string[]> = {
      position: ['h1', '.job-title', '[class*="job-title"]', '[class*="position"]'],
      companyName: ['.company-name', '[class*="company"]', '[class*="employer"]'],
      location: ['.location', '[class*="location"]', '[class*="address"]'],
      jobDescription: ['.job-description', '[class*="description"]', '.content', 'article'],
    };

    for (const [field, selectors] of Object.entries(genericSelectors) as [keyof typeof genericSelectors, string[]][]) {
      if (!result[field]) {
        const value = extractText(html, selectors);
        if (value) {
          result[field] = value;
        }
      }
    }

    // Detect work type and employment type from all available text
    const fullText = [result.position, result.location, result.jobDescription]
      .filter(Boolean)
      .join(' ');

    if (!result.workType) {
      result.workType = detectWorkType(fullText);
    }
    if (!result.employmentType) {
      result.employmentType = detectEmploymentType(fullText);
    }

    // Clean up job description (remove excessive whitespace, limit length)
    if (result.jobDescription) {
      result.jobDescription = result.jobDescription
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 5000); // Limit to 5000 chars
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch job from URL:', error);
    // Return basic data with just the URL
    return result;
  }
}

/**
 * Validate if a URL looks like a job posting
 */
export function isLikelyJobUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    const hostname = urlObj.hostname.toLowerCase();

    // Check if it's a known job board
    if (JOB_BOARD_PATTERNS.some(p => hostname.includes(p.domain))) {
      return true;
    }

    // Check for common job-related URL patterns
    const jobPatterns = [
      /\/jobs?\//,
      /\/careers?\//,
      /\/positions?\//,
      /\/openings?\//,
      /\/opportunities?\//,
      /\/hiring\//,
      /\/apply/,
      /\/vacancy/,
      /\/recruitment/,
    ];

    return jobPatterns.some(pattern => pattern.test(pathname));
  } catch {
    return false;
  }
}
