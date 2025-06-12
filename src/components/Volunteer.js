import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaRunning, FaHandsHelping, FaQuoteLeft } from 'react-icons/fa';
import styles from '../styles/Volunteer.module.css';

const Volunteer = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  const experiences = [
    {
      shortName: "PAIS",
      organization: "PIEAS Artificial Intelligence Society",
      duration: "Jun. 2024 – Present",
      location: "PIEAS University Islamabad, Pakistan",
      role: "Vice President",
      description: "Enhancing organizational initiatives and member engagement. Leading AI workshops and organizing tech talks.",
      achievements: ["Increased member participation by 40%", "Organized 5 successful AI hackathons"],
      skills: ["Leadership", "AI/ML", "Event Management"],
      gradient: "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)",
      icon: FaGraduationCap
    },
    {
      shortName: "PSS",
      organization: "PIEAS Sportics Society",
      duration: "Aug. 2023 – Jun. 2024",
      location: "PIEAS University Islamabad, Pakistan",
      role: "Management Lead",
      description: "Led my team in managing events for the society. Coordinated inter-university sports competitions.",
      achievements: ["Successfully organized 10+ sports events", "Increased society membership by 25%"],
      skills: ["Team Management", "Event Planning", "Sports Administration"],
      gradient: "linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)",
      icon: FaRunning
    },
    {
      shortName: "PVS",
      organization: "PIEAS Volunteer Society",
      duration: "Nov. 2023 – Feb. 2024",
      location: "PIEAS University Islamabad, Pakistan",
      role: "Senior Member",
      description: "Worked as a senior member under the supervision of LEAD. Participated in community outreach programs.",
      achievements: ["Contributed 100+ volunteer hours", "Led a team of 20 volunteers for a city-wide cleanup drive"],
      skills: ["Community Service", "Team Collaboration", "Project Coordination"],
      gradient: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
      icon: FaHandsHelping
    }
  ];

  const stats = [
    { label: "Total Volunteer Hours", value: "250+" },
    { label: "Events Organized", value: "20+" },
    { label: "Lives Impacted", value: "1000+" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 80;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize canvas immediately
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      }
    }

    // Create particles immediately
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation immediately
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <motion.section 
      className={styles.volunteerSection}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      <canvas 
        ref={canvasRef} 
        className={styles.particlesContainer}
        style={{ opacity: 1 }}
      />
      
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        VOLUNTEER EXPERIENCE
      </motion.h2>
      
      <motion.p
        className={styles.intro}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <FaQuoteLeft className={styles.quoteIcon} />
        My journey in volunteering has been a transformative experience, allowing me to contribute to various causes while developing invaluable skills and connections.
      </motion.p>
      
      <motion.div 
        className={styles.experienceGrid}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {experiences.map((exp, index) => (
          <ExperienceCard 
            key={exp.shortName} 
            experience={exp} 
            index={index}
            isSelected={selectedCard === index}
            onClick={() => setSelectedCard(selectedCard === index ? null : index)}
          />
        ))}
      </motion.div>
      
      <StatisticsSection stats={stats} />
      
      <AnimatePresence>
        {selectedCard !== null && (
          <ExpandedCard 
            experience={experiences[selectedCard]} 
            onClose={() => setSelectedCard(null)}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
};

const ExperienceCard = ({ experience, index, isSelected, onClick }) => (
  <motion.div 
    className={`${styles.experienceCard} ${isSelected ? styles.selected : ''}`}
    style={{ background: experience.gradient }}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ 
      scale: 1.05, 
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.3 }
    }}
    onClick={onClick}
    layout
  >
    <motion.div className={styles.cardContent} layout>
      <experience.icon className={styles.icon} />
      <motion.h3 layout>{experience.shortName}</motion.h3>
      <motion.h4 layout>{experience.organization}</motion.h4>
      <motion.div className={styles.divider} layout />
      <motion.p className={styles.role} layout>{experience.role}</motion.p>
      {!isSelected && (
        <motion.p className={styles.clickPrompt} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Click to expand
        </motion.p>
      )}
    </motion.div>
  </motion.div>
);

const ExpandedCard = ({ experience, onClose }) => (
  <motion.div 
    className={styles.expandedCard}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3 }}
  >
    <motion.button className={styles.closeButton} onClick={onClose}>×</motion.button>
    <h2>{experience.organization}</h2>
    <h3>{experience.role}</h3>
    <p>{experience.duration} | {experience.location}</p>
    <p>{experience.description}</p>
    <h4>Key Achievements:</h4>
    <ul>
      {experience.achievements.map((achievement, index) => (
        <motion.li 
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {achievement}
        </motion.li>
      ))}
    </ul>
    <h4>Skills Developed:</h4>
    <div className={styles.skillTags}>
      {experience.skills.map((skill, index) => (
        <motion.span 
          key={index} 
          className={styles.skillTag}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {skill}
        </motion.span>
      ))}
    </div>
  </motion.div>
);

const StatisticsSection = ({ stats }) => (
  <motion.div 
    className={styles.statisticsSection}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.5 }}
  >
    {stats.map((stat, index) => (
      <motion.div 
        key={index} 
        className={styles.statItem}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
      >
        <h3>{stat.value}</h3>
        <p>{stat.label}</p>
      </motion.div>
    ))}
  </motion.div>
);

export default Volunteer;