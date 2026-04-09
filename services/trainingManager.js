const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

class TrainingManager {
  constructor() {
    this.trainingModules = this.initializeTrainingModules();
    this.trainingSessions = new Map();
    this.userProgress = new Map();
    this.companyStats = new Map();
    this.phishingSimulations = new Map();
  }

  initializeTrainingModules() {
    return [
      {
        id: 'phishing-awareness',
        title: 'Phishing Awareness Training',
        description: 'Learn to identify and avoid phishing attacks',
        duration: 15,
        difficulty: 'Beginner',
        category: 'Email Security',
        content: {
          sections: [
            {
              title: 'What is Phishing?',
              content: 'Phishing is a cyber attack that uses disguised email as a weapon. The goal is to trick the email recipient into believing that the message is something they want or need.',
              type: 'text'
            },
            {
              title: 'Common Phishing Techniques',
              content: [
                'Urgent requests for personal information',
                'Suspicious email addresses or domains',
                'Poor grammar and spelling',
                'Unexpected attachments or links',
                'Requests for passwords or account verification'
              ],
              type: 'list'
            },
            {
              title: 'How to Spot Phishing',
              content: 'Look for these red flags: suspicious sender addresses, urgent language, poor grammar, unexpected attachments, and requests for sensitive information.',
              type: 'text'
            }
          ]
        },
        quiz: {
          questions: [
            {
              id: 1,
              question: 'What is the primary goal of a phishing attack?',
              options: [
                'To improve email security',
                'To trick users into revealing sensitive information',
                'To send legitimate business emails',
                'To test email systems'
              ],
              correct: 1,
              explanation: 'Phishing attacks aim to trick users into revealing sensitive information like passwords, credit card numbers, or personal data.'
            },
            {
              id: 2,
              question: 'Which of the following is a red flag for phishing emails?',
              options: [
                'Professional email formatting',
                'Urgent requests for personal information',
                'Clear sender identification',
                'Relevant business content'
              ],
              correct: 1,
              explanation: 'Urgent requests for personal information are a common phishing tactic to pressure victims into quick action.'
            },
            {
              id: 3,
              question: 'What should you do if you receive a suspicious email?',
              options: [
                'Click on all links to verify',
                'Reply with your personal information',
                'Delete the email and report it',
                'Forward it to all colleagues'
              ],
              correct: 2,
              explanation: 'Suspicious emails should be deleted and reported to IT security to prevent further attacks.'
            }
          ]
        }
      },
      {
        id: 'password-security',
        title: 'Password Security Best Practices',
        description: 'Learn how to create and manage secure passwords',
        duration: 10,
        difficulty: 'Beginner',
        category: 'Access Control',
        content: {
          sections: [
            {
              title: 'Strong Password Requirements',
              content: [
                'At least 12 characters long',
                'Mix of uppercase and lowercase letters',
                'Include numbers and special characters',
                'Avoid common words or personal information',
                'Unique for each account'
              ],
              type: 'list'
            },
            {
              title: 'Password Management',
              content: 'Use a password manager to generate and store unique passwords. Enable two-factor authentication whenever possible.',
              type: 'text'
            }
          ]
        },
        quiz: {
          questions: [
            {
              id: 1,
              question: 'What is the minimum recommended length for a strong password?',
              options: ['6 characters', '8 characters', '12 characters', '16 characters'],
              correct: 2,
              explanation: 'A minimum of 12 characters is recommended for strong passwords to resist brute force attacks.'
            },
            {
              id: 2,
              question: 'Should you use the same password for multiple accounts?',
              options: ['Yes, it\'s easier to remember', 'No, each account should have a unique password', 'Only for personal accounts', 'Only for work accounts'],
              correct: 1,
              explanation: 'Each account should have a unique password to prevent a single breach from compromising multiple accounts.'
            }
          ]
        }
      },
      {
        id: 'social-engineering',
        title: 'Social Engineering Awareness',
        description: 'Recognize and defend against social engineering attacks',
        duration: 20,
        difficulty: 'Intermediate',
        category: 'Human Security',
        content: {
          sections: [
            {
              title: 'What is Social Engineering?',
              content: 'Social engineering is the art of manipulating people into performing actions or divulging confidential information.',
              type: 'text'
            },
            {
              title: 'Common Social Engineering Tactics',
              content: [
                'Pretexting - creating a false scenario',
                'Baiting - offering something enticing',
                'Quid pro quo - offering a service for information',
                'Tailgating - following someone into a secure area',
                'Phishing - using electronic communication'
              ],
              type: 'list'
            }
          ]
        },
        quiz: {
          questions: [
            {
              id: 1,
              question: 'What is the main target of social engineering attacks?',
              options: ['Computer systems', 'People', 'Networks', 'Software'],
              correct: 1,
              explanation: 'Social engineering attacks target people, exploiting human psychology rather than technical vulnerabilities.'
            }
          ]
        }
      },
      {
        id: 'data-protection',
        title: 'Data Protection and Privacy',
        description: 'Understand how to protect sensitive data and maintain privacy',
        duration: 15,
        difficulty: 'Beginner',
        category: 'Data Security',
        content: {
          sections: [
            {
              title: 'Types of Sensitive Data',
              content: [
                'Personal Identifiable Information (PII)',
                'Financial information',
                'Health records',
                'Intellectual property',
                'Customer data'
              ],
              type: 'list'
            },
            {
              title: 'Data Protection Principles',
              content: 'Follow the principle of least privilege, encrypt sensitive data, and ensure proper disposal of data when no longer needed.',
              type: 'text'
            }
          ]
        },
        quiz: {
          questions: [
            {
              id: 1,
              question: 'What does PII stand for?',
              options: [
                'Personal Internet Information',
                'Public Information Index',
                'Personal Identifiable Information',
                'Private Internal Information'
              ],
              correct: 2,
              explanation: 'PII stands for Personal Identifiable Information, which includes data that can identify a specific individual.'
            }
          ]
        }
      }
    ];
  }

