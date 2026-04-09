const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

class SecurityDashboard {
  constructor() {
    this.companyData = new Map();
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Initialize sample data for demo purposes
    const sampleCompanyId = 'demo-company-001';
    
    this.companyData.set(sampleCompanyId, {
      companyId: sampleCompanyId,
      name: 'Demo SME Company',
      securityHealthScore: 75,
      lastUpdated: moment().toISOString(),
      metrics: {
        phishingAttempts: 12,
        blockedThreats: 45,
        trainingCompletions: 23,
        securityIncidents: 3,
        employeeCount: 25
      },
      alerts: [
        {
          id: uuidv4(),
          type: 'phishing',
          severity: 'high',
          title: 'Suspicious email detected',
          description: 'Multiple employees received phishing emails from suspicious domain',
          timestamp: moment().subtract(2, 'hours').toISOString(),
          status: 'active',
          affectedUsers: 5
        },
        {
          id: uuidv4(),
          type: 'training',
          severity: 'medium',
          title: 'Training completion overdue',
          description: '15 employees have not completed required security training',
          timestamp: moment().subtract(1, 'day').toISOString(),
          status: 'active',
          affectedUsers: 15
        }
      ],
      awareness: {
        averageScore: 78,
        departmentScores: {
          'IT': 92,
          'HR': 85,
          'Finance': 88,
          'Sales': 65,
          'Marketing': 70
        },
        recentImprovements: 12
      },
      incidents: [
        {
          id: uuidv4(),
          type: 'phishing',
          severity: 'medium',
          description: 'Employee clicked on suspicious link in email',
          timestamp: moment().subtract(3, 'days').toISOString(),
          resolved: true,
          impact: 'minimal'
        },
        {
          id: uuidv4(),
          type: 'malware',
          severity: 'high',
          description: 'Malware detected on workstation',
          timestamp: moment().subtract(1, 'week').toISOString(),
          resolved: true,
          impact: 'contained'
        }
      ],
      compliance: {
        gdpr: 85,
        iso27001: 70,
        pci: 90,
        lastAudit: moment().subtract(1, 'month').toISOString()
      },
      trends: {
        phishingTrend: [5, 8, 12, 10, 15, 12, 8],
        trainingTrend: [20, 25, 30, 28, 35, 40, 45],
        incidentTrend: [2, 1, 3, 2, 1, 2, 1]
      }
    });
  }

  async getSecurityHealthScore(companyId) {
    const company = this.companyData.get(companyId) || this.createDefaultCompany(companyId);
    
    return {
      companyId,
      score: company.securityHealthScore,
      level: this.getHealthLevel(company.securityHealthScore),
      lastUpdated: company.lastUpdated,
      breakdown: {
        emailSecurity: Math.floor(company.securityHealthScore * 0.9),
        trainingCompliance: Math.floor(company.securityHealthScore * 0.8),
        incidentResponse: Math.floor(company.securityHealthScore * 0.7),
        accessControl: Math.floor(company.securityHealthScore * 0.85)
      }
    };
  }

  async getSecurityMetrics(companyId, timeframe) {
    const company = this.companyData.get(companyId) || this.createDefaultCompany(companyId);
    
    const days = this.getTimeframeDays(timeframe);
    const startDate = moment().subtract(days, 'days');
    
    return {
      companyId,
      timeframe,
      period: {
        start: startDate.toISOString(),
        end: moment().toISOString()
      },
      metrics: {
        totalThreats: company.metrics.blockedThreats,
        phishingAttempts: company.metrics.phishingAttempts,
        trainingCompletions: company.metrics.trainingCompletions,
        securityIncidents: company.metrics.securityIncidents,
        employeeCount: company.metrics.employeeCount,
        threatBlockRate: 95.2,
        trainingCompletionRate: Math.round((company.metrics.trainingCompletions / company.metrics.employeeCount) * 100)
      },
      trends: this.calculateTrends(company.trends, days)
    };
  }

