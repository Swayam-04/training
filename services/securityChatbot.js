const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

class SecurityChatbot {
  constructor() {
    this.conversationHistory = new Map();
    this.incidentReports = new Map();
    this.initializeKnowledgeBase();
  }

  initializeKnowledgeBase() {
    this.knowledgeBase = {
      phishing: {
        keywords: ['phishing', 'suspicious email', 'fake email', 'scam', 'fraud'],
        responses: [
          "Phishing is a cyber attack that uses disguised email to trick you into revealing sensitive information. Here's what to look for:",
          "• Suspicious sender addresses",
          "• Urgent language or threats",
          "• Poor grammar and spelling",
          "• Unexpected attachments or links",
          "• Requests for passwords or personal info",
          "\nIf you receive a suspicious email, don't click any links or download attachments. Report it to IT immediately."
        ],
        actions: [
          "Don't click on suspicious links",
          "Don't download unexpected attachments",
          "Report the email to IT security",
          "Delete the email immediately"
        ]
      },
      password: {
        keywords: ['password', 'login', 'account', 'security', 'authentication'],
        responses: [
          "Strong password security is crucial for protecting your accounts. Here are the best practices:",
          "• Use at least 12 characters",
          "• Mix uppercase, lowercase, numbers, and symbols",
          "• Avoid common words or personal information",
          "• Use unique passwords for each account",
          "• Consider using a password manager",
          "• Enable two-factor authentication when available"
        ],
        actions: [
          "Create strong, unique passwords",
          "Use a password manager",
          "Enable 2FA where possible",
          "Never share passwords"
        ]
      },
      malware: {
        keywords: ['malware', 'virus', 'trojan', 'ransomware', 'infected'],
        responses: [
          "Malware is malicious software designed to damage or gain unauthorized access to systems. Signs include:",
          "• Slow computer performance",
          "• Unexpected pop-ups or ads",
          "• Unusual network activity",
          "• Files being encrypted or deleted",
          "• Browser redirects to unknown sites",
          "\nIf you suspect malware, disconnect from the network and contact IT immediately."
        ],
        actions: [
          "Disconnect from the internet",
          "Don't pay ransom demands",
          "Contact IT security immediately",
          "Run antivirus scans"
        ]
      },
      social: {
        keywords: ['social engineering', 'manipulation', 'tricked', 'deceived'],
        responses: [
          "Social engineering attacks manipulate people into revealing confidential information. Common tactics:",
          "• Pretexting - creating false scenarios",
          "• Baiting - offering something enticing",
          "• Quid pro quo - offering services for information",
          "• Impersonation - pretending to be someone else",
          "\nAlways verify requests through official channels before providing sensitive information."
        ],
        actions: [
          "Verify requests through official channels",
          "Be suspicious of unsolicited requests",
          "Don't provide information over the phone",
          "Report suspicious behavior"
        ]
      }
    };

    this.securityTips = {
      general: [
        "Keep your software and operating system updated",
        "Use strong, unique passwords for all accounts",
        "Enable two-factor authentication when available",
        "Be cautious of suspicious emails and links",
        "Regularly backup your important data",
        "Use antivirus software and keep it updated",
        "Be careful when using public Wi-Fi",
        "Don't share personal information online"
      ],
      email: [
        "Verify sender email addresses before responding",
        "Don't click on links in suspicious emails",
        "Be cautious of urgent requests for information",
        "Check for poor grammar and spelling",
        "Hover over links to see the actual destination",
        "Report suspicious emails to IT security"
      ],
      password: [
        "Use a password manager to generate and store passwords",
        "Create passwords with at least 12 characters",
        "Include a mix of letters, numbers, and symbols",
        "Avoid using personal information in passwords",
        "Change passwords regularly",
        "Never reuse passwords across accounts"
      ],
      network: [
        "Use a VPN when connecting to public Wi-Fi",
        "Keep your router firmware updated",
        "Use strong Wi-Fi passwords",
        "Disable WPS if not needed",
        "Monitor network activity regularly",
        "Use a firewall to protect your network"
      ]
    };

    this.faq = {
      general: [
        {
          question: "What is cybersecurity?",
          answer: "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These attacks are usually aimed at accessing, changing, or destroying sensitive information."
        },
        {
          question: "Why is cybersecurity important for small businesses?",
          answer: "Small businesses are often targeted because they may have weaker security measures. A cyber attack can result in financial loss, data theft, and damage to reputation."
        },
        {
          question: "What should I do if I think my computer is infected?",
          answer: "Disconnect from the internet immediately, run a full antivirus scan, and contact your IT department or a cybersecurity professional."
        }
      ],
      phishing: [
        {
          question: "How can I identify a phishing email?",
          answer: "Look for suspicious sender addresses, urgent language, poor grammar, unexpected attachments, and requests for sensitive information."
        },
        {
          question: "What should I do if I clicked on a phishing link?",
          answer: "Immediately change your passwords, run antivirus scans, monitor your accounts for suspicious activity, and report the incident to IT security."
        }
      ],
      password: [
        {
          question: "How often should I change my passwords?",
          answer: "Change passwords every 60-90 days, or immediately if you suspect a security breach. Use unique passwords for each account."
        },
        {
          question: "Are password managers safe?",
          answer: "Yes, reputable password managers use strong encryption to protect your passwords. They're much safer than using weak or repeated passwords."
        }
      ]
    };

    this.incidentGuidance = {
      phishing: {
        title: "Phishing Incident Response",
        steps: [
          "Don't click any links or download attachments",
          "Don't reply to the email",
          "Report the incident to IT security",
          "Delete the email",
          "If you clicked a link, change your passwords immediately",
          "Monitor your accounts for suspicious activity"
        ],
        priority: "high"
      },
      malware: {
        title: "Malware Incident Response",
        steps: [
          "Disconnect from the internet immediately",
          "Don't pay any ransom demands",
          "Contact IT security or a cybersecurity professional",
          "Run a full antivirus scan",
          "Backup important data if possible",
          "Document the incident for reporting"
        ],
        priority: "critical"
      },
      data_breach: {
        title: "Data Breach Response",
        steps: [
          "Contain the breach immediately",
          "Assess the scope and impact",
          "Notify relevant authorities if required",
          "Inform affected individuals",
          "Document everything for legal purposes",
          "Implement additional security measures"
        ],
        priority: "critical"
      },
      social_engineering: {
        title: "Social Engineering Response",
        steps: [
          "Don't provide any additional information",
          "Verify the person's identity through official channels",
          "Report the incident to security",
          "Document what information was shared",
          "Change any compromised passwords",
          "Alert other employees about the tactic used"
        ],
        priority: "high"
      }
    };
  }

