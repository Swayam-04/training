const natural = require('natural');
const cheerio = require('cheerio');
const sentiment = require('sentiment');
const { URL } = require('url');

class PhishingDetector {
  constructor() {
    this.sentimentAnalyzer = new sentiment();
    this.statistics = {
      totalScans: 0,
      phishingDetected: 0,
      falsePositives: 0,
      falseNegatives: 0
    };
    
    // Initialize phishing patterns
    this.phishingPatterns = {
      urgency: [
        'urgent', 'immediate', 'asap', 'expires', 'limited time', 
        'act now', 'verify account', 'suspended', 'locked'
      ],
      suspiciousDomains: [
        'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly'
      ],
      suspiciousWords: [
        'click here', 'verify now', 'update account', 'confirm identity',
        'security alert', 'unauthorized access', 'account compromised'
      ],
      suspiciousExtensions: ['.exe', '.scr', '.bat', '.cmd', '.com', '.pif']
    };

    // Known phishing indicators
    this.phishingIndicators = {
      email: {
        suspiciousSender: 0.3,
        urgencyLanguage: 0.4,
        suspiciousLinks: 0.5,
        attachments: 0.3,
        grammarErrors: 0.2,
        suspiciousDomain: 0.4
      },
      url: {
        suspiciousDomain: 0.6,
        shortUrl: 0.3,
        suspiciousPath: 0.4,
        httpsMissing: 0.2,
        suspiciousSubdomain: 0.3
      }
    };
  }

  async analyzeEmail(emailData) {
    const { subject, body, sender, attachments } = emailData;
    let riskScore = 0;
    const threats = [];
    const analysis = {};

    // Analyze sender
    const senderAnalysis = this.analyzeSender(sender);
    riskScore += senderAnalysis.score * this.phishingIndicators.email.suspiciousSender;
    if (senderAnalysis.threats.length > 0) {
      threats.push(...senderAnalysis.threats);
    }
    analysis.sender = senderAnalysis;

    // Analyze subject
    const subjectAnalysis = this.analyzeText(subject);
    riskScore += subjectAnalysis.urgencyScore * this.phishingIndicators.email.urgencyLanguage;
    if (subjectAnalysis.threats.length > 0) {
      threats.push(...subjectAnalysis.threats);
    }
    analysis.subject = subjectAnalysis;

    // Analyze body
    const bodyAnalysis = this.analyzeEmailBody(body);
    riskScore += bodyAnalysis.riskScore;
    if (bodyAnalysis.threats.length > 0) {
      threats.push(...bodyAnalysis.threats);
    }
    analysis.body = bodyAnalysis;

    // Analyze attachments
    if (attachments && attachments.length > 0) {
      const attachmentAnalysis = this.analyzeAttachments(attachments);
      riskScore += attachmentAnalysis.score * this.phishingIndicators.email.attachments;
      if (attachmentAnalysis.threats.length > 0) {
        threats.push(...attachmentAnalysis.threats);
      }
      analysis.attachments = attachmentAnalysis;
    }

    // Determine if phishing
    const isPhishing = riskScore > 0.5;
    const confidence = Math.min(riskScore, 1.0);
    const riskLevel = this.getRiskLevel(riskScore);

    // Generate recommendations
    const recommendations = this.generateRecommendations(threats, riskLevel);

    this.statistics.totalScans++;
    if (isPhishing) {
      this.statistics.phishingDetected++;
    }

    return {
      isPhishing,
      confidence,
      riskLevel,
      threats: [...new Set(threats)], // Remove duplicates
      recommendations,
      analysis,
      riskScore
    };
  }

  async analyzeUrl(url) {
    let riskScore = 0;
    const threats = [];
    const analysis = {};

    try {
      const urlObj = new URL(url);
      
      // Analyze domain
      const domainAnalysis = this.analyzeDomain(urlObj.hostname);
      riskScore += domainAnalysis.score * this.phishingIndicators.url.suspiciousDomain;
      if (domainAnalysis.threats.length > 0) {
        threats.push(...domainAnalysis.threats);
      }
      analysis.domain = domainAnalysis;

      // Analyze path
      const pathAnalysis = this.analyzePath(urlObj.pathname);
      riskScore += pathAnalysis.score * this.phishingIndicators.url.suspiciousPath;
      if (pathAnalysis.threats.length > 0) {
        threats.push(...pathAnalysis.threats);
      }
      analysis.path = pathAnalysis;

      // Check for HTTPS
      if (urlObj.protocol !== 'https:') {
        riskScore += 0.2 * this.phishingIndicators.url.httpsMissing;
        threats.push('URL does not use HTTPS encryption');
      }

      // Check for short URL services
      if (this.phishingPatterns.suspiciousDomains.includes(urlObj.hostname)) {
        riskScore += 0.3 * this.phishingIndicators.url.shortUrl;
        threats.push('URL uses suspicious short URL service');
      }

    } catch (error) {
      riskScore += 0.5;
      threats.push('Invalid URL format');
    }

    const isPhishing = riskScore > 0.5;
    const confidence = Math.min(riskScore, 1.0);
    const riskLevel = this.getRiskLevel(riskScore);

    const recommendations = this.generateRecommendations(threats, riskLevel);

    this.statistics.totalScans++;
    if (isPhishing) {
      this.statistics.phishingDetected++;
    }

    return {
      isPhishing,
      confidence,
      riskLevel,
      threats: [...new Set(threats)],
      recommendations,
      analysis,
      riskScore
    };
  }