  async getThreatAlerts(companyId, status) {
    const company = this.companyData.get(companyId) || this.createDefaultCompany(companyId);
    
    let alerts = company.alerts;
    if (status !== 'all') {
      alerts = alerts.filter(alert => alert.status === status);
    }
    
    return {
      companyId,
      status,
      alerts: alerts.map(alert => ({
        ...alert,
        timeAgo: moment(alert.timestamp).fromNow()
      })),
      summary: {
        total: alerts.length,
        high: alerts.filter(a => a.severity === 'high').length,
        medium: alerts.filter(a => a.severity === 'medium').length,
        low: alerts.filter(a => a.severity === 'low').length
      }
    };
  }

  async getAwarenessScores(companyId) {
    const company = this.companyData.get(companyId) || this.createDefaultCompany(companyId);
    
    return {
      companyId,
      overall: company.awareness,
      topPerformers: this.getTopPerformers(company.awareness.departmentScores),
      areasForImprovement: this.getAreasForImprovement(company.awareness.departmentScores),
      recommendations: this.getAwarenessRecommendations(company.awareness)
    };
  }

  async getSecurityRecommendations(companyId) {
    const company = this.companyData.get(companyId) || this.createDefaultCompany(companyId);
    
    const recommendations = [];
    
    // Generate recommendations based on current state
    if (company.securityHealthScore < 80) {
      recommendations.push({
        id: uuidv4(),
        priority: 'high',
        category: 'training',
        title: 'Improve Security Training Completion',
        description: 'Increase training completion rates to improve overall security posture',
        impact: 'high',
        effort: 'medium',
        timeline: '2 weeks'
      });
    }
    
    if (company.metrics.phishingAttempts > 10) {
      recommendations.push({
        id: uuidv4(),
        priority: 'high',
        category: 'email',
        title: 'Enhance Email Security',
        description: 'Implement additional email filtering and employee training',
        impact: 'high',
        effort: 'low',
        timeline: '1 week'
      });
    }
    
    if (company.awareness.averageScore < 80) {
      recommendations.push({
        id: uuidv4(),
        priority: 'medium',
        category: 'awareness',
        title: 'Boost Security Awareness',
        description: 'Conduct additional security awareness sessions',
        impact: 'medium',
        effort: 'medium',
        timeline: '3 weeks'
      });
    }
    
    return {
      companyId,
      recommendations,
      summary: {
        total: recommendations.length,
        high: recommendations.filter(r => r.priority === 'high').length,
        medium: recommendations.filter(r => r.priority === 'medium').length,
        low: recommendations.filter(r => r.priority === 'low').length
      }
    };
  }

  async getSecurityIncidents(companyId, limit) {
    const company = this.companyData.get(companyId) || this.createDefaultCompany(companyId);
    
    return {
      companyId,
      incidents: company.incidents
        .sort((a, b) => moment(b.timestamp).diff(moment(a.timestamp)))
        .slice(0, parseInt(limit))
        .map(incident => ({
          ...incident,
          timeAgo: moment(incident.timestamp).fromNow()
        })),
      summary: {
        total: company.incidents.length,
        resolved: company.incidents.filter(i => i.resolved).length,
        active: company.incidents.filter(i => !i.resolved).length
      }
    };
  }

  async getComplianceStatus(companyId) {
    const company = this.companyData.get(companyId) || this.createDefaultCompany(companyId);
    
    return {
      companyId,
      compliance: company.compliance,
      status: this.getOverallComplianceStatus(company.compliance),
      nextAudit: moment(company.compliance.lastAudit).add(3, 'months').toISOString(),
      requirements: [
        {
          framework: 'GDPR',
          score: company.compliance.gdpr,
          status: company.compliance.gdpr >= 80 ? 'compliant' : 'needs_attention',
          requirements: ['Data protection policies', 'Employee training', 'Incident reporting']
        },
        {
          framework: 'ISO 27001',
          score: company.compliance.iso27001,
          status: company.compliance.iso27001 >= 70 ? 'compliant' : 'needs_attention',
          requirements: ['Security policies', 'Risk assessment', 'Access controls']
        },
        {
          framework: 'PCI DSS',
          score: company.compliance.pci,
          status: company.compliance.pci >= 90 ? 'compliant' : 'needs_attention',
          requirements: ['Secure networks', 'Cardholder data protection', 'Regular monitoring']
        }
      ]
    };
  }