  async getTrainingModules() {
    return this.trainingModules.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description,
      duration: module.duration,
      difficulty: module.difficulty,
      category: module.category
    }));
  }

  async getTrainingModule(moduleId) {
    return this.trainingModules.find(module => module.id === moduleId);
  }

  async startTrainingSession({ userId, moduleId, companyId }) {
    const module = await this.getTrainingModule(moduleId);
    if (!module) {
      throw new Error('Training module not found');
    }

    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      userId,
      moduleId,
      companyId,
      startTime: moment().toISOString(),
      status: 'in_progress',
      currentSection: 0,
      answers: [],
      score: null
    };

    this.trainingSessions.set(sessionId, session);
    return session;
  }

  async submitQuizAnswers(sessionId, answers) {
    const session = this.trainingSessions.get(sessionId);
    if (!session) {
      throw new Error('Training session not found');
    }

    const module = await this.getTrainingModule(session.moduleId);
    if (!module) {
      throw new Error('Training module not found');
    }

    session.answers = answers;
    
    // Calculate score
    let correctAnswers = 0;
    const results = [];

    for (const answer of answers) {
      const question = module.quiz.questions.find(q => q.id === answer.questionId);
      if (question) {
        const isCorrect = question.correct === answer.answer;
        if (isCorrect) correctAnswers++;
        
        results.push({
          questionId: answer.questionId,
          question: question.question,
          userAnswer: answer.answer,
          correctAnswer: question.correct,
          isCorrect,
          explanation: question.explanation
        });
      }
    }

    session.score = {
      total: module.quiz.questions.length,
      correct: correctAnswers,
      percentage: Math.round((correctAnswers / module.quiz.questions.length) * 100)
    };

    session.quizResults = results;
    session.status = 'quiz_completed';

    return {
      sessionId,
      score: session.score,
      results
    };
  }

  async completeTraining(sessionId) {
    const session = this.trainingSessions.get(sessionId);
    if (!session) {
      throw new Error('Training session not found');
    }

    session.status = 'completed';
    session.completionTime = moment().toISOString();

    // Update user progress
    await this.updateUserProgress(session.userId, session.moduleId, session.score);
    
    // Update company stats
    await this.updateCompanyStats(session.companyId, session.moduleId, session.score);

    return {
      sessionId,
      status: 'completed',
      score: session.score,
      completionTime: session.completionTime
    };
  }

  async getUserProgress(userId) {
    const progress = this.userProgress.get(userId) || {
      userId,
      completedModules: [],
      totalScore: 0,
      averageScore: 0,
      lastActivity: null
    };

    return progress;
  }

  async getCompanyStats(companyId) {
    const stats = this.companyStats.get(companyId) || {
      companyId,
      totalEmployees: 0,
      completedTrainings: 0,
      averageScore: 0,
      moduleCompletions: {},
      lastUpdated: moment().toISOString()
    };

    return stats;
  }

  async updateUserProgress(userId, moduleId, score) {
    let progress = this.userProgress.get(userId);
    if (!progress) {
      progress = {
        userId,
        completedModules: [],
        totalScore: 0,
        averageScore: 0,
        lastActivity: moment().toISOString()
      };
    }

    // Check if module already completed
    const existingModule = progress.completedModules.find(m => m.moduleId === moduleId);
    if (existingModule) {
      existingModule.score = score;
      existingModule.completionTime = moment().toISOString();
    } else {
      progress.completedModules.push({
        moduleId,
        score,
        completionTime: moment().toISOString()
      });
    }

    // Recalculate totals
    progress.totalScore = progress.completedModules.reduce((sum, m) => sum + m.score.percentage, 0);
    progress.averageScore = progress.completedModules.length > 0 ? 
      Math.round(progress.totalScore / progress.completedModules.length) : 0;
    progress.lastActivity = moment().toISOString();

    this.userProgress.set(userId, progress);
  }

  async updateCompanyStats(companyId, moduleId, score) {
    let stats = this.companyStats.get(companyId);
    if (!stats) {
      stats = {
        companyId,
        totalEmployees: 0,
        completedTrainings: 0,
        averageScore: 0,
        moduleCompletions: {},
        lastUpdated: moment().toISOString()
      };
    }

    stats.completedTrainings++;
    if (!stats.moduleCompletions[moduleId]) {
      stats.moduleCompletions[moduleId] = 0;
    }
    stats.moduleCompletions[moduleId]++;

    // Recalculate average score (simplified)
    stats.averageScore = Math.round((stats.averageScore + score.percentage) / 2);
    stats.lastUpdated = moment().toISOString();

    this.companyStats.set(companyId, stats);
  }

  async generatePhishingSimulation({ companyId, targetEmails, simulationType }) {
    const simulationId = uuidv4();
    
    const simulations = {
      basic: {
        subject: 'Urgent: Verify Your Account Information',
        sender: 'security@company-verification.com',
        content: `Dear Employee,

We have detected unusual activity on your account. To prevent unauthorized access, please verify your information immediately.

Click here to verify: http://company-verify-now.com/login

This is urgent - your account will be suspended in 24 hours if not verified.

Best regards,
IT Security Team`,
        indicators: [
          'Urgent language',
          'Suspicious sender domain',
          'Suspicious link',
          'Threat of account suspension'
        ]
      },
      advanced: {
        subject: 'Meeting Request - Q4 Budget Review',
        sender: 'hr@company-hr-services.net',
        content: `Hi Team,

Please find attached the Q4 budget review document. We need your input by end of day.

The document contains sensitive financial information, so please review carefully.

Download: budget_review_2024.exe

Thanks,
HR Department`,
        indicators: [
          'Suspicious attachment (.exe file)',
          'Suspicious sender domain',
          'Generic greeting',
          'Sensitive information claim'
        ]
      }
    };

    const simulation = {
      id: simulationId,
      companyId,
      type: simulationType,
      targetEmails,
      email: simulations[simulationType] || simulations.basic,
      status: 'sent',
      sentTime: moment().toISOString(),
      responses: [],
      results: null
    };

    this.phishingSimulations.set(simulationId, simulation);
    return simulation;
  }

  async getSimulationResults(simulationId) {
    const simulation = this.phishingSimulations.get(simulationId);
    if (!simulation) {
      throw new Error('Simulation not found');
    }

    // Simulate some responses for demo purposes
    if (!simulation.results) {
      simulation.results = {
        totalSent: simulation.targetEmails.length,
        clicked: Math.floor(Math.random() * simulation.targetEmails.length * 0.3),
        reported: Math.floor(Math.random() * simulation.targetEmails.length * 0.7),
        responded: Math.floor(Math.random() * simulation.targetEmails.length * 0.2),
        riskLevel: 'MEDIUM'
      };
    }

    return {
      simulationId,
      results: simulation.results,
      email: simulation.email,
      indicators: simulation.email.indicators
    };
  }
}

module.exports = TrainingManager;
