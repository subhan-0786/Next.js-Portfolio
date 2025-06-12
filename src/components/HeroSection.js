import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';
import styles from '../styles/HeroSection.module.css';
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaGithub, FaDownload } from 'react-icons/fa';

// 3D Particles Component
const Particles = ({
  particleCount = 0,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  className,
}) => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const defaultColors = ["#ffffff", "#ffffff", "#ffffff"];

  const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const int = parseInt(hex, 16);
    const r = ((int >> 16) & 255) / 255;
    const g = ((int >> 8) & 255) / 255;
    const b = (int & 255) / 255;
    return [r, g, b];
  };

  const vertex = /* glsl */ `
    attribute vec3 position;
    attribute vec4 random;
    attribute vec3 color;
    
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;
    uniform float uSpread;
    uniform float uBaseSize;
    uniform float uSizeRandomness;
    
    varying vec4 vRandom;
    varying vec3 vColor;
    
    void main() {
      vRandom = random;
      vColor = color;
      
      vec3 pos = position * uSpread;
      pos.z *= 10.0;
      
      vec4 mPos = modelMatrix * vec4(pos, 1.0);
      float t = uTime;
      mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
      mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
      mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
      
      vec4 mvPos = viewMatrix * mPos;
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
      gl_Position = projectionMatrix * mvPos;
    }
  `;

  const fragment = /* glsl */ `
    precision highp float;
    
    uniform float uTime;
    uniform float uAlphaParticles;
    varying vec4 vRandom;
    varying vec3 vColor;
    
    void main() {
      vec2 uv = gl_PointCoord.xy;
      float d = length(uv - vec2(0.5));
      
      if(uAlphaParticles < 0.5) {
        if(d > 0.5) {
          discard;
        }
        gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
      } else {
        float circle = smoothstep(0.5, 0.4, d) * 0.8;
        gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
      }
    }
  `;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ depth: false, alpha: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener("resize", resize, false);
    resize();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };

    if (moveParticlesOnHover) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    for (let i = 0; i < count; i++) {
      let x, y, z, len;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
      },
      transparent: true,
      depthTest: false,
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId;
    let lastTime = performance.now();
    let elapsed = 0;

    const update = (t) => {
      animationFrameId = requestAnimationFrame(update);
      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed;

      program.uniforms.uTime.value = elapsed * 0.001;

      if (moveParticlesOnHover) {
        particles.position.x = -mouseRef.current.x * particleHoverFactor;
        particles.position.y = -mouseRef.current.y * particleHoverFactor;
      } else {
        particles.position.x = 0;
        particles.position.y = 0;
      }

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * speed;
      }

      renderer.render({ scene: particles, camera });
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      if (moveParticlesOnHover) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  }, [
    particleCount,
    particleSpread,
    speed,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
  ]);

  return (
    <div
      ref={containerRef}
      className={`${styles.particlesContainer} ${className}`}
    />
  );
};

export default function HeroSection() {
    // Typewriter effect state
    const titles = ['WEB Developer', 'AI/ML Learner', 'Flutter Developer', 'Problem Solver'];
    const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
    const [typedText, setTypedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    // Social media icons data
    const socialIcons = [
        { 
            icon: FaInstagram, 
            href: "https://instagram.com/subhan._0786", 
            color: "from-pink-500 to-purple-500",
            ariaLabel: "Instagram"
        },
        { 
            icon: FaFacebookF, 
            href: "https://facebook.com/samjad.786", 
            color: "from-blue-600 to-blue-700",
            ariaLabel: "Facebook"
        },
        { 
            icon: FaLinkedinIn, 
            href: "https://linkedin.com/in/subhan-amjad-758927272", 
            color: "from-blue-500 to-blue-600",
            ariaLabel: "LinkedIn"
        },
        { 
            icon: FaGithub, 
            href: "https://github.com/subhan-0786", 
            color: "from-gray-700 to-gray-800",
            ariaLabel: "GitHub"
        }
    ];

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/SubhanResume.pdf';
        link.download = 'SubhanResume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        const currentTitle = titles[currentTitleIndex];
        let charIndex = 0;
        
        const typeText = () => {
            if (charIndex < currentTitle.length) {
                setTypedText(currentTitle.substring(0, charIndex + 1));
                charIndex++;
                setTimeout(typeText, 100);
            } else {
                setTimeout(() => {
                    eraseText();
                }, 2000);
            }
        };

        const eraseText = () => {
            if (charIndex > 0) {
                setTypedText(currentTitle.substring(0, charIndex - 1));
                charIndex--;
                setTimeout(eraseText, 50);
            } else {
                setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
            }
        };

        typeText();
    }, [currentTitleIndex]);

    // Cursor blink effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <section className={styles.hero}>
            {/* 3D Particles Background */}
            <Particles
                particleColors={['#ffffff', '#ffffff']}
                particleCount={500}
                particleSpread={12}
                speed={0.3}
                particleBaseSize={100}
                moveParticlesOnHover={true}
                alphaParticles={false}
                disableRotation={false}
            />
            
            <div className={styles.container}>
                <div className={styles.content}>
                    <motion.div 
                        className={styles.textSection}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.div 
                            className={styles.greeting}
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <span className={styles.wave}>👋</span>
                            <span>Hello, I'm</span>
                        </motion.div>
                        
                        <motion.h1
                            className={styles.name}
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            Subhan
                        </motion.h1>
                        
                        {/* Typewriter Title */}
                        <motion.div
                            className={styles.typewriterContainer}
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <h2 className={styles.typewriterTitle}>
                                {typedText}
                                <span className={`${styles.cursor} ${showCursor ? styles.cursorVisible : styles.cursorHidden}`} />
                            </h2>
                        </motion.div>
                        
                        <motion.p
                            className={styles.description}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                        >
                            Passionate about creating engaging user interfaces and bringing digital products to life. 
                            I specialize in modern web technologies and love turning creative ideas into interactive experiences.
                        </motion.p>
                        
                        <motion.div
                            className={styles.ctaSection}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            <button className={styles.downloadButton} onClick={handleDownload}>
                                <FaDownload className={styles.buttonIcon} />
                                Download Resume
                            </button>
                            
                            <div className={styles.socialContainer}>
                                <span className={styles.socialLabel}>Connect with me</span>
                                <div className={styles.socialIcons}>
                                    {socialIcons.map(({ icon: Icon, href, color, ariaLabel }, index) => (
                                        <a
                                            key={index}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={ariaLabel}
                                            className={`${styles.socialIcon} ${styles[color.replace('from-', '').replace(' to-', '-')]}`}
                                            style={{
                                                animationDelay: `${index * 0.1}s`
                                            }}
                                        >
                                            <Icon />
                                            <div className={styles.socialIconGlow} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                    
                    <motion.div 
                        className={styles.imageSection}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <div className={styles.imageContainer}>
                            <motion.div className={styles.imageFrame}>
                                <motion.img
                                    src="/SubhanCopy.png"
                                    alt="Subhan Amjad"
                                    className={styles.profileImage}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}