  analyzeSender(sender) {
    const threats = [];
    let score = 0;

    // Check for suspicious patterns in email
    if (sender.includes('noreply') || sender.includes('no-reply')) {
      score += 0.2;
    }

    // Check for suspicious domains
    const domain = sender.split('@')[1];
    if (domain && this.isSuspiciousDomain(domain)) {
      score += 0.4;
      threats.push('Suspicious sender domain detected');
    }

    // Check for random-looking email addresses
    if (this.isRandomEmail(sender)) {
      score += 0.3;
      threats.push('Random-looking email address pattern');
    }

    return { score, threats };
  }

  analyzeText(text) {
    const threats = [];
    let urgencyScore = 0;

    const lowerText = text.toLowerCase();

    // Check for urgency indicators
    for (const pattern of this.phishingPatterns.urgency) {
      if (lowerText.includes(pattern)) {
        urgencyScore += 0.1;
      }
    }

    if (urgencyScore > 0.3) {
      threats.push('Urgent language detected - common phishing tactic');
    }

    // Check for suspicious words
    for (const word of this.phishingPatterns.suspiciousWords) {
      if (lowerText.includes(word)) {
        urgencyScore += 0.2;
        threats.push(`Suspicious phrase detected: "${word}"`);
      }
    }

    // Analyze sentiment
    const sentimentResult = this.sentimentAnalyzer.analyze(text);
    if (sentimentResult.score < -2) {
      urgencyScore += 0.2;
      threats.push('Negative sentiment detected - potential scare tactic');
    }

    return { urgencyScore, threats };
  }

  analyzeEmailBody(body) {
    const threats = [];
    let riskScore = 0;

    // Parse HTML if present
    const $ = cheerio.load(body);
    const textContent = $.text();

    // Analyze text content
    const textAnalysis = this.analyzeText(textContent);
    riskScore += textAnalysis.urgencyScore;
    threats.push(...textAnalysis.threats);

    // Check for suspicious links
    const links = [];
    $('a').each((i, element) => {
      const href = $(element).attr('href');
      if (href) {
        links.push(href);
      }
    });

    if (links.length > 0) {
      const linkAnalysis = this.analyzeLinks(links);
      riskScore += linkAnalysis.score * this.phishingIndicators.email.suspiciousLinks;
      threats.push(...linkAnalysis.threats);
    }

    // Check for grammar errors (simple heuristic)
    const grammarErrors = this.detectGrammarErrors(textContent);
    if (grammarErrors > 3) {
      riskScore += 0.2 * this.phishingIndicators.email.grammarErrors;
      threats.push('Multiple grammar errors detected');
    }

    return { riskScore, threats };
  }

  analyzeAttachments(attachments) {
    const threats = [];
    let score = 0;

    for (const attachment of attachments) {
      const filename = attachment.name || attachment;
      const extension = filename.split('.').pop().toLowerCase();

      if (this.phishingPatterns.suspiciousExtensions.includes(`.${extension}`)) {
        score += 0.5;
        threats.push(`Suspicious file attachment: ${filename}`);
      }
    }

    return { score, threats };
  }

  analyzeDomain(domain) {
    const threats = [];
    let score = 0;

    // Check for suspicious patterns
    if (domain.includes('typo') || domain.includes('misspell')) {
      score += 0.4;
      threats.push('Domain appears to be a typo-squatting attempt');
    }

    // Check for random-looking domains
    if (this.isRandomDomain(domain)) {
      score += 0.3;
      threats.push('Random-looking domain pattern');
    }

    // Check for suspicious subdomains
    const parts = domain.split('.');
    if (parts.length > 3) {
      score += 0.2;
      threats.push('Unusually long domain with many subdomains');
    }

    return { score, threats };
  }

  analyzePath(path) {
    const threats = [];
    let score = 0;

    // Check for suspicious patterns in path
    if (path.includes('login') || path.includes('verify') || path.includes('confirm')) {
      score += 0.3;
      threats.push('Path contains suspicious authentication-related keywords');
    }

    // Check for random-looking paths
    if (this.isRandomPath(path)) {
      score += 0.2;
      threats.push('Random-looking URL path');
    }

    return { score, threats };
  }

