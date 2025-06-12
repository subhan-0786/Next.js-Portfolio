import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendar, FaMapMarkerAlt, FaBriefcase, FaCode } from 'react-icons/fa';
import styles from '../styles/Experience.module.css';

export default function Experience() {
    const experiences = [
        {
            company: "Mindstorm Studios",
            position: "Game Developer Intern",
            location: "Lahore, Pakistan",
            duration: "Jun. 2023 – Aug. 2023",
            achievements: [
                "Developed a fully functional 2D game using Unity",
                "Led a team of 4 developers to complete the project",
                "Implemented complex game mechanics & optimized performance"
            ],
            testimonial: "An exceptional intern who quickly grasped game development concepts, mastered Unity tools showed great leadership potential in creating a 2D game project.",
            demoVideo: "/Mindstorm.mp4"
        },
        {
            company: "ACM UET Lahore",
            position: "Flutter Developer Intern",
            location: "Lahore, Pakistan",
            duration: "Jul. 2023 – Sep. 2023",
            achievements: [
                "Developed a cross-platform mobile app using Flutter",
                "Integrated real-time COVID-19 data from multiple APIs",
                "Implemented an intuitive and responsive UI design"
            ],
            testimonial: "The cross-platform FLUTTER app to track worldwide COVID-19 patient data developed by this team member was instrumental in providing timely information to our community.",
            demoVideo: "/ACM.mp4"
        }
    ];

    return (
        <section className={styles.experience} id="experience">
            <h2 className={styles.sectionTitle}>Professional Experience</h2>
            <div className={styles.experienceContainer}>
                {experiences.map((exp, index) => (
                    <motion.div
                        key={index}
                        className={styles.experienceCard}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <div className={styles.cardHeader}>
                            <h3>{exp.company}</h3>
                            <span className={styles.position}>
                                <FaBriefcase /> {exp.position}
                            </span>
                        </div>

                        <motion.img
                            src={`/thumbnails/${exp.company.toLowerCase()}.png`}
                            alt={`${exp.company} thumbnail`}
                            className={styles.thumbnail}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        />

                        <div className={styles.cardBody}>
                            <p className={styles.duration}>
                                <FaCalendar /> {exp.duration}
                            </p>
                            <p className={styles.location}>
                                <FaMapMarkerAlt /> {exp.location}
                            </p>

                            <ul className={styles.achievements}>
                                {exp.achievements.slice(0, 2).map((achievement, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        {achievement}
                                    </motion.li>
                                ))}
                            </ul>

                            <motion.div
                                className={styles.testimonial}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <p>"{exp.testimonial.slice(0, 50)}..."</p>
                            </motion.div>

                            {/* ✅ Add demo video */}
                            <video
                                src={exp.demoVideo}
                                controls
                                className={styles.demoVideo}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
