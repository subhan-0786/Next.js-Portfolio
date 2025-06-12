import { motion } from 'framer-motion';
import { useState } from 'react';
import styles from '../styles/Contact.module.css';

export default function Contact() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log(formState);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
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

    return (
        <motion.section
            id="contact"
            className={styles.contact}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.h2 variants={itemVariants}>Get in Touch</motion.h2>
            <motion.form className={styles.contactForm} onSubmit={handleSubmit} variants={containerVariants}>
                <motion.div className={styles.inputGroup} variants={itemVariants}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                    />
                </motion.div>
                <motion.div className={styles.inputGroup} variants={itemVariants}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                    />
                </motion.div>
                <motion.div className={styles.inputGroup} variants={itemVariants}>
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formState.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </motion.div>
                <motion.button
                    type="submit"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Send Message
                </motion.button>
            </motion.form>
        </motion.section>
    );
}