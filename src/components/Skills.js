//Skills.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styles from '../styles/Skills.module.css';

const Skills = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(document.querySelector(`.${styles.skills}`));

    return () => observer.disconnect();
  }, []);

  const skills = [
    { name: 'Python', level: 90, icon: '🐍', color: '#3776AB' },
    { name: 'C/C++', level: 85, icon: '⚙️', color: '#00599C' },
    { name: 'JavaScript', level: 80, icon: '🌐', color: '#F7DF1E' },
    { name: 'HTML/CSS', level: 95, icon: '🎨', color: '#E34F26' },
    { name: 'Dart', level: 75, icon: '🎯', color: '#0175C2' },
    { name: 'Next.js', level: 70, icon: '⚛️', color: '#000000' },
    { name: 'GitHub', level: 88, icon: '🐙', color: '#181717' },
    { name: 'Packet Tracer', level: 78, icon: '🖧', color: '#1BA0D7' },
  ];

  const skillDescriptions = {
    Python: "Proficient in Python for data analysis, machine learning, and web development. Experienced with libraries like NumPy, Pandas, and TensorFlow.",
    'C/C++': "Strong foundation in C/C++ for system-level programming and algorithm implementation. Familiar with object-oriented design principles.",
    JavaScript: "Skilled in modern JavaScript (ES6+) for both front-end and back-end development. Experienced with popular frameworks and libraries.",
    'HTML/CSS': "Expert in creating responsive and accessible web layouts. Proficient with CSS preprocessors and modern layout techniques like Flexbox and Grid.",
    Dart: "Competent in Dart programming language, primarily used for developing cross-platform mobile applications with Flutter.",
    'Next.js': "Experienced in building server-side rendered React applications with Next.js, focusing on performance and SEO optimization.",
    GitHub: "Well-versed in Git version control and collaborative development using GitHub. Familiar with branching strategies and CI/CD workflows.",
    'Packet Tracer': "Skilled in network simulation and troubleshooting using Cisco Packet Tracer. Experienced in designing and configuring complex network topologies.",
  };

  return (
    <section className={styles.skills}>
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        TECHNICAL SKILLS
      </motion.h2>
      <div className={styles.skillsContainer}>
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            className={styles.skillItem}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            onClick={() => setSelectedSkill(skill)}
          >
            <div className={styles.skillIcon} style={{ color: skill.color }}>{skill.icon}</div>
            <h3 className={styles.skillName}>{skill.name}</h3>
            <div className={styles.skillProgress}>
              <CircularProgressbar
                value={skill.level}
                text={`${skill.level}%`}
                styles={buildStyles({
                  textSize: '24px',
                  pathColor: skill.color,
                  textColor: '#ffffff',
                  trailColor: 'rgba(255,255,255,0.2)',
                })}
              />
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            className={styles.skillDetails}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <h3>{selectedSkill.name}</h3>
            <p>{skillDescriptions[selectedSkill.name]}</p>
            <button onClick={() => setSelectedSkill(null)}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={styles.techStack}>
       
        <div className={styles.techIcons}>
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              className={styles.techIcon}
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              {skill.icon}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;