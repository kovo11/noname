import React, { useState, useEffect } from 'react';
import DataService from '../services/DataService';

interface InterviewData {
  // Personal Information
  fullName: string;
  email: string;
  position: string;
  experience: string;
  
  // Technical Questions
  gitMatcherScaling: string;
  collaborationBalance: string;
  infrastructureDesign: string;
  uiDesign: string;
  
  // Multiple Choice Questions
  preferredLanguage: string;
  workStyle: string;
  teamSize: string;
  
  // Video Questions (Google Drive links)
  introVideo: string;
  technicalVideo: string;
}

const VirtualInterview: React.FC<{ onComplete: (data: InterviewData, interviewId: string) => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [formData, setFormData] = useState<InterviewData>({
    fullName: '',
    email: '',
    position: '',
    experience: '',
    gitMatcherScaling: '',
    collaborationBalance: '',
    infrastructureDesign: '',
    uiDesign: '',
    preferredLanguage: '',
    workStyle: '',
    teamSize: '',
    introVideo: '',
    technicalVideo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Timer countdown
  useEffect(() => {
    if (!interviewStarted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interviewStarted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateGoogleDriveLink = (url: string): boolean => {
    const driveRegex = /^https:\/\/drive\.google\.com\/(file\/d\/|open\?id=)/;
    return driveRegex.test(url);
  };

  // Get position-specific questions
  const getPositionQuestions = (position: string) => {
    switch (position) {
      case 'Backend Developer':
      case 'Frontend Developer':
      case 'Full Stack Developer':
      case 'AI Integration Specialist':
        return {
          q1: {
            label: "How would you design a system that analyzes developer activity on GitHub and generates insights (e.g., coding style, frequency, language preferences)? Consider scalability, API rate limits, and data processing.",
            placeholder: "Discuss your approach to GitHub API integration, data analysis pipelines, caching strategies, etc..."
          },
          q2: {
            label: "GitMatcher is about matching people, not just code. How would you balance technical scoring with softer metrics like collaboration style when creating developer profiles?",
            placeholder: "Discuss approaches to measure collaboration, code review quality, communication patterns, etc..."
          },
          q3: {
            label: "Our app needs to constantly sync data from GitHub. How would you design an infrastructure that scales with traffic and doesn't break when GitHub rate-limits us?",
            placeholder: "Discuss queue systems, retry mechanisms, caching, monitoring, and rate limit handling..."
          },
          q4: {
            label: "GitMatcher matches developers visually. How would you design a UI that clearly displays compatibility (skills overlap, coding style, activity patterns)?",
            placeholder: "Discuss data visualization, user experience, frameworks, and state management approaches..."
          },
          q5: {
            label: "How would you implement real-time notifications for GitMatcher when developers get matched or receive collaboration requests?",
            placeholder: "Discuss WebSocket implementation, push notifications, event-driven architecture, performance considerations..."
          },
          q6: {
            label: "Describe your approach to testing GitMatcher's matching algorithm. How would you ensure accuracy and prevent bias?",
            placeholder: "Discuss unit testing, integration testing, test data generation, bias detection, quality assurance..."
          },
          q7: {
            label: "How would you optimize GitMatcher's database queries when dealing with millions of developer profiles and activity records?",
            placeholder: "Discuss indexing strategies, query optimization, database design, caching layers, performance monitoring..."
          },
          q8: {
            label: "How would you handle authentication and authorization for GitMatcher, especially GitHub OAuth integration?",
            placeholder: "Discuss OAuth flows, token management, security best practices, session handling, API security..."
          },
          q9: {
            label: "Describe your strategy for debugging production issues in GitMatcher when matching results are unexpected.",
            placeholder: "Discuss logging strategies, monitoring tools, error tracking, debugging workflows, incident response..."
          },
          q10: {
            label: "How would you design GitMatcher's search functionality to help developers find specific types of collaborators efficiently?",
            placeholder: "Discuss search algorithms, filtering mechanisms, indexing, relevance scoring, user experience..."
          },
          q11: {
            label: "How would you approach code review and maintain code quality standards across GitMatcher's development team?",
            placeholder: "Discuss code review processes, coding standards, automated checks, team collaboration, knowledge sharing..."
          },
          q12: {
            label: "Describe how you would implement GitMatcher's mobile responsiveness while maintaining performance across different devices.",
            placeholder: "Discuss responsive design, mobile optimization, performance considerations, cross-platform compatibility..."
          },
          q13: {
            label: "How would you implement automated testing strategies for GitMatcher to ensure code quality and prevent regressions?",
            placeholder: "Discuss unit testing, integration testing, E2E testing, test automation, coverage strategies..."
          },
          q14: {
            label: "How would you design GitMatcher's search functionality to handle complex developer queries and provide relevant matches?",
            placeholder: "Discuss search algorithms, indexing strategies, performance optimization, relevance scoring..."
          },
          q15: {
            label: "How would you implement data analytics and reporting features for GitMatcher to track user engagement and matching success?",
            placeholder: "Discuss analytics implementation, data collection, reporting dashboards, performance metrics..."
          },
          q16: {
            label: "How would you handle GitMatcher's internationalization and localization for global developer communities?",
            placeholder: "Discuss i18n implementation, multi-language support, cultural considerations, timezone handling..."
          },
          q17: {
            label: "How would you implement GitMatcher's API rate limiting and abuse prevention to protect against malicious usage?",
            placeholder: "Discuss rate limiting strategies, security measures, DDoS protection, API authentication..."
          },
          q18: {
            label: "How would you design GitMatcher's recommendation engine to improve match quality over time using machine learning?",
            placeholder: "Discuss ML algorithms, recommendation systems, data training, continuous improvement, feedback loops..."
          },
          q19: {
            label: "How would you implement GitMatcher's messaging and communication features for matched developers?",
            placeholder: "Discuss real-time messaging, notification systems, chat features, privacy considerations..."
          },
          q20: {
            label: "How would you approach performance optimization for GitMatcher as the platform scales to millions of developers?",
            placeholder: "Discuss scalability strategies, performance monitoring, optimization techniques, infrastructure scaling..."
          }
        };

      case 'DevOps Engineer':
        return {
          q1: {
            label: "How would you design CI/CD pipelines for GitMatcher that handle both frontend and backend deployments with zero downtime?",
            placeholder: "Discuss deployment strategies, pipeline automation, rollback mechanisms, testing integration..."
          },
          q2: {
            label: "How would you implement monitoring and alerting for GitMatcher's infrastructure to ensure 99.9% uptime?",
            placeholder: "Discuss monitoring tools, alerting systems, SLA management, incident response, performance metrics..."
          },
          q3: {
            label: "Describe your approach to scaling GitMatcher's infrastructure as user base grows from thousands to millions.",
            placeholder: "Discuss auto-scaling, load balancing, database scaling, CDN implementation, capacity planning..."
          },
          q4: {
            label: "How would you implement security best practices for GitMatcher's cloud infrastructure and deployment processes?",
            placeholder: "Discuss security scanning, secrets management, network security, compliance, vulnerability management..."
          },
          q5: {
            label: "How would you design backup and disaster recovery strategies for GitMatcher's critical data and services?",
            placeholder: "Discuss backup strategies, disaster recovery planning, RTO/RPO targets, data replication, failover mechanisms..."
          },
          q6: {
            label: "Describe your approach to infrastructure as code (IaC) for GitMatcher's cloud resources and configuration management.",
            placeholder: "Discuss IaC tools, version control, environment consistency, automated provisioning, configuration drift..."
          },
          q7: {
            label: "How would you optimize GitMatcher's cloud costs while maintaining performance and reliability?",
            placeholder: "Discuss cost optimization strategies, resource rightsizing, reserved instances, monitoring tools, budget management..."
          },
          q8: {
            label: "How would you implement GitMatcher's logging and observability stack for troubleshooting and performance analysis?",
            placeholder: "Discuss centralized logging, distributed tracing, metrics collection, observability tools, log analysis..."
          },
          q9: {
            label: "Describe your strategy for managing GitMatcher's environments (dev, staging, production) and ensuring consistency.",
            placeholder: "Discuss environment management, configuration consistency, deployment pipelines, testing strategies..."
          },
          q10: {
            label: "How would you handle GitMatcher's database operations, including migrations, backups, and performance tuning?",
            placeholder: "Discuss database automation, migration strategies, backup verification, performance monitoring, optimization..."
          },
          q11: {
            label: "How would you implement container orchestration for GitMatcher using Kubernetes or similar platforms?",
            placeholder: "Discuss container strategies, orchestration platforms, service mesh, networking, storage management..."
          },
          q12: {
            label: "Describe your approach to incident management and post-mortem processes for GitMatcher's production issues.",
            placeholder: "Discuss incident response procedures, escalation protocols, root cause analysis, learning culture, prevention strategies..."
          },
          q13: {
            label: "How would you implement GitMatcher's API gateway and microservices architecture for scalability and reliability?",
            placeholder: "Discuss API gateway design, microservices patterns, service discovery, load balancing, circuit breakers..."
          },
          q14: {
            label: "How would you design GitMatcher's deployment strategy for multiple cloud regions and availability zones?",
            placeholder: "Discuss multi-region architecture, data replication, traffic routing, disaster recovery, latency optimization..."
          },
          q15: {
            label: "How would you implement GitMatcher's secret management and certificate automation for secure operations?",
            placeholder: "Discuss secret rotation, certificate lifecycle, encryption strategies, key management, compliance requirements..."
          },
          q16: {
            label: "How would you design GitMatcher's performance testing and capacity planning processes?",
            placeholder: "Discuss load testing strategies, performance benchmarks, capacity forecasting, bottleneck identification..."
          },
          q17: {
            label: "How would you implement GitMatcher's network security and firewall management for cloud infrastructure?",
            placeholder: "Discuss network segmentation, firewall rules, VPC design, security groups, intrusion detection..."
          },
          q18: {
            label: "How would you design GitMatcher's configuration management and feature flag systems?",
            placeholder: "Discuss configuration strategies, feature toggles, environment-specific configs, rollout mechanisms..."
          },
          q19: {
            label: "How would you implement GitMatcher's data pipeline and ETL processes for analytics and reporting?",
            placeholder: "Discuss data engineering, pipeline automation, data quality, streaming vs batch processing, monitoring..."
          },
          q20: {
            label: "How would you approach GitMatcher's compliance and audit requirements for enterprise customers?",
            placeholder: "Discuss compliance frameworks, audit logging, security controls, data governance, certification processes..."
          }
        };

      case 'Social Media Manager':
        return {
          q1: {
            label: "How would you develop a social media strategy to promote GitMatcher to the developer community? Consider platforms, content types, and engagement tactics.",
            placeholder: "Discuss platform selection (Twitter, LinkedIn, GitHub, etc.), content strategy, community building, influencer partnerships..."
          },
          q2: {
            label: "GitMatcher connects developers based on code analysis. How would you explain this technical concept in engaging social media content for different audiences?",
            placeholder: "Discuss content creation for technical vs non-technical audiences, visual storytelling, educational content..."
          },
          q3: {
            label: "How would you measure and improve social media ROI for a B2B developer tool like GitMatcher? What metrics would you track?",
            placeholder: "Discuss KPIs, analytics tools, conversion tracking, A/B testing, community growth metrics..."
          },
          q4: {
            label: "How would you handle crisis communication on social media if GitMatcher faced technical issues or community backlash?",
            placeholder: "Discuss crisis management protocols, transparent communication, community relations, reputation management..."
          },
          q5: {
            label: "Describe your approach to creating viral content about GitMatcher that resonates with the developer community.",
            placeholder: "Discuss viral content strategies, developer humor, trending topics, meme culture, authentic engagement..."
          },
          q6: {
            label: "How would you build and manage a community of GitMatcher brand ambassadors among influential developers?",
            placeholder: "Discuss influencer outreach, ambassador programs, relationship building, content collaboration..."
          },
          q7: {
            label: "How would you use social media to gather user feedback and feature requests for GitMatcher's development team?",
            placeholder: "Discuss feedback collection, community listening, feature validation, user research integration..."
          },
          q8: {
            label: "Describe your strategy for cross-platform content adaptation while maintaining GitMatcher's brand voice.",
            placeholder: "Discuss platform-specific content, brand consistency, voice guidelines, content repurposing..."
          },
          q9: {
            label: "How would you leverage social media trends and events (like Hacktoberfest) to promote GitMatcher?",
            placeholder: "Discuss trend analysis, event marketing, seasonal campaigns, community participation, timely content..."
          },
          q10: {
            label: "How would you collaborate with GitMatcher's technical team to create authentic, educational content?",
            placeholder: "Discuss technical collaboration, content accuracy, developer perspectives, educational value..."
          },
          q11: {
            label: "Describe your approach to paid social media advertising for GitMatcher, including targeting and budget allocation.",
            placeholder: "Discuss ad strategy, audience targeting, budget optimization, conversion tracking, platform-specific ads..."
          },
          q12: {
            label: "How would you establish GitMatcher as a thought leader in the developer tools and collaboration space?",
            placeholder: "Discuss thought leadership strategy, industry insights, expert positioning, content authority, network building..."
          },
          q13: {
            label: "How would you create and manage GitMatcher's social media content calendar for consistent engagement?",
            placeholder: "Discuss content planning, editorial calendars, scheduling tools, content themes, consistency strategies..."
          },
          q14: {
            label: "How would you leverage user-generated content to build GitMatcher's social media presence?",
            placeholder: "Discuss UGC strategies, community engagement, content curation, user spotlights, hashtag campaigns..."
          },
          q15: {
            label: "How would you use social media analytics to optimize GitMatcher's content strategy and posting schedule?",
            placeholder: "Discuss analytics tools, performance metrics, optimization strategies, audience insights, timing analysis..."
          },
          q16: {
            label: "How would you integrate GitMatcher's social media efforts with broader marketing campaigns and product launches?",
            placeholder: "Discuss campaign coordination, cross-channel marketing, launch strategies, integrated messaging..."
          },
          q17: {
            label: "How would you handle negative feedback or criticism about GitMatcher on social media platforms?",
            placeholder: "Discuss reputation management, response strategies, conflict resolution, community moderation..."
          },
          q18: {
            label: "How would you build partnerships with developer communities and open-source projects to promote GitMatcher?",
            placeholder: "Discuss community partnerships, collaboration strategies, mutual promotion, relationship building..."
          },
          q19: {
            label: "How would you adapt GitMatcher's social media strategy for international markets and different time zones?",
            placeholder: "Discuss global strategies, cultural adaptation, timezone optimization, localized content, regional communities..."
          },
          q20: {
            label: "How would you measure the impact of GitMatcher's social media efforts on actual user acquisition and retention?",
            placeholder: "Discuss attribution models, conversion tracking, funnel analysis, ROI measurement, long-term impact assessment..."
          }
        };

      case 'UX/UI Designer':
        return {
          q1: {
            label: "How would you design an intuitive interface for developers to browse and discover compatible coding partners based on GitHub data analysis?",
            placeholder: "Discuss user flows, information architecture, visual design principles, developer-focused UX patterns..."
          },
          q2: {
            label: "GitMatcher shows complex matching algorithms to users. How would you visualize compatibility scores, skill overlaps, and collaboration patterns in an easy-to-understand way?",
            placeholder: "Discuss data visualization, progressive disclosure, interactive elements, accessibility considerations..."
          },
          q3: {
            label: "How would you conduct user research with developers to understand their pain points in finding coding collaborators and validate design decisions?",
            placeholder: "Discuss research methodologies, user personas, usability testing, feedback collection, iteration processes..."
          },
          q4: {
            label: "How would you design GitMatcher's mobile experience while maintaining the depth of information needed for developer matching decisions?",
            placeholder: "Discuss responsive design, mobile-first approach, progressive web app considerations, touch interactions..."
          },
          q5: {
            label: "Describe your approach to creating an accessible design system for GitMatcher that works for developers with different abilities.",
            placeholder: "Discuss accessibility standards, inclusive design, color contrast, keyboard navigation, screen reader compatibility..."
          },
          q6: {
            label: "How would you design GitMatcher's onboarding flow to quickly demonstrate value while collecting necessary user information?",
            placeholder: "Discuss user onboarding, progressive profiling, value demonstration, conversion optimization, first-time user experience..."
          },
          q7: {
            label: "How would you approach designing GitMatcher's dashboard for different user types (new users, active matchers, team leads)?",
            placeholder: "Discuss user segmentation, personalized interfaces, role-based design, information hierarchy, dashboard customization..."
          },
          q8: {
            label: "Describe your strategy for designing GitMatcher's notification system to keep users engaged without being overwhelming.",
            placeholder: "Discuss notification design, user preferences, engagement strategies, attention management, communication hierarchy..."
          },
          q9: {
            label: "How would you design trust and safety features for GitMatcher to help users feel confident about potential collaborators?",
            placeholder: "Discuss trust indicators, verification systems, safety features, reputation design, user confidence building..."
          },
          q10: {
            label: "How would you create design guidelines for GitMatcher that maintain consistency while allowing for platform growth?",
            placeholder: "Discuss design systems, component libraries, style guides, scalability, design documentation, team collaboration..."
          },
          q11: {
            label: "Describe your approach to A/B testing design variations for GitMatcher's key user flows and conversion points.",
            placeholder: "Discuss experimental design, metrics selection, statistical significance, design iteration, data-driven decisions..."
          },
          q12: {
            label: "How would you design GitMatcher's communication features (messaging, video calls) to facilitate effective developer collaboration?",
            placeholder: "Discuss communication design, collaboration tools, user interface patterns, technical integration, user workflow..."
          },
          q13: {
            label: "How would you conduct user research to understand developer pain points and improve GitMatcher's user experience?",
            placeholder: "Discuss research methodologies, user interviews, usability testing, persona development, feedback analysis..."
          },
          q14: {
            label: "How would you design GitMatcher's accessibility features to ensure the platform is usable by developers with disabilities?",
            placeholder: "Discuss accessibility standards, inclusive design, screen reader compatibility, keyboard navigation, color considerations..."
          },
          q15: {
            label: "How would you approach designing GitMatcher's dark mode while maintaining visual hierarchy and brand consistency?",
            placeholder: "Discuss dark mode design principles, color schemes, contrast ratios, user preferences, brand adaptation..."
          },
          q16: {
            label: "How would you design GitMatcher's notification system to keep users engaged without being overwhelming?",
            placeholder: "Discuss notification strategies, user control, frequency management, contextual relevance, engagement balance..."
          },
          q17: {
            label: "How would you create GitMatcher's design system and component library for consistent development?",
            placeholder: "Discuss design systems, component documentation, style guides, developer handoff, maintenance strategies..."
          },
          q18: {
            label: "How would you design GitMatcher's progressive web app experience for seamless mobile and desktop usage?",
            placeholder: "Discuss PWA design, responsive layouts, touch interactions, offline functionality, cross-platform consistency..."
          },
          q19: {
            label: "How would you approach GitMatcher's user onboarding flow to maximize successful profile completions?",
            placeholder: "Discuss onboarding design, user journey mapping, progressive disclosure, motivation techniques, drop-off reduction..."
          },
          q20: {
            label: "How would you design GitMatcher's error states and empty states to provide helpful guidance to users?",
            placeholder: "Discuss error handling, empty state design, user guidance, recovery paths, emotional design considerations..."
          }
        };

      case 'Data Analyst':
        return {
          q1: {
            label: "How would you design analytics systems to track and improve GitMatcher's matching algorithm effectiveness? What key metrics would you monitor?",
            placeholder: "Discuss success metrics, A/B testing frameworks, cohort analysis, machine learning performance indicators..."
          },
          q2: {
            label: "How would you analyze GitHub activity data to identify patterns that predict successful developer collaborations?",
            placeholder: "Discuss data mining techniques, statistical analysis, correlation vs causation, feature engineering..."
          },
          q3: {
            label: "How would you build dashboards and reporting systems for GitMatcher stakeholders to understand user behavior and platform performance?",
            placeholder: "Discuss BI tools, data visualization, automated reporting, stakeholder-specific insights, real-time monitoring..."
          },
          q4: {
            label: "How would you approach analyzing user churn and retention for GitMatcher? What data sources and methodologies would you use?",
            placeholder: "Discuss churn prediction models, retention cohorts, user lifecycle analysis, predictive analytics..."
          },
          q5: {
            label: "Describe your approach to creating data pipelines for processing GitMatcher's large volumes of GitHub activity data.",
            placeholder: "Discuss ETL processes, data quality, pipeline architecture, real-time vs batch processing, scalability..."
          },
          q6: {
            label: "How would you design experiments to test new features or algorithm improvements for GitMatcher?",
            placeholder: "Discuss experimental design, statistical testing, sample size calculations, bias prevention, result interpretation..."
          },
          q7: {
            label: "How would you analyze and improve GitMatcher's conversion funnel from signup to first successful match?",
            placeholder: "Discuss funnel analysis, conversion optimization, user journey mapping, drop-off identification, improvement strategies..."
          },
          q8: {
            label: "Describe your approach to data privacy and compliance when analyzing GitMatcher's user data.",
            placeholder: "Discuss data governance, privacy regulations, anonymization techniques, ethical data use, compliance frameworks..."
          },
          q9: {
            label: "How would you use machine learning to enhance GitMatcher's developer compatibility predictions?",
            placeholder: "Discuss ML algorithms, feature selection, model training, validation strategies, performance metrics..."
          },
          q10: {
            label: "How would you analyze seasonal trends and patterns in GitMatcher's user activity and matching success rates?",
            placeholder: "Discuss time series analysis, seasonal decomposition, trend identification, forecasting, business insights..."
          },
          q11: {
            label: "Describe your strategy for monitoring and alerting on GitMatcher's key business metrics and data quality issues.",
            placeholder: "Discuss monitoring systems, anomaly detection, alert thresholds, data quality checks, automated reporting..."
          },
          q12: {
            label: "How would you perform cohort analysis to understand long-term user engagement and value creation in GitMatcher?",
            placeholder: "Discuss cohort methodologies, retention analysis, user value metrics, lifecycle stages, behavioral segmentation..."
          },
          q13: {
            label: "How would you design and implement A/B testing frameworks for GitMatcher's new features and UI changes?",
            placeholder: "Discuss experiment design, statistical significance, sample sizes, control groups, result interpretation..."
          },
          q14: {
            label: "How would you analyze GitMatcher's customer acquisition costs and lifetime value to optimize marketing spend?",
            placeholder: "Discuss CAC/LTV analysis, marketing attribution, funnel optimization, ROI measurement, budget allocation..."
          },
          q15: {
            label: "How would you create predictive models to identify users at risk of churning from GitMatcher?",
            placeholder: "Discuss churn prediction, feature engineering, model selection, early warning systems, intervention strategies..."
          },
          q16: {
            label: "How would you analyze GitMatcher's competitive positioning using market research and user behavior data?",
            placeholder: "Discuss competitive analysis, market research, user surveys, feature comparison, positioning insights..."
          },
          q17: {
            label: "How would you design GitMatcher's data pipeline for real-time analytics and decision making?",
            placeholder: "Discuss real-time processing, streaming analytics, data architecture, performance optimization, scalability..."
          },
          q18: {
            label: "How would you measure and improve GitMatcher's recommendation engine effectiveness using statistical methods?",
            placeholder: "Discuss recommendation metrics, precision/recall, user satisfaction, engagement analysis, continuous improvement..."
          },
          q19: {
            label: "How would you analyze GitMatcher's international expansion opportunities using data-driven insights?",
            placeholder: "Discuss market analysis, regional trends, localization needs, expansion metrics, risk assessment..."
          },
          q20: {
            label: "How would you establish GitMatcher's data governance and ensure compliance with privacy regulations?",
            placeholder: "Discuss data governance frameworks, privacy compliance, data lineage, security measures, audit processes..."
          }
        };

      case 'Project Manager':
        return {
          q1: {
            label: "How would you manage a cross-functional team developing GitMatcher's matching algorithm while coordinating between developers, designers, and data scientists?",
            placeholder: "Discuss agile methodologies, stakeholder management, cross-team communication, timeline coordination..."
          },
          q2: {
            label: "How would you prioritize feature development for GitMatcher when balancing user requests, technical debt, and business objectives?",
            placeholder: "Discuss prioritization frameworks, stakeholder alignment, roadmap planning, resource allocation..."
          },
          q3: {
            label: "How would you handle project risks related to GitHub API dependencies, data privacy regulations, and scaling challenges?",
            placeholder: "Discuss risk assessment, mitigation strategies, contingency planning, compliance management..."
          },
          q4: {
            label: "How would you measure and report project success for GitMatcher development iterations? What KPIs would you track?",
            placeholder: "Discuss project metrics, team velocity, quality indicators, stakeholder reporting, continuous improvement..."
          },
          q5: {
            label: "Describe your approach to managing GitMatcher's product roadmap while adapting to changing market conditions and user feedback.",
            placeholder: "Discuss roadmap planning, flexibility, stakeholder communication, pivot strategies, market responsiveness..."
          },
          q6: {
            label: "How would you coordinate GitMatcher's go-to-market strategy across engineering, marketing, and sales teams?",
            placeholder: "Discuss cross-functional coordination, launch planning, timeline management, communication strategies..."
          },
          q7: {
            label: "How would you manage technical debt and maintenance work while delivering new features for GitMatcher?",
            placeholder: "Discuss technical debt prioritization, maintenance planning, team capacity, quality balance..."
          },
          q8: {
            label: "Describe your strategy for managing remote team collaboration on GitMatcher's development across different time zones.",
            placeholder: "Discuss remote management, async communication, team coordination, productivity tools, culture building..."
          },
          q9: {
            label: "How would you handle scope creep and changing requirements during GitMatcher's development cycles?",
            placeholder: "Discuss scope management, change control, stakeholder communication, impact assessment, decision frameworks..."
          },
          q10: {
            label: "How would you establish and maintain quality assurance processes for GitMatcher's releases?",
            placeholder: "Discuss QA processes, testing strategies, release criteria, bug management, quality metrics..."
          },
          q11: {
            label: "Describe your approach to post-launch monitoring and iteration planning for GitMatcher's features.",
            placeholder: "Discuss post-launch analysis, success metrics, iteration planning, feedback incorporation, continuous improvement..."
          },
          q12: {
            label: "How would you manage GitMatcher's vendor relationships and third-party integrations while maintaining project timelines?",
            placeholder: "Discuss vendor management, integration planning, dependency management, risk mitigation, contract coordination..."
          },
          q13: {
            label: "How would you establish GitMatcher's project management culture and best practices across teams?",
            placeholder: "Discuss culture building, process standardization, team adoption, continuous improvement, knowledge sharing..."
          },
          q14: {
            label: "How would you manage GitMatcher's budget and resource allocation across multiple concurrent projects?",
            placeholder: "Discuss budget management, resource planning, cost optimization, ROI tracking, financial reporting..."
          },
          q15: {
            label: "How would you handle crisis management when GitMatcher faces critical production issues or security incidents?",
            placeholder: "Discuss crisis response, incident management, team coordination, communication strategies, recovery planning..."
          },
          q16: {
            label: "How would you establish GitMatcher's product roadmap and align it with business objectives and user needs?",
            placeholder: "Discuss roadmap planning, strategic alignment, user feedback integration, market analysis, priority setting..."
          },
          q17: {
            label: "How would you manage GitMatcher's compliance requirements and regulatory considerations for global markets?",
            placeholder: "Discuss compliance management, regulatory awareness, risk assessment, documentation, audit preparation..."
          },
          q18: {
            label: "How would you optimize GitMatcher's development velocity while maintaining code quality and team well-being?",
            placeholder: "Discuss velocity optimization, quality balance, team sustainability, process improvement, productivity metrics..."
          },
          q19: {
            label: "How would you establish GitMatcher's knowledge management and documentation practices for institutional knowledge?",
            placeholder: "Discuss knowledge management, documentation strategies, team onboarding, information sharing, process documentation..."
          },
          q20: {
            label: "How would you prepare GitMatcher for scaling challenges as the platform grows from startup to enterprise?",
            placeholder: "Discuss scaling strategies, organizational growth, process evolution, infrastructure planning, team expansion..."
          }
        };

      default:
        return {
          q1: {
            label: "How would you contribute to GitMatcher's mission of connecting developers through code analysis and matching?",
            placeholder: "Discuss your approach to this role and how you would add value to the team..."
          },
          q2: {
            label: "What unique skills and experience do you bring that would help GitMatcher grow and succeed?",
            placeholder: "Discuss your relevant background, skills, and potential contributions..."
          },
          q3: {
            label: "How do you stay current with trends and technologies in your field that could benefit GitMatcher?",
            placeholder: "Discuss your learning approach, industry awareness, and knowledge application..."
          },
          q4: {
            label: "Describe a challenging project you've worked on and how you overcame obstacles to achieve success.",
            placeholder: "Discuss problem-solving skills, resilience, and professional achievements..."
          },
          q5: {
            label: "How would you approach building and maintaining professional relationships within GitMatcher's team environment?",
            placeholder: "Discuss teamwork, collaboration, communication styles, and relationship building..."
          },
          q6: {
            label: "What interests you most about working in a technology startup focused on developer career matching?",
            placeholder: "Discuss startup culture, career matching concepts, technology innovation, growth opportunities..."
          },
          q7: {
            label: "How do you handle adapting to new tools, processes, or methodologies in your work?",
            placeholder: "Discuss adaptability, learning agility, change management, continuous improvement..."
          },
          q8: {
            label: "Describe your approach to quality and attention to detail in your professional work.",
            placeholder: "Discuss quality standards, error prevention, thoroughness, professional excellence..."
          },
          q9: {
            label: "How would you contribute to creating an inclusive and collaborative work environment at GitMatcher?",
            placeholder: "Discuss diversity, inclusion, team dynamics, cultural contribution, collaboration..."
          },
          q10: {
            label: "What strategies do you use to manage priorities and deadlines in a fast-paced work environment?",
            placeholder: "Discuss time management, prioritization, efficiency, stress management, productivity..."
          },
          q11: {
            label: "How do you approach professional development and skill advancement in your career?",
            placeholder: "Discuss learning goals, skill development, career growth, professional advancement..."
          },
          q12: {
            label: "What questions do you have about GitMatcher's mission, team culture, or this specific role?",
            placeholder: "Share any questions about our company vision, work environment, growth opportunities, or role expectations..."
          },
          q13: {
            label: "How would you measure success in your role at GitMatcher?",
            placeholder: "Discuss success metrics, goal setting, performance indicators, achievement measurement..."
          },
          q14: {
            label: "Describe your ideal work environment and how GitMatcher's remote-first culture aligns with your preferences.",
            placeholder: "Discuss work environment preferences, remote work experience, collaboration styles, productivity factors..."
          },
          q15: {
            label: "How would you handle feedback and constructive criticism in your professional development?",
            placeholder: "Discuss feedback reception, growth mindset, improvement strategies, learning from criticism..."
          },
          q16: {
            label: "What motivates you to do your best work, and how do you maintain that motivation?",
            placeholder: "Discuss motivation factors, self-management, engagement strategies, professional fulfillment..."
          },
          q17: {
            label: "How would you contribute to GitMatcher's innovation and continuous improvement culture?",
            placeholder: "Discuss innovation mindset, creative thinking, process improvement, idea contribution..."
          },
          q18: {
            label: "Describe a time when you had to learn something completely new for work. How did you approach it?",
            placeholder: "Discuss learning strategies, adaptability, skill acquisition, knowledge transfer..."
          },
          q19: {
            label: "How do you balance individual productivity with team collaboration and knowledge sharing?",
            placeholder: "Discuss work balance, team dynamics, knowledge sharing, individual vs team success..."
          },
          q20: {
            label: "What are your long-term career goals, and how does this role at GitMatcher fit into your plans?",
            placeholder: "Discuss career aspirations, professional goals, company alignment, growth opportunities..."
          }
        };
    }
  };

  // Get position-specific preference questions
  const getPositionPreferences = (position: string) => {
    switch (position) {
      case 'Backend Developer':
      case 'Full Stack Developer':
        return {
          q1: {
            label: "What is your preferred programming language for backend development?",
            options: ['JavaScript/Node.js', 'Python', 'Java', 'Go', 'Rust', 'C#/.NET', 'Other']
          },
          q2: {
            label: "What is your preferred development approach?",
            options: ['Microservices Architecture', 'Monolithic Applications', 'Serverless Functions', 'Hybrid Approach']
          },
          q3: {
            label: "What team size do you work best in?",
            options: ['Solo (1-2 people)', 'Small team (3-5 people)', 'Medium team (6-10 people)', 'Large team (10+ people)']
          }
        };

      case 'Frontend Developer':
        return {
          q1: {
            label: "What is your preferred frontend framework/library?",
            options: ['React', 'Vue.js', 'Angular', 'Svelte', 'Vanilla JavaScript', 'Other']
          },
          q2: {
            label: "What is your preferred styling approach?",
            options: ['CSS-in-JS (styled-components)', 'CSS Modules', 'Tailwind CSS', 'SCSS/SASS', 'Vanilla CSS']
          },
          q3: {
            label: "What team size do you work best in?",
            options: ['Solo (1-2 people)', 'Small team (3-5 people)', 'Medium team (6-10 people)', 'Large team (10+ people)']
          }
        };

      case 'AI Integration Specialist':
        return {
          q1: {
            label: "What is your preferred AI/ML framework?",
            options: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Hugging Face', 'OpenAI API', 'Other']
          },
          q2: {
            label: "What is your preferred data processing approach?",
            options: ['Real-time Processing', 'Batch Processing', 'Stream Processing', 'Hybrid Approach']
          },
          q3: {
            label: "What team size do you work best in?",
            options: ['Solo (1-2 people)', 'Small team (3-5 people)', 'Medium team (6-10 people)', 'Large team (10+ people)']
          }
        };

      case 'Social Media Manager':
        return {
          q1: {
            label: "What is your preferred social media management approach?",
            options: ['Content Creation Focus', 'Community Engagement Focus', 'Analytics & Strategy Focus', 'Balanced Approach']
          },
          q2: {
            label: "What is your preferred content creation style?",
            options: ['Visual/Graphic Heavy', 'Text & Blog Posts', 'Video Content', 'Interactive/Polls', 'Mixed Content']
          },
          q3: {
            label: "What team collaboration style works best for you?",
            options: ['Independent with check-ins', 'Close collaboration', 'Cross-functional teams', 'Campaign-based teams']
          }
        };

      case 'UX/UI Designer':
        return {
          q1: {
            label: "What is your preferred design tool?",
            options: ['Figma', 'Adobe XD', 'Sketch', 'Adobe Creative Suite', 'InVision', 'Other']
          },
          q2: {
            label: "What is your preferred design approach?",
            options: ['User-Centered Design', 'Design Thinking Process', 'Agile Design', 'Lean UX', 'Design Systems First']
          },
          q3: {
            label: "What team collaboration style works best for you?",
            options: ['Embedded in dev teams', 'Separate design team', 'Cross-functional squads', 'Design-led projects']
          }
        };

      case 'Data Analyst':
        return {
          q1: {
            label: "What is your preferred data analysis tool?",
            options: ['Python (Pandas/NumPy)', 'R', 'SQL', 'Excel/Google Sheets', 'Tableau/Power BI', 'Other']
          },
          q2: {
            label: "What is your preferred analysis approach?",
            options: ['Exploratory Data Analysis', 'Statistical Modeling', 'Machine Learning', 'Business Intelligence', 'Predictive Analytics']
          },
          q3: {
            label: "What team collaboration style works best for you?",
            options: ['Independent analysis', 'Embedded with stakeholders', 'Data team collaboration', 'Cross-functional projects']
          }
        };

      case 'Project Manager':
        return {
          q1: {
            label: "What is your preferred project management methodology?",
            options: ['Agile/Scrum', 'Kanban', 'Waterfall', 'Hybrid Approach', 'Lean Project Management']
          },
          q2: {
            label: "What is your preferred team communication style?",
            options: ['Daily standups & regular check-ins', 'Weekly milestone reviews', 'Asynchronous updates', 'Continuous collaboration']
          },
          q3: {
            label: "What team size do you prefer to manage?",
            options: ['Small team (3-5 people)', 'Medium team (6-10 people)', 'Large team (10-15 people)', 'Multiple teams (15+ people)']
          }
        };

      default:
        return {
          q1: {
            label: "What is your preferred work style?",
            options: ['Independent work', 'Collaborative work', 'Mixed approach', 'Team leadership']
          },
          q2: {
            label: "What is your preferred communication style?",
            options: ['Direct communication', 'Detailed documentation', 'Visual presentations', 'Regular meetings']
          },
          q3: {
            label: "What team size do you work best in?",
            options: ['Solo (1-2 people)', 'Small team (3-5 people)', 'Medium team (6-10 people)', 'Large team (10+ people)']
          }
        };
    }
  };

  // Get position-specific video questions
  const getPositionVideoQuestions = (position: string) => {
    switch (position) {
      case 'Backend Developer':
      case 'Full Stack Developer':
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher as a developer. Explain your experience with backend systems and API development. (2-3 minutes)",
          technical: "If you had to build a 'developer profile card' with dynamic data (commits, repos, skills), what framework and state management would you use? Walk through your technical approach including database design, API architecture, and caching strategies. (2-3 minutes)"
        };

      case 'Frontend Developer':
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher as a frontend developer. Explain your experience with user interfaces and responsive design. (2-3 minutes)",
          technical: "If you had to build a 'developer matching interface' that shows compatibility scores and skill overlaps, how would you design the UI/UX? Walk through your component architecture, state management, and data visualization approach. (2-3 minutes)"
        };

      case 'AI Integration Specialist':
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher as an AI specialist. Explain your experience with machine learning and data analysis. (2-3 minutes)",
          technical: "If you had to build an AI system that analyzes GitHub activity to predict developer compatibility, what machine learning approach would you use? Walk through your data pipeline, model selection, and integration strategy. (2-3 minutes)"
        };

      case 'Social Media Manager':
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher as a social media manager. Explain your experience with community building and content creation. (2-3 minutes)",
          technical: "If you had to launch a social media campaign to promote GitMatcher to the developer community, what would be your strategy? Walk through your content plan, platform selection, influencer outreach, and success metrics. (2-3 minutes)"
        };

      case 'UX/UI Designer':
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher as a UX/UI designer. Explain your experience with user research and design systems. (2-3 minutes)",
          technical: "If you had to design the user flow for developers finding compatible collaborators on GitMatcher, how would you approach it? Walk through your research process, wireframing, user testing strategy, and final design decisions. (2-3 minutes)"
        };

      case 'Data Analyst':
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher as a data analyst. Explain your experience with data visualization and business intelligence. (2-3 minutes)",
          technical: "If you had to analyze GitMatcher's user behavior to improve matching accuracy, what metrics would you track and what analysis approach would you use? Walk through your data collection, analysis methodology, and reporting strategy. (2-3 minutes)"
        };

      case 'Project Manager':
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher as a project manager. Explain your experience with cross-functional teams and agile methodologies. (2-3 minutes)",
          technical: "If you had to manage the development of GitMatcher's new matching algorithm feature, how would you coordinate between developers, designers, and data scientists? Walk through your project planning, risk management, and stakeholder communication approach. (2-3 minutes)"
        };

      default:
        return {
          intro: "Please introduce yourself, your background, and why you want to work at GitMatcher. Explain your relevant experience and what excites you about this opportunity. (2-3 minutes)",
          technical: "If you had to contribute to GitMatcher's success in your role, what would be your approach? Walk through your strategy, key initiatives, and how you would measure success. (2-3 minutes)"
        };
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Personal Information
        if (!formData.fullName.trim()) {
          newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
          newErrors.fullName = 'Please enter a valid full name';
        }

        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email.trim())) {
          newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.position.trim()) newErrors.position = 'Position is required';
        if (!formData.experience.trim()) newErrors.experience = 'Experience level is required';
        break;
      
      case 1: // Technical Questions
        if (!formData.gitMatcherScaling.trim()) {
          newErrors.gitMatcherScaling = 'This answer is required';
        } else if (formData.gitMatcherScaling.trim().length < 50) {
          newErrors.gitMatcherScaling = 'Please provide a more detailed answer (minimum 50 characters)';
        }

        if (!formData.collaborationBalance.trim()) {
          newErrors.collaborationBalance = 'This answer is required';
        } else if (formData.collaborationBalance.trim().length < 50) {
          newErrors.collaborationBalance = 'Please provide a more detailed answer (minimum 50 characters)';
        }

        if (!formData.infrastructureDesign.trim()) {
          newErrors.infrastructureDesign = 'This answer is required';
        } else if (formData.infrastructureDesign.trim().length < 50) {
          newErrors.infrastructureDesign = 'Please provide a more detailed answer (minimum 50 characters)';
        }

        if (!formData.uiDesign.trim()) {
          newErrors.uiDesign = 'This answer is required';
        } else if (formData.uiDesign.trim().length < 50) {
          newErrors.uiDesign = 'Please provide a more detailed answer (minimum 50 characters)';
        }
        break;
      
      case 2: // Multiple Choice
        if (!formData.preferredLanguage) newErrors.preferredLanguage = 'Please select an option';
        if (!formData.workStyle) newErrors.workStyle = 'Please select an option';
        if (!formData.teamSize) newErrors.teamSize = 'Please select an option';
        break;
      
      case 3: // Video Questions
        if (!formData.introVideo.trim()) {
          newErrors.introVideo = 'Introduction video link is required';
        } else if (!validateGoogleDriveLink(formData.introVideo.trim())) {
          newErrors.introVideo = 'Please provide a valid Google Drive link (e.g., https://drive.google.com/file/d/...)';
        }

        if (!formData.technicalVideo.trim()) {
          newErrors.technicalVideo = 'Technical video link is required';
        } else if (!validateGoogleDriveLink(formData.technicalVideo.trim())) {
          newErrors.technicalVideo = 'Please provide a valid Google Drive link (e.g., https://drive.google.com/file/d/...)';
        }

        // Check if both video links are the same
        if (formData.introVideo.trim() && formData.technicalVideo.trim() && 
            formData.introVideo.trim() === formData.technicalVideo.trim()) {
          newErrors.introVideo = 'Introduction and technical videos must be different';
          newErrors.technicalVideo = 'Introduction and technical videos must be different';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // Generate unique interview ID
        const interviewId = `GIT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        console.log('🎯 INTERVIEW SUBMISSION STARTING...');
        console.log('📋 Interview ID:', interviewId);
        console.log('📋 Form Data:', formData);
        
        // Save to Google Sheets
        const dataService = DataService.getInstance();
        try {
          console.log('💾 Attempting to save to Google Sheets...');
          const success = await dataService.saveInterviewData(formData, interviewId);
          if (success) {
            console.log('✅ SUCCESS: Interview data saved to Google Sheets!');
          } else {
            console.log('⚠️ FALLBACK: Interview data saved to local backup');
          }
        } catch (error) {
          console.error('❌ ERROR saving interview data:', error);
        }
        
        // Continue to success page
        onComplete(formData, interviewId);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepTitles = [
    'Personal Information',
    'Technical Assessment',
    'Work Preferences',
    'Video Responses'
  ];

  return (
    <div className="virtual-interview">
      {!interviewStarted ? (
        // Interview Introduction Screen
        <div className="interview-intro" style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="intro-card" style={{
            background: 'white',
            borderRadius: '16px',
            padding: '48px',
            maxWidth: '720px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }}>
                <i className="fas fa-code-branch" style={{ fontSize: '32px', color: 'white' }}></i>
              </div>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                color: '#1a202c', 
                margin: '0 0 8px 0',
                letterSpacing: '-0.025em'
              }}>
                GitMatcher
              </h1>
              <p style={{ 
                fontSize: '1.25rem', 
                color: '#64748b', 
                margin: '0',
                fontWeight: '500'
              }}>
                Technical Assessment
              </p>
            </div>

            {/* Guidelines Grid */}
            <div style={{
              display: 'grid',
              gap: '24px',
              marginBottom: '40px',
              textAlign: 'left'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '20px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#3b82f6',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fas fa-clock" style={{ color: 'white', fontSize: '18px' }}></i>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                    60 Minutes • 20 Questions
                  </h3>
                  <p style={{ margin: '0', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    Comprehensive technical evaluation designed to assess your skills and problem-solving abilities.
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '20px',
                background: '#fef3c7',
                borderRadius: '12px',
                border: '1px solid #fbbf24'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#f59e0b',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fas fa-robot" style={{ color: 'white', fontSize: '18px' }}></i>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '600', color: '#92400e' }}>
                    No AI Tools Allowed
                  </h3>
                  <p style={{ margin: '0', color: '#92400e', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    This assessment evaluates your personal knowledge. AI assistants and automated tools are prohibited.
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '20px',
                background: '#fef2f2',
                borderRadius: '12px',
                border: '1px solid #fca5a5'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#ef4444',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fas fa-exclamation-triangle" style={{ color: 'white', fontSize: '18px' }}></i>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '600', color: '#dc2626' }}>
                    Do Not Close This Tab
                  </h3>
                  <p style={{ margin: '0', color: '#dc2626', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    Closing or refreshing this page will void your assessment. Ensure stable internet connection.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div style={{
              background: '#f1f5f9',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
              border: '1px solid #cbd5e1'
            }}>
              <h4 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '1rem', 
                fontWeight: '600', 
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-lightbulb" style={{ color: '#3b82f6' }}></i>
                Quick Tips for Success
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                fontSize: '0.9rem',
                color: '#475569'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '14px' }}></i>
                  Find a quiet space
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '14px' }}></i>
                  Close other applications
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '14px' }}></i>
                  Read questions carefully
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '14px' }}></i>
                  Manage your time wisely
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button 
              onClick={() => setInterviewStarted(true)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 48px',
                fontSize: '1.1rem',
                fontWeight: '600',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '0 auto'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              <i className="fas fa-play"></i>
              Start Assessment
            </button>

            <p style={{ 
              marginTop: '16px', 
              color: '#64748b', 
              fontSize: '0.875rem',
              fontStyle: 'italic'
            }}>
              Timer begins immediately after clicking start
            </p>
          </div>
        </div>
      ) : (
        // Existing Interview Content
        <>
          <div className="interview-header">
            <div className="company-branding">
              <h1><i className="fas fa-code-branch"></i> GitMatcher</h1>
              <p>Virtual Technical Interview</p>
            </div>
            
            <div className="timer-display">
              <i className="fas fa-clock"></i>
              <span className="timer">{formatTime(timeLeft)}</span>
              <small>Time Remaining</small>
            </div>
          </div>

          <div className="interview-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
              ></div>
            </div>
            <p>Step {currentStep + 1} of 4: {stepTitles[currentStep]}</p>
          </div>

      <div className="interview-content">
        {currentStep === 0 && (
          <div className="interview-step">
            <h2>Welcome to GitMatcher Technical Interview</h2>
            <p className="step-description">
              Please provide your basic information to begin the technical assessment.
            </p>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="your.email@example.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="position">Position Applied For *</label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={errors.position ? 'error' : ''}
                >
                  <option value="">Select a position</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="AI Integration Specialist">AI Integration Specialist</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Social Media Manager">Social Media Manager</option>
                  <option value="UX/UI Designer">UX/UI Designer</option>
                  <option value="Data Analyst">Data Analyst</option>
                </select>
                {errors.position && <span className="error-message">{errors.position}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="experience">Years of Experience *</label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={errors.experience ? 'error' : ''}
                >
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years (Entry Level)</option>
                  <option value="2-3">2-3 years (Junior)</option>
                  <option value="4-6">4-6 years (Mid-Level)</option>
                  <option value="7-10">7-10 years (Senior)</option>
                  <option value="10+">10+ years (Expert/Lead)</option>
                </select>
                {errors.experience && <span className="error-message">{errors.experience}</span>}
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="interview-step">
            <h2>Technical Assessment</h2>
            <p className="step-description">
              Please provide detailed answers to the following questions specific to your selected position.
              {!formData.position && (
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                  <br />Please select a position in the previous step to see relevant questions.
                </span>
              )}
            </p>

            {formData.position && (() => {
              const questions = getPositionQuestions(formData.position);
              return (
                <>
                  <div className="question-block">
                    <label htmlFor="gitMatcherScaling">
                      <strong>Question 1:</strong> {questions.q1.label} *
                    </label>
                    <textarea
                      id="gitMatcherScaling"
                      name="gitMatcherScaling"
                      value={formData.gitMatcherScaling}
                      onChange={handleInputChange}
                      className={errors.gitMatcherScaling ? 'error' : ''}
                      rows={6}
                      placeholder={questions.q1.placeholder}
                    />
                    {errors.gitMatcherScaling && <span className="error-message">{errors.gitMatcherScaling}</span>}
                  </div>

                  <div className="question-block">
                    <label htmlFor="collaborationBalance">
                      <strong>Question 2:</strong> {questions.q2.label} *
                    </label>
                    <textarea
                      id="collaborationBalance"
                      name="collaborationBalance"
                      value={formData.collaborationBalance}
                      onChange={handleInputChange}
                      className={errors.collaborationBalance ? 'error' : ''}
                      rows={5}
                      placeholder={questions.q2.placeholder}
                    />
                    {errors.collaborationBalance && <span className="error-message">{errors.collaborationBalance}</span>}
                  </div>

                  <div className="question-block">
                    <label htmlFor="infrastructureDesign">
                      <strong>Question 3:</strong> {questions.q3.label} *
                    </label>
                    <textarea
                      id="infrastructureDesign"
                      name="infrastructureDesign"
                      value={formData.infrastructureDesign}
                      onChange={handleInputChange}
                      className={errors.infrastructureDesign ? 'error' : ''}
                      rows={5}
                      placeholder={questions.q3.placeholder}
                    />
                    {errors.infrastructureDesign && <span className="error-message">{errors.infrastructureDesign}</span>}
                  </div>

                  <div className="question-block">
                    <label htmlFor="uiDesign">
                      <strong>Question 4:</strong> {questions.q4.label} *
                    </label>
                    <textarea
                      id="uiDesign"
                      name="uiDesign"
                      value={formData.uiDesign}
                      onChange={handleInputChange}
                      className={errors.uiDesign ? 'error' : ''}
                      rows={5}
                      placeholder={questions.q4.placeholder}
                    />
                    {errors.uiDesign && <span className="error-message">{errors.uiDesign}</span>}
                  </div>
                </>
              );
            })()}

            {!formData.position && (
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                background: '#f9fafb', 
                border: '2px dashed #d1d5db', 
                borderRadius: '0.5rem',
                margin: '1rem 0'
              }}>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                  <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                  Please go back and select a position to see the relevant technical questions.
                </p>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="interview-step">
            <h2>Work Style & Preferences</h2>
            <p className="step-description">
              Help us understand your work preferences and choices specific to your role.
              {!formData.position && (
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                  <br />Please select a position in step 1 to see relevant preference questions.
                </span>
              )}
            </p>

            {formData.position && (() => {
              const preferences = getPositionPreferences(formData.position);
              return (
                <>
                  <div className="question-block">
                    <label><strong>{preferences.q1.label}</strong> *</label>
                    <div className="radio-group">
                      {preferences.q1.options.map(option => (
                        <label key={option} className="radio-label">
                          <input
                            type="radio"
                            name="preferredLanguage"
                            value={option}
                            checked={formData.preferredLanguage === option}
                            onChange={handleInputChange}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    {errors.preferredLanguage && <span className="error-message">{errors.preferredLanguage}</span>}
                  </div>

                  <div className="question-block">
                    <label><strong>{preferences.q2.label}</strong> *</label>
                    <div className="radio-group">
                      {preferences.q2.options.map(option => (
                        <label key={option} className="radio-label">
                          <input
                            type="radio"
                            name="workStyle"
                            value={option}
                            checked={formData.workStyle === option}
                            onChange={handleInputChange}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    {errors.workStyle && <span className="error-message">{errors.workStyle}</span>}
                  </div>

                  <div className="question-block">
                    <label><strong>{preferences.q3.label}</strong> *</label>
                    <div className="radio-group">
                      {preferences.q3.options.map(option => (
                        <label key={option} className="radio-label">
                          <input
                            type="radio"
                            name="teamSize"
                            value={option}
                            checked={formData.teamSize === option}
                            onChange={handleInputChange}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    {errors.teamSize && <span className="error-message">{errors.teamSize}</span>}
                  </div>
                </>
              );
            })()}

            {!formData.position && (
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                background: '#f9fafb', 
                border: '2px dashed #d1d5db', 
                borderRadius: '0.5rem',
                margin: '1rem 0'
              }}>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                  <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                  Please go back and select a position to see the relevant preference questions.
                </p>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="interview-step">
            <h2>Video Responses</h2>
            <p className="step-description">
              Please record short videos answering the questions below specific to your selected position. Upload to Google Drive and share the links.
              {!formData.position && (
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                  <br />Please select a position in step 1 to see relevant video questions.
                </span>
              )}
            </p>

            <div className="video-instructions">
              <div className="instruction-box">
                <h4><i className="fas fa-video"></i> Video Recording Instructions</h4>
                <ul>
                  <li>Record each video separately (2-3 minutes each)</li>
                  <li>Ensure good lighting and clear audio</li>
                  <li>Upload to Google Drive and make it viewable by anyone with the link</li>
                  <li>Paste the Google Drive share link in the corresponding field</li>
                  <li><strong>Important:</strong> Each video must have a unique Google Drive link</li>
                </ul>
                <div className="example-link">
                  <strong>Example valid link:</strong> https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view
                </div>
              </div>
            </div>

            {formData.position && (() => {
              const videoQuestions = getPositionVideoQuestions(formData.position);
              return (
                <>
                  <div className="question-block">
                    <label htmlFor="introVideo">
                      <strong>Video 1: Introduction</strong><br/>
                      {videoQuestions.intro} *
                    </label>
                    <div className="input-with-validation">
                      <input
                        type="url"
                        id="introVideo"
                        name="introVideo"
                        value={formData.introVideo}
                        onChange={handleInputChange}
                        className={errors.introVideo ? 'error' : (formData.introVideo && validateGoogleDriveLink(formData.introVideo) ? 'valid' : '')}
                        placeholder="https://drive.google.com/file/d/..."
                      />
                      {formData.introVideo && validateGoogleDriveLink(formData.introVideo) && !errors.introVideo && (
                        <span className="validation-icon valid"><i className="fas fa-check-circle"></i></span>
                      )}
                      {formData.introVideo && !validateGoogleDriveLink(formData.introVideo) && (
                        <span className="validation-icon invalid"><i className="fas fa-times-circle"></i></span>
                      )}
                    </div>
                    {errors.introVideo && <span className="error-message">{errors.introVideo}</span>}
                  </div>

                  <div className="question-block">
                    <label htmlFor="technicalVideo">
                      <strong>Video 2: Role-Specific Challenge</strong><br/>
                      {videoQuestions.technical} *
                    </label>
                    <div className="input-with-validation">
                      <input
                        type="url"
                        id="technicalVideo"
                        name="technicalVideo"
                        value={formData.technicalVideo}
                        onChange={handleInputChange}
                        className={errors.technicalVideo ? 'error' : (formData.technicalVideo && validateGoogleDriveLink(formData.technicalVideo) ? 'valid' : '')}
                        placeholder="https://drive.google.com/file/d/..."
                      />
                      {formData.technicalVideo && validateGoogleDriveLink(formData.technicalVideo) && !errors.technicalVideo && (
                        <span className="validation-icon valid"><i className="fas fa-check-circle"></i></span>
                      )}
                      {formData.technicalVideo && !validateGoogleDriveLink(formData.technicalVideo) && (
                        <span className="validation-icon invalid"><i className="fas fa-times-circle"></i></span>
                      )}
                    </div>
                    {errors.technicalVideo && <span className="error-message">{errors.technicalVideo}</span>}
                  </div>
                </>
              );
            })()}

            {!formData.position && (
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                background: '#f9fafb', 
                border: '2px dashed #d1d5db', 
                borderRadius: '0.5rem',
                margin: '1rem 0'
              }}>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                  <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                  Please go back and select a position to see the relevant video questions.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="interview-actions">
        {currentStep > 0 && (
          <button type="button" className="btn btn-secondary" onClick={prevStep}>
            <i className="fas fa-arrow-left"></i>
            Previous
          </button>
        )}
        
        <button type="button" className="btn btn-primary" onClick={nextStep}>
          {currentStep < 3 ? (
            <>
              Next
              <i className="fas fa-arrow-right"></i>
            </>
          ) : (
            <>
              Submit Interview
              <i className="fas fa-check"></i>
            </>
          )}
        </button>
      </div>
        </>
      )}
    </div>
  );
};

export default VirtualInterview;