  async updateSecuritySettings(companyId, settings) {
    let company = this.companyData.get(companyId);
    if (!company) {
      company = this.createDefaultCompany(companyId);
    }
    
    // Update settings (simplified implementation)
    company.settings = { ...company.settings, ...settings };
    company.lastUpdated = moment().toISOString();
    
    this.companyData.set(companyId, company);
    
    return {
      companyId,
      settings: company.settings,
      updated: company.lastUpdated
    };
  }

  async getSecurityTrends(companyId, period) {
    const company = this.companyData.get(companyId) || this.createDefaultCompany(companyId);
    
    return {
      companyId,
      period,
      trends: {
        phishing: {
          data: company.trends.phishingTrend,
          trend: 'increasing',
          change: '+15%'
        },
        training: {
          data: company.trends.trainingTrend,
          trend: 'improving',
          change: '+25%'
        },
        incidents: {
          data: company.trends.incidentTrend,
          trend: 'stable',
          change: '0%'
        }
      }
    };
  }

  createDefaultCompany(companyId) {
    const defaultCompany = {
      companyId,
      name: `Company ${companyId}`,
      securityHealthScore: 60,
      lastUpdated: moment().toISOString(),
      metrics: {
        phishingAttempts: 0,
        blockedThreats: 0,
        trainingCompletions: 0,
        securityIncidents: 0,
        employeeCount: 10
      },
      alerts: [],
      awareness: {
        averageScore: 60,
        departmentScores: {},
        recentImprovements: 0
      },
      incidents: [],
      compliance: {
        gdpr: 60,
        iso27001: 50,
        pci: 70,
        lastAudit: moment().subtract(6, 'months').toISOString()
      },
      trends: {
        phishingTrend: [0, 0, 0, 0, 0, 0, 0],
        trainingTrend: [0, 0, 0, 0, 0, 0, 0],
        incidentTrend: [0, 0, 0, 0, 0, 0, 0]
      }
    };
    
    this.companyData.set(companyId, defaultCompany);
    return defaultCompany;
  }

  getHealthLevel(score) {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'fair';
    if (score >= 60) return 'poor';
    return 'critical';
  }

  getTimeframeDays(timeframe) {
    const timeframes = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    return timeframes[timeframe] || 30;
  }

  calculateTrends(trends, days) {
    // Simplified trend calculation
    return {
      phishing: {
        current: trends.phishingTrend[trends.phishingTrend.length - 1],
        previous: trends.phishingTrend[trends.phishingTrend.length - 2] || 0,
        change: this.calculatePercentageChange(
          trends.phishingTrend[trends.phishingTrend.length - 1],
          trends.phishingTrend[trends.phishingTrend.length - 2] || 0
        )
      },
      training: {
        current: trends.trainingTrend[trends.trainingTrend.length - 1],
        previous: trends.trainingTrend[trends.trainingTrend.length - 2] || 0,
        change: this.calculatePercentageChange(
          trends.trainingTrend[trends.trainingTrend.length - 1],
          trends.trainingTrend[trends.trainingTrend.length - 2] || 0
        )
      }
    };
  }

  calculatePercentageChange(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  getTopPerformers(departmentScores) {
    return Object.entries(departmentScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([department, score]) => ({ department, score }));
  }

  getAreasForImprovement(departmentScores) {
    return Object.entries(departmentScores)
      .filter(([, score]) => score < 80)
      .sort(([,a], [,b]) => a - b)
      .map(([department, score]) => ({ department, score }));
  }

  getAwarenessRecommendations(awareness) {
    const recommendations = [];
    
    if (awareness.averageScore < 70) {
      recommendations.push('Conduct mandatory security awareness training for all employees');
    }
    
    if (awareness.recentImprovements < 5) {
      recommendations.push('Implement regular security awareness campaigns');
    }
    
    return recommendations;
  }

  getOverallComplianceStatus(compliance) {
    const scores = Object.values(compliance).filter(score => typeof score === 'number');
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    if (average >= 85) return 'excellent';
    if (average >= 75) return 'good';
    if (average >= 65) return 'fair';
    return 'needs_improvement';
  }
}

module.exports = SecurityDashboard;
