// Footer.js
import { motion } from 'framer-motion';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/subhan', icon: 'fab fa-github' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/subhan', icon: 'fab fa-linkedin' },
    { name: 'Email', url: 'mailto:subhanamjad507@gmail.com', icon: 'fas fa-envelope' },
    { name: 'WhatsApp', url: 'https://wa.me/1234567890', icon: 'fab fa-whatsapp' }, // Replace with your actual WhatsApp number
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <motion.div 
          className={styles.footerSocial}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h4>Connect</h4>
          <div className={styles.socialIcons}>
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className={link.name === 'WhatsApp' ? styles.whatsappButton : ''}
              >
                <i className={link.icon}></i>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
      <div className={styles.footerBottom}>
        <p>© {currentYear} All rights reserved.</p>
      </div>
    </footer>
  );
}
