/*Projects.js*/

import { motion } from 'framer-motion';
import { useState } from 'react';
import styles from '../styles/Projects.module.css';

const projectsData = [
  {
    title: "EduCanvas",
    description: "Interactive canvas for managing student and faculty activities with real-time updates and notifications.",
    tech: ["OOP", "Real-time Updates", "User Management"],
    gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    link: "#"
  },
  {
    title: "Byte Saver",
    description: "Revolutionary data compression using Huffman Coding to improve storage efficiency without losing information.",
    tech: ["Huffman Coding", "Data Compression", "Efficiency"],
    gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    link: "#"
  },
  {
    title: "MetaConstruct",
    description: "Virtual building selection and real construction using Metaverse/AR for immersive design visualization.",
    tech: ["Metaverse", "AR", "3D Visualization"],
    gradient: "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
    link: "#"
  },
  {
    title: "CORBA",
    description: "Implementation of device interoperability using CORBA architecture for cross-platform communication.",
    tech: ["CORBA", "Interoperability", "Cross-platform"],
    gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    link: "#"
  },
  {
    title: "SecureRSA",
    description: "Application implementing RSA algorithm for encryption and decryption, enhancing data security during transmission.",
    tech: ["RSA", "Encryption", "Data Security"],
    gradient: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
    link: "#"
  },
  {
    title: "NetMap",
    description: "Network design and implementation using multiple routers and switches for seamless connectivity and robust security.",
    tech: ["Network Design", "Packet Tracer", "Security Protocols"],
    gradient: "linear-gradient(135deg, #c3cfe2 0%, #c4e0e5 100%)",
    link: "#"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleProjectClick = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.section
      id="projects"
      className={styles.projects}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Projects
      </motion.h2>
      <motion.div
        className={styles.projectsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projectsData.map((project, index) => (
          <motion.div
            key={project.title}
            className={styles.projectItem}
            style={{ background: project.gradient }}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              transition: { duration: 0.3 }
            }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            onClick={() => handleProjectClick(project.link)}
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <motion.div
              className={styles.techStack}
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {project.tech.map((tech) => (
                <motion.span
                  key={tech}
                  className={styles.techItem}
                  initial={{ scale: 0 }}
                  animate={{ scale: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
