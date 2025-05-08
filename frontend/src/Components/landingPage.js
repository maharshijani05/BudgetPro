import React, { useState, useEffect } from 'react';
import { MessageCircle, PieChart, Target, TrendingUp, ChevronRight, ArrowLeft, ArrowRight, Briefcase, CreditCard, LineChart, Wallet, Shield, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  // State for feature carousel
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  // Feature carousel items
  const carouselItems = [
    {
      title: "Smart Budget Planning",
      description: "AI-powered budgeting that adapts to your spending habits and helps you save more.",
      icon: <PieChart size={48} color="#4a3aff" />,
      color: "#4a3aff"
    },
    {
      title: "Expense Tracking",
      description: "Automatically categorize transactions and visualize where your money is going.",
      icon: <BarChart size={48} color="#ff6b6b" />,
      color: "#ff6b6b"
    },
    {
      title: "Investment Insights",
      description: "Get personalized investment recommendations based on your financial goals.",
      icon: <TrendingUp size={48} color="#06d6a0" />,
      color: "#06d6a0"
    },
    {
      title: "Goal Management",
      description: "Set savings goals and get a clear path to achieve them with milestone tracking.",
      icon: <Target size={48} color="#ffd166" />,
      color: "#ffd166"
    },
    {
      title: "Secure Transactions",
      description: "Bank-level encryption keeps your financial data safe and secure.",
      icon: <Shield size={48} color="#118ab2" />,
      color: "#118ab2"
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselItems.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  // Manual navigation
  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  const goToPrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % carouselItems.length);
  };

  // Inline CSS styles
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      maxHeight: '100vh',
      fontFamily: "'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      overflow: 'hidden',
      background: 'linear-gradient(to bottom right, #f9faff, #f0f2ff)',
      color: '#333',
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(234, 236, 255, 0.5)',
      height: '4rem',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 700,
      fontSize: '1.25rem',
      color: '#4a3aff',
    },
    logoIcon: {
      marginRight: '0.5rem',
      fontSize: '1.5rem',
    },
    logoText: {
      color: '#4a3aff',
      fontWeight: 700,
    },
    navLinks: {
      display: 'flex',
      gap: '2rem',
    },
    navLink: {
      textDecoration: 'none',
      color: '#555',
      fontWeight: 500,
      transition: 'color 0.2s ease',
    },
    authButtons: {
      display: 'flex',
      gap: '1rem',
    },
    loginButton: {
      padding: '0.5rem 1rem',
      background: 'transparent',
      color: '#4a3aff',
      border: '1px solid #4a3aff',
      borderRadius: '0.5rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    signupButton: {
      padding: '0.5rem 1rem',
      background: '#4a3aff',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    heroSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 2rem',
      maxHeight: '60vh',
      height: '60vh',
    },
    heroContent: {
      maxWidth: '50%',
      paddingRight: '2rem',
    },
    heroTitle: {
      fontSize: '2.5rem',
      fontWeight: 800,
      lineHeight: 1.2,
      marginBottom: '1.5rem',
      color: '#222',
    },
    highlight: {
      color: '#4a3aff',
    },
    heroDescription: {
      fontSize: '1.125rem',
      lineHeight: 1.6,
      color: '#555',
      marginBottom: '2rem',
    },
    ctaButtons: {
      display: 'flex',
      gap: '1rem',
    },
    primaryButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      background: '#4a3aff',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    secondaryButton: {
      padding: '0.75rem 1.5rem',
      background: 'transparent',
      color: '#4a3aff',
      border: '1px solid #4a3aff',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    heroImage: {
      width: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    // New carousel styles
    carouselContainer: {
      width: '100%',
      maxWidth: '500px',
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(74, 58, 255, 0.15)',
      overflow: 'hidden',
      position: 'relative',
    },
    carouselHeader: {
      background: '#f8f9fd',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #f0f2ff',
    },
    carouselTitle: {
      fontWeight: 600,
      color: '#222',
      fontSize: '1.1rem',
    },
    carouselDots: {
      display: 'flex',
      gap: '0.5rem',
    },
    carouselDot: (isActive, color) => ({
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: '50%',
      background: isActive ? color : '#e0e0e0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
    carouselContent: {
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      height: '320px',
    },
    slideTransition: {
      transition: 'opacity 0.5s ease-in-out',
      opacity: 1,
    },
    carouselIconContainer: (color) => ({
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: `${color}10`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.5rem',
      boxShadow: `0 10px 20px -5px ${color}20`,
    }),
    carouselItemTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      marginBottom: '1rem',
      color: '#222',
    },
    carouselItemDescription: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#555',
      marginBottom: '1.5rem',
    },
    carouselNavigation: {
      display: 'flex',
      justifyContent: 'space-between',
      position: 'absolute',
      width: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      padding: '0 1rem',
    },
    carouselButton: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      background: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: 'none',
      transition: 'all 0.2s ease',
    },
    featureSection: {
      padding: '2rem',
      background: 'white',
      borderRadius: '1rem 1rem 0 0',
      boxShadow: '0 -5px 20px rgba(74, 58, 255, 0.05)',
    },
    sectionTitle: {
      textAlign: 'center',
      fontSize: '1.75rem',
      fontWeight: 700,
      marginBottom: '2rem',
      color: '#222',
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    featureCard: {
      background: '#f8f9fd',
      borderRadius: '1rem',
      padding: '1.5rem',
      transition: 'all 0.2s ease',
    },
    featureIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '3.5rem',
      height: '3.5rem',
      background: 'white',
      borderRadius: '0.75rem',
      marginBottom: '1rem',
      boxShadow: '0 4px 12px rgba(74, 58, 255, 0.1)',
    },
    featureTitle: {
      fontSize: '1.25rem',
      fontWeight: 700,
      marginBottom: '0.25rem',
      color: '#222',
    },
    featureSubtitle: {
      fontSize: '1rem',
      color: '#4a3aff',
      fontWeight: 500,
      marginBottom: '0.75rem',
    },
    featureDescription: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#555',
    },
    footer: {
      background: '#4a3aff',
      color: '#4a3aff',
      padding: '1.5rem 2rem',
    },
    footerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    footerTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    footerCta: {
      padding: '0.75rem 0.5rem',
      background: 'white',
      color: '#4a3aff',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>💰</span>
          <span style={styles.logoText}>SmartFinance</span>
        </div>
        
        <div style={styles.authButtons}>
        <button
          style={styles.loginButton}
          onClick={() => navigate('/login')}
        >
          Log In
        </button>
        <button
          style={styles.signupButton}
          onClick={() => navigate('/signup')}
        >
          Sign Up Free
        </button>
      </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.heroSection}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Your Personalized<br />
              <span style={styles.highlight}>AI-Powered</span><br />
              Money Companion
            </h1>
            <p style={styles.heroDescription}>
              Take control of your finances with an intelligent assistant that goes 
              beyond tracking. Smart Financial Assistant uses AI and machine learning to 
              understand your spending behavior, plan realistic budgets, help you set and 
              achieve savings goals.
            </p>
            <div style={styles.ctaButtons}>
              <button style={styles.primaryButton} onClick={() => window.location.href = 'https://budgetprofaq.streamlit.app/'}>
                Ask Anything
                <ChevronRight size={20} />
              </button>
              {/* <button style={styles.secondaryButton}>Watch Demo</button> */}
            </div>
          </div>
          
          {/* Feature Carousel */}
          <div style={styles.heroImage}>
            <div style={styles.carouselContainer}>
              <div style={styles.carouselHeader}>
                <div style={styles.carouselTitle}>Smart Financial Features</div>
                <div style={styles.carouselDots}>
                  {carouselItems.map((item, index) => (
                    <div 
                      key={index}
                      style={styles.carouselDot(activeSlide === index, item.color)}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </div>
              </div>
              
              <div style={styles.carouselContent}>
                <div style={styles.slideTransition}>
                  <div style={styles.carouselIconContainer(carouselItems[activeSlide].color)}>
                    {carouselItems[activeSlide].icon}
                  </div>
                  <h3 style={styles.carouselItemTitle}>{carouselItems[activeSlide].title}</h3>
                  <p style={styles.carouselItemDescription}>{carouselItems[activeSlide].description}</p>
                </div>
              </div>
              
              <div style={styles.carouselNavigation}>
                <button style={styles.carouselButton} onClick={goToPrevSlide}>
                  <ArrowLeft size={20} color="#555" />
                </button>
                <button style={styles.carouselButton} onClick={goToNextSlide}>
                  <ArrowRight size={20} color="#555" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        {/* <div style={styles.featureSection}>
          <h2 style={styles.sectionTitle}>Built for real people. Powered by real intelligence.</h2>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <PieChart color="#4a3aff" size={32} />
              </div>
              <h3 style={styles.featureTitle}>Budget Planner</h3>
              <p style={styles.featureSubtitle}>Plan smarter, not harder.</p>
              <p style={styles.featureDescription}>
                Automatically generate monthly budgets tailored to your income, spending habits, and savings goals using advanced ML algorithms.
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <Target color="#4a3aff" size={32} />
              </div>
              <h3 style={styles.featureTitle}>Goal Tracker</h3>
              <p style={styles.featureSubtitle}>Stay focused on what matters.</p>
              <p style={styles.featureDescription}>
                Set financial goals like buying a gadget, clearing debt, or building savings—and track your progress visually and intelligently over time.
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <MessageCircle color="#4a3aff" size={32} />
              </div>
              <h3 style={styles.featureTitle}>AI Chatbot</h3>
              <p style={styles.featureSubtitle}>Ask anything, anytime.</p>
              <p style={styles.featureDescription}>
                Get instant answers to queries like "Can I afford this?" or "How much did I spend on food last month?" with your personal finance assistant.
              </p>
            </div>
          </div> */}
        {/* </div> */}
      </main>

      {/* Footer with CTA */}
      {/* <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <h2 style={styles.footerTitle}>Ready to transform your financial future?</h2>
          <button style={styles.footerCta}>Start Your Free Trial</button>
        </div>
      </footer> */}
       {/* Footer */}
<footer style={{ backgroundColor: '#4a3aff', height: '2cm', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <div className="container">
    <p>&copy; 2025 FinBot. All rights reserved.</p>
  </div>
</footer>

    </div>
  );
};

export default LandingPage;