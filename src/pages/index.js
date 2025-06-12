import Head from 'next/head';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Education from '../components/Education';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Volunteer from '../components/Volunteer';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Subhan Amjad - Portfolio</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>
      <Navbar />
      <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <section id="hero">
          <HeroSection />
        </section>
        <section id="education">
          <Education />
        </section>
        <section id="experience">
          <Experience />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <section id="skills">
          <Skills />
        </section>
        <section id="volunteer">
          <Volunteer />
        </section>
        <Footer />
      </main>
    </>
  );
}