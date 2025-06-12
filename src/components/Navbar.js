import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHome, setIsHome] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatState, setChatState] = useState('form'); // 'form' or 'success'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle chat widget
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  // Handle scroll to section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false); // Close mobile menu after clicking
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  const { name, email, message } = formData;

  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    // Add to Firestore
    await addDoc(collection(db, 'contacts'), {
      name,
      email,
      message,
      timestamp: Timestamp.now(),
    });

    // Optional: Also trigger email/WhatsApp logic here
    // Or just show success state
    setChatState('success');
    setTimeout(() => {
      setChatState('form');
      setFormData({ name: '', email: '', message: '' });
      setIsChatOpen(false);
    }, 3000);
  } catch (error) {
    console.error('Firebase submission failed:', error);
    alert('Error sending message. Please try again.');
  }
};


  // Detect scroll to apply transparent background on home section
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsHome(scrollTop < 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`${styles.nav} ${isHome ? styles.homeNav : ''}`}>
        <div className={styles.navContent}>
          <button className={styles.menuButton} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul className={`${styles.navList} ${isMenuOpen ? styles.navListOpen : ''}`}>
            <li>
              <a onClick={() => scrollToSection('hero')} href="#hero">
                Home
              </a>
            </li>
            <li>
              <a onClick={() => scrollToSection('education')} href="#education">
                Education
              </a>
            </li>
            <li>
              <a onClick={() => scrollToSection('experience')} href="#experience">
                Experience
              </a>
            </li>
            <li>
              <a onClick={() => scrollToSection('projects')} href="#projects">
                Projects
              </a>
            </li>
            <li>
              <a onClick={() => scrollToSection('skills')} href="#skills">
                Skills
              </a>
            </li>
            <li>
              <a onClick={() => scrollToSection('volunteer')} href="#volunteer">
                Volunteer
              </a>
            </li>
            <li>
              <button className={styles.chatButton} onClick={toggleChat}>
                <i className="fas fa-comments"></i>
                Let's Chat
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Chat Widget */}
      <div className={`${styles.chatWidget} ${isChatOpen ? styles.chatWidgetOpen : ''}`}>
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderInfo}>
            <div className={styles.chatAvatar}>
              <i className="fas fa-user"></i>
            </div>
            <div>
              <h3>Subhan Amjad</h3>
              <span className={styles.onlineStatus}>
                <i className="fas fa-circle"></i> Online
              </span>
            </div>
          </div>
          <button className={styles.chatClose} onClick={toggleChat}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className={styles.chatBody}>
          {chatState === 'form' ? (
            <>
              <div className={styles.chatMessage}>
                <div className={styles.messageBot}>
                  <p>Hi there! 👋 I'd love to hear from you. Please share your details and I'll get back to you soon!</p>
                </div>
              </div>
              
              <div className={styles.chatForm}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <textarea
                    name="message"
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="3"
                  ></textarea>
                </div>
                <button type="submit" className={styles.sendButton} onClick={handleSubmit}>
                  <i className="fas fa-paper-plane"></i>
                  Send Message
                </button>
              </div>
            </>
          ) : (
            <div className={styles.chatMessage}>
              <div className={styles.messageBot}>
                <p>✅ Thank you! Your message has been sent successfully. I'll get back to you soon!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat overlay */}
      {isChatOpen && <div className={styles.chatOverlay} onClick={toggleChat}></div>}
    </>
  );
};

export default Navbar;