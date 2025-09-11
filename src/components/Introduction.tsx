import React from 'react';
import userData from '../data/users.json';
import HRVideoMessage from './HRVideoMessage';

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio: string;
  linkedin?: string;
  isPending?: boolean;
}

interface IntroductionProps {
  onContinue: () => void;
  currentUser?: string;
}

const Introduction: React.FC<IntroductionProps> = ({ onContinue, currentUser }) => {
  // Get user's first name from the user data
  const getUserFirstName = (username?: string): string => {
    if (!username) return 'there';
    
    const user = userData.users.find(u => u.username === username);
    if (user && user.personalInfo.firstName && user.personalInfo.firstName !== '[FIRST_NAME]') {
      return user.personalInfo.firstName;
    }
    return username.replace('Candidate', '');
  };

  // Get full user object
  const getUserObject = (username?: string) => {
    if (!username) return null;
    return userData.users.find(u => u.username === username);
  };

  const firstName = getUserFirstName(currentUser);
  const userObject = getUserObject(currentUser);
  // Team member profiles
  const teamMembers: TeamMember[] = [
    {
      name: "Nabil Chiheb",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bio: "Visionary entrepreneur behind GitMatcher",
      linkedin: "https://www.linkedin.com/in/nabil-chiheb"
    },
    {
      name: "Amara Johnson",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
      bio: "Leading our technical innovation"
    },
    {
      name: "Marcus Rodriguez",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      bio: "Building the future of developer matching"
    },
    {
      name: "Christian Ostmo",
      role: "Head of HR",
      image: "/images/christian-ostmo.jpeg",
      bio: "Building amazing teams and fostering company culture"
    },
    {
      name: "David Kim",
      role: "Senior Engineer",
      image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop&crop=face",
      bio: "Architecting scalable solutions"
    }
  ];

  // Add current user as pending team member
  const dynamicTeamMembers: TeamMember[] = [
    ...teamMembers,
    {
      name: userObject?.personalInfo?.firstName && userObject?.personalInfo?.lastName 
        ? `${userObject.personalInfo.firstName} ${userObject.personalInfo.lastName}`
        : firstName || "New Team Member",
      role: "Pending...",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&blur=10",
      bio: "Soon to be part of our amazing team!",
      isPending: true
    }
  ];

  return (
    <div className="introduction-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: window.innerWidth <= 768 ? '20px 10px' : '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="introduction-container" style={{
        maxWidth: '1000px',
        width: '100%',
        background: 'white',
        borderRadius: window.innerWidth <= 768 ? '15px' : '20px',
        padding: window.innerWidth <= 768 ? '30px 20px' : '60px 40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        {/* Header Section */}
        <div className="welcome-header" style={{ marginBottom: window.innerWidth <= 768 ? '30px' : '50px' }}>
          <div style={{
            width: window.innerWidth <= 768 ? '80px' : '100px',
            height: window.innerWidth <= 768 ? '80px' : '100px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: window.innerWidth <= 768 ? '20px' : '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px auto'
          }}>
            <i className="fas fa-code-branch" style={{ fontSize: window.innerWidth <= 768 ? '30px' : '40px', color: 'white' }}></i>
          </div>
          
          <h1 style={{
            fontSize: window.innerWidth <= 768 ? '2rem' : window.innerWidth <= 1024 ? '2.5rem' : '3rem',
            fontWeight: '700',
            color: '#1a202c',
            margin: '0 0 20px 0',
            letterSpacing: '-0.025em',
            lineHeight: '1.2'
          }}>
            Welcome to <a href="https://gitmatcher.com/" target="_blank" rel="noopener noreferrer" style={{color: '#667eea', textDecoration: 'none'}}>GitMatcher</a>! 🎉
          </h1>
          
          <p style={{
            fontSize: window.innerWidth <= 768 ? '1.1rem' : '1.3rem',
            color: '#4a5568',
            margin: '0 0 15px 0',
            lineHeight: '1.6'
          }}>
            Congratulations {firstName}! You're officially part of our growing family.
          </p>
          
          <p style={{
            fontSize: window.innerWidth <= 768 ? '1rem' : '1.1rem',
            color: '#718096',
            margin: '0',
            lineHeight: '1.6'
          }}>
            Let's complete your onboarding and get you started on this exciting journey!
          </p>
        </div>

        {/* HR Video Message */}
        <HRVideoMessage />

        {/* Company Story Section */}
        <div className="company-story" style={{
          background: '#f7fafc',
          borderRadius: window.innerWidth <= 768 ? '12px' : '15px',
          padding: window.innerWidth <= 768 ? '25px 20px' : '40px',
          marginBottom: window.innerWidth <= 768 ? '30px' : '50px',
          textAlign: 'left'
        }}>
          <h2 style={{
            fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <i className="fas fa-rocket" style={{ color: '#667eea', marginRight: '10px' }}></i>
            Our Journey & Vision
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: window.innerWidth <= 768 ? '20px' : '30px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'white',
              padding: window.innerWidth <= 768 ? '20px' : '25px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ color: '#2d3748', marginBottom: '15px', fontSize: window.innerWidth <= 768 ? '1.1rem' : '1.2rem' }}>
                <i className="fas fa-lightbulb" style={{ color: '#f6ad55', marginRight: '8px' }}></i>
                The Dream
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6', margin: '0', fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem' }}>
                GitMatcher started as Nabil Chiheb's vision to revolutionize how developers connect and collaborate. 
                Our unique approach to matching developers based on skills, coding style, and compatibility has caught 
                the attention of industry leaders worldwide.
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: window.innerWidth <= 768 ? '20px' : '25px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ color: '#2d3748', marginBottom: '15px', fontSize: window.innerWidth <= 768 ? '1.1rem' : '1.2rem' }}>
                <i className="fas fa-chart-line" style={{ color: '#48bb78', marginRight: '8px' }}></i>
                The Growth
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6', margin: '0', fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem' }}>
                We've secured over <strong>$21 million in investment</strong> from top angel investors who believe in 
                our mission. This funding allows us to scale from our current small but mighty team to 
                <strong> 150+ employees</strong> by next year!
              </p>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: window.innerWidth <= 768 ? '20px' : '25px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '15px', fontSize: window.innerWidth <= 768 ? '1.2rem' : '1.3rem' }}>
              <i className="fas fa-star" style={{ marginRight: '10px' }}></i>
              Your Silicon Valley Opportunity
            </h3>
            <p style={{ margin: '0', fontSize: window.innerWidth <= 768 ? '1rem' : '1.1rem', lineHeight: '1.6' }}>
              As part of GitMatcher, you'll enjoy <strong>Silicon Valley-level compensation</strong> and benefits, 
              regardless of your location. We believe in paying our team competitively while building the 
              future of developer collaboration together.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section" style={{ marginBottom: window.innerWidth <= 768 ? '30px' : '50px' }}>
          <h2 style={{
            fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '30px'
          }}>
            <i className="fas fa-users" style={{ color: '#667eea', marginRight: '10px' }}></i>
            Meet Your Colleagues
          </h2>
          
          <p style={{
            fontSize: window.innerWidth <= 768 ? '1rem' : '1.1rem',
            color: '#4a5568',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            We're still a small, tight-knit team, but we're growing fast! Here are some of the amazing people you'll be working with:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: window.innerWidth <= 768 ? '20px' : '25px',
            marginBottom: '30px'
          }}>
            {dynamicTeamMembers.map((member, index) => (
              <div key={index} style={{
                background: member.isPending ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' : 'white',
                border: member.isPending ? '2px dashed #667eea' : '1px solid #e2e8f0',
                borderRadius: window.innerWidth <= 768 ? '12px' : '15px',
                padding: window.innerWidth <= 768 ? '20px 15px' : '25px 20px',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative' as const,
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = member.isPending 
                  ? '0 10px 30px rgba(102, 126, 234, 0.2)' 
                  : '0 10px 30px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                {member.isPending && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#667eea',
                    color: 'white',
                    fontSize: '0.7rem',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontWeight: '600'
                  }}>
                    NEW
                  </div>
                )}
                {member.isPending ? (
                  <div style={{
                    width: window.innerWidth <= 768 ? '70px' : '80px',
                    height: window.innerWidth <= 768 ? '70px' : '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    marginBottom: '15px',
                    border: '3px solid #667eea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: window.innerWidth <= 768 ? '1.5rem' : '1.8rem',
                    color: 'white',
                    fontWeight: 'bold',
                    margin: '0 auto 15px auto'
                  }}>
                    {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                ) : member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name}
                    style={{
                      width: window.innerWidth <= 768 ? '70px' : '80px',
                      height: window.innerWidth <= 768 ? '70px' : '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginBottom: '15px',
                      border: '3px solid #e2e8f0'
                    }}
                  />
                ) : (
                  <div style={{
                    width: window.innerWidth <= 768 ? '70px' : '80px',
                    height: window.innerWidth <= 768 ? '70px' : '80px',
                    borderRadius: '50%',
                    background: '#f8f9fa',
                    border: '3px solid #e2e8f0',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: window.innerWidth <= 768 ? '1.5rem' : '1.8rem',
                    color: '#718096',
                    fontWeight: 'bold',
                    margin: '0 auto 15px auto'
                  }}>
                    {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                )}
                <h4 style={{
                  fontSize: window.innerWidth <= 768 ? '1rem' : '1.1rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  margin: '0 0 5px 0'
                }}>
                  {member.name}
                </h4>
                <p style={{
                  fontSize: window.innerWidth <= 768 ? '0.85rem' : '0.9rem',
                  color: member.isPending ? '#667eea' : '#667eea',
                  fontWeight: member.isPending ? '700' : '500',
                  margin: '0 0 10px 0',
                  fontStyle: member.isPending ? 'italic' : 'normal'
                }}>
                  {member.role}
                </p>
                <p style={{
                  fontSize: window.innerWidth <= 768 ? '0.8rem' : '0.85rem',
                  color: '#718096',
                  margin: '0',
                  lineHeight: '1.4'
                }}>
                  {member.bio}
                </p>
                {member.linkedin && (
                  <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      marginTop: '10px',
                      padding: '5px 12px',
                      background: '#0077b5',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      transition: 'background 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#005582';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#0077b5';
                    }}
                  >
                    LinkedIn Profile
                  </a>
                )}
              </div>
            ))}
          </div>

          <div style={{
            background: '#fff5f5',
            border: '1px solid #fed7d7',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#c53030',
              margin: '0',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              <i className="fas fa-heart" style={{ marginRight: '8px' }}></i>
              Soon to be 150+ strong! We're partnering with several tech institutions all over the world to achieve this goal, as this is a very important next step for scaling. Your skills and passion will help us reach this milestone.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <p style={{
            fontSize: '1.1rem',
            color: '#4a5568',
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            Ready to officially join the GitMatcher family? Let's complete your onboarding process!
          </p>

          <button 
            onClick={onContinue}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: window.innerWidth <= 768 ? '14px 32px' : '16px 48px',
              fontSize: window.innerWidth <= 768 ? '1.1rem' : '1.2rem',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '0 auto',
              width: window.innerWidth <= 768 ? '100%' : 'auto',
              maxWidth: window.innerWidth <= 768 ? '300px' : 'none',
              justifyContent: 'center'
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
            <i className="fas fa-arrow-right"></i>
            Start Onboarding Process
          </button>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