  async processMessage({ message, userId, companyId, context }) {
    const messageId = uuidv4();
    const timestamp = moment().toISOString();
    
    // Store conversation history
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
    }
    
    const userHistory = this.conversationHistory.get(userId);
    userHistory.push({
      id: messageId,
      type: 'user',
      message,
      timestamp
    });

    // Process the message
    const response = await this.generateResponse(message, context);
    
    // Store bot response
    userHistory.push({
      id: uuidv4(),
      type: 'bot',
      message: response.text,
      timestamp: moment().toISOString(),
      actions: response.actions,
      suggestions: response.suggestions
    });

    return {
      messageId,
      response: response.text,
      actions: response.actions,
      suggestions: response.suggestions,
      confidence: response.confidence,
      category: response.category,
      timestamp
    };
  }

  async generateResponse(message, context) {
    const lowerMessage = message.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    // Find the best matching category
    for (const [category, data] of Object.entries(this.knowledgeBase)) {
      let score = 0;
      for (const keyword of data.keywords) {
        if (lowerMessage.includes(keyword)) {
          score += 1;
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = category;
      }
    }

    // Generate response based on best match
    if (bestMatch && bestScore > 0) {
      const categoryData = this.knowledgeBase[bestMatch];
      return {
        text: categoryData.responses.join('\n'),
        actions: categoryData.actions,
        suggestions: this.getRelatedSuggestions(bestMatch),
        confidence: Math.min(bestScore / categoryData.keywords.length, 1.0),
        category: bestMatch
      };
    }

    // Default response for unmatched queries
    return {
      text: "I'm here to help with cybersecurity questions! I can assist with topics like phishing, password security, malware, and social engineering. What would you like to know?",
      actions: [],
      suggestions: [
        "How to identify phishing emails?",
        "Password security best practices",
        "What to do if I suspect malware?",
        "Social engineering awareness"
      ],
      confidence: 0.1,
      category: 'general'
    };
  }

  getRelatedSuggestions(category) {
    const suggestions = {
      phishing: [
        "How to report phishing emails?",
        "What are common phishing tactics?",
        "How to verify email authenticity?"
      ],
      password: [
        "How to create strong passwords?",
        "Password manager recommendations",
        "Two-factor authentication setup"
      ],
      malware: [
        "Signs of malware infection",
        "How to remove malware?",
        "Preventing malware attacks"
      ],
      social: [
        "Common social engineering tactics",
        "How to verify caller identity?",
        "Protecting against manipulation"
      ]
    };

    return suggestions[category] || [];
  }

  async getSecurityTips(category) {
    const tips = this.securityTips[category] || this.securityTips.general;
    
    return {
      category: category || 'general',
      tips: tips.map((tip, index) => ({
        id: index + 1,
        tip,
        category: category || 'general'
      })),
      total: tips.length
    };
  }

  async getFAQ(topic) {
    const faq = this.faq[topic] || this.faq.general;
    
    return {
      topic: topic || 'general',
      questions: faq,
      total: faq.length
    };
  }

  async reportIncident({ userId, companyId, incidentType, description, severity }) {
    const incidentId = uuidv4();
    const timestamp = moment().toISOString();
    
    const incident = {
      id: incidentId,
      userId,
      companyId,
      type: incidentType,
      description,
      severity,
      status: 'reported',
      timestamp,
      guidance: this.incidentGuidance[incidentType] || null
    };

    this.incidentReports.set(incidentId, incident);

    return {
      incidentId,
      status: 'reported',
      message: 'Incident reported successfully. IT security has been notified.',
      guidance: incident.guidance,
      nextSteps: this.getNextSteps(incidentType, severity),
      timestamp
    };
  }

  async getIncidentGuidance(incidentType) {
    const guidance = this.incidentGuidance[incidentType];
    
    if (!guidance) {
      return {
        error: 'Incident type not found',
        availableTypes: Object.keys(this.incidentGuidance)
      };
    }

    return {
      incidentType,
      guidance,
      additionalResources: this.getAdditionalResources(incidentType)
    };
  }

  async getConversationHistory(userId, limit) {
    const history = this.conversationHistory.get(userId) || [];
    
    return {
      userId,
      history: history.slice(-parseInt(limit)),
      total: history.length
    };
  }

  getNextSteps(incidentType, severity) {
    const nextSteps = {
      high: [
        "Contact IT security immediately",
        "Document all details of the incident",
        "Follow the provided guidance steps",
        "Monitor for any additional suspicious activity"
      ],
      medium: [
        "Report to IT security within 24 hours",
        "Document the incident details",
        "Follow recommended security practices",
        "Update your security awareness"
      ],
      low: [
        "Report to IT security when convenient",
        "Learn from the incident",
        "Share knowledge with colleagues",
        "Continue following security best practices"
      ]
    };

    return nextSteps[severity] || nextSteps.medium;
  }

  getAdditionalResources(incidentType) {
    const resources = {
      phishing: [
        "Phishing awareness training module",
        "Email security best practices guide",
        "How to report suspicious emails"
      ],
      malware: [
        "Malware removal guide",
        "Antivirus software recommendations",
        "System security checklist"
      ],
      data_breach: [
        "Data breach response plan",
        "Legal compliance requirements",
        "Customer notification templates"
      ],
      social_engineering: [
        "Social engineering awareness training",
        "Verification procedures guide",
        "Incident reporting process"
      ]
    };

    return resources[incidentType] || ["General security awareness training"];
  }
}

module.exports = SecurityChatbot;