  analyzeLinks(links) {
    const threats = [];
    let score = 0;

    for (const link of links) {
      try {
        const urlObj = new URL(link);
        
        // Check for suspicious domains
        if (this.isSuspiciousDomain(urlObj.hostname)) {
          score += 0.3;
          threats.push(`Suspicious link domain: ${urlObj.hostname}`);
        }

        // Check for short URL services
        if (this.phishingPatterns.suspiciousDomains.includes(urlObj.hostname)) {
          score += 0.2;
          threats.push(`Short URL service detected: ${urlObj.hostname}`);
        }
      } catch (error) {
        score += 0.4;
        threats.push(`Invalid link format: ${link}`);
      }
    }

    return { score, threats };
  }

  isSuspiciousDomain(domain) {
    // Simple heuristic for suspicious domains
    const suspiciousPatterns = [
      /[0-9]{4,}/, // Many numbers
      /[a-z]{1,2}[0-9]{3,}/, // Short letters followed by many numbers
      /[0-9]{3,}[a-z]{1,2}/ // Many numbers followed by short letters
    ];

    return suspiciousPatterns.some(pattern => pattern.test(domain));
  }

  isRandomEmail(email) {
    const localPart = email.split('@')[0];
    const randomPatterns = [
      /^[a-z0-9]{8,}$/, // Long random string
      /[0-9]{4,}/, // Many numbers
      /[a-z]{1,2}[0-9]{3,}/ // Short letters followed by many numbers
    ];

    return randomPatterns.some(pattern => pattern.test(localPart));
  }

  isRandomDomain(domain) {
    const randomPatterns = [
      /^[a-z0-9]{10,}$/, // Very long random string
      /[0-9]{5,}/, // Many consecutive numbers
      /[a-z]{1,3}[0-9]{4,}/ // Short letters followed by many numbers
    ];

    return randomPatterns.some(pattern => pattern.test(domain));
  }

  isRandomPath(path) {
    const randomPatterns = [
      /^\/[a-z0-9]{8,}$/, // Long random string
      /\/[0-9]{4,}/, // Many numbers
      /\/[a-z]{1,3}[0-9]{4,}/ // Short letters followed by many numbers
    ];

    return randomPatterns.some(pattern => pattern.test(path));
  }

  detectGrammarErrors(text) {
    // Simple grammar error detection
    const sentences = text.split(/[.!?]+/);
    let errors = 0;

    for (const sentence of sentences) {
      const words = sentence.trim().split(/\s+/);
      
      // Check for common grammar issues
      if (words.length > 0) {
        // Check for missing capitalization
        if (words[0] && words[0][0] && words[0][0] !== words[0][0].toUpperCase()) {
          errors++;
        }
        
        // Check for repeated words
        for (let i = 0; i < words.length - 1; i++) {
          if (words[i].toLowerCase() === words[i + 1].toLowerCase()) {
            errors++;
          }
        }
      }
    }

    return errors;
  }

  getRiskLevel(score) {
    if (score >= 0.8) return 'CRITICAL';
    if (score >= 0.6) return 'HIGH';
    if (score >= 0.4) return 'MEDIUM';
    if (score >= 0.2) return 'LOW';
    return 'MINIMAL';
  }

  generateRecommendations(threats, riskLevel) {
    const recommendations = [];

    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      recommendations.push('DO NOT click any links or download attachments');
      recommendations.push('Report this as a potential phishing attempt');
      recommendations.push('Delete the email immediately');
    }

    if (threats.some(t => t.includes('suspicious domain'))) {
      recommendations.push('Verify the sender through official channels');
    }

    if (threats.some(t => t.includes('urgency'))) {
      recommendations.push('Be cautious of urgent requests - legitimate companies rarely use high-pressure tactics');
    }

    if (threats.some(t => t.includes('attachment'))) {
      recommendations.push('Do not open suspicious attachments');
    }

    if (threats.some(t => t.includes('link'))) {
      recommendations.push('Hover over links to verify destinations before clicking');
    }

    if (recommendations.length === 0) {
      recommendations.push('Exercise caution and verify through official channels if unsure');
    }

    return recommendations;
  }

  async getStatistics() {
    return {
      ...this.statistics,
      accuracy: this.statistics.totalScans > 0 ? 
        (this.statistics.phishingDetected / this.statistics.totalScans) : 0
    };
  }

  async reportFeedback(feedback) {
    // In a real implementation, this would update the ML model
    console.log('Feedback received:', feedback);
    
    if (feedback.actualResult !== feedback.isPhishing) {
      if (feedback.isPhishing) {
        this.statistics.falsePositives++;
      } else {
        this.statistics.falseNegatives++;
      }
    }
  }
}

module.exports = PhishingDetector;
