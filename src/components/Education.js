//Education.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt, FaStar } from 'react-icons/fa';
import styles from '../styles/Education.module.css';

export default function Education() {
    const [currentImageBachelor, setCurrentImageBachelor] = useState(0);
    const [currentImageFSc, setCurrentImageFSc] = useState(0);

    const bachelorImages = [
        { src: "/00.webp", title: "INAM UR REHMAN AUDITORIUM" },
        { src: "/04.jpg", title: "CENTRAL LIBRARY" },
        { src: "/01.jpg", title: "MULTI PURPOSE HALL" },
        { src: "/02.webp", title: "BASKETBALL COURT" },
        { src: "/03.jpg", title: "DTD BUILDING" }
    ];

    const fscImages = [
        { src: "/21.webp", title: "ARMACOUST BUILDING" },
        { src: "/22.webp", title: "MAIN AUDITORIUM" },
        { src: "/13.jpg", title: "MERCY HEALTH CENTER" },
        { src: "/23.jpg", title: "COUNSELLING WORKSHOPS" },
        { src: "/15.jpg", title: "FSC Building 7" },
    ];

    useEffect(() => {
        const intervalBachelor = setInterval(() => {
            setCurrentImageBachelor((prev) => (prev + 1) % bachelorImages.length);
        }, 5000);

        const intervalFSc = setInterval(() => {
            setCurrentImageFSc((prev) => (prev + 1) % fscImages.length);
        }, 5000);

        return () => {
            clearInterval(intervalBachelor);
            clearInterval(intervalFSc);
        };
    }, []);

    const ImageCarousel = ({ images, currentImage }) => (
        <motion.div 
            className={styles.imageCarousel}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <AnimatePresence mode='wait'>
                <motion.img
                    key={currentImage}
                    src={images[currentImage].src}
                    alt={images[currentImage].title}
                    className={styles.carouselImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                />
            </AnimatePresence>
            <motion.div 
                className={styles.imageOverlay}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h3>{images[currentImage].title}</h3>
            </motion.div>
        </motion.div>
    );

    return (
        <section className={styles.educationSection}>
            <motion.h2
                className={styles.title}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                Education
            </motion.h2>
            <div className={styles.content}>
                <motion.div
                    className={styles.educationRow}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div 
                        className={styles.educationCard}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <h3 className={styles.degree}>Bachelor of Computer Science</h3>
                        <h4 className={styles.university}>Pakistan Institute of Engineering and Applied Sciences</h4>
                        <div className={styles.infoContainer}>
                            <div className={styles.infoItem}>
                                <FaCalendarAlt className={styles.icon} />
                                <p>Sep. 2022 – Present</p>
                            </div>
                            <div className={styles.infoItem}>
                                <FaStar className={styles.icon} />
                                <p>Grade: 3.70 / 4.00</p>
                            </div>
                        </div>
                    </motion.div>
                    <ImageCarousel images={bachelorImages} currentImage={currentImageBachelor} />
                </motion.div>
                <motion.div
                    className={styles.educationRow}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <ImageCarousel images={fscImages} currentImage={currentImageFSc} />
                    <motion.div 
                        className={styles.educationCard}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <h3 className={styles.degree}>FSc Pre-Engineering</h3>
                        <h4 className={styles.university}>Forman Christian College</h4>
                        <div className={styles.infoContainer}>
                            <div className={styles.infoItem}>
                                <FaCalendarAlt className={styles.icon} />
                                <p>2020 – 2022</p>
                            </div>
                            <div className={styles.infoItem}>
                                <FaStar className={styles.icon} />
                                <p>Merit-based Scholarship Holder</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}