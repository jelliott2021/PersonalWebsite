import React from 'react';
import Navbar from './components/navbar';
import Hero from './components/hero';
import About from './components/about';
import Experience from './components/experience';
import Projects from './components/projects';
import Skills from './components/skills';
import Education from './components/education';
import Contact from './components/contact';
import Footer from './components/footer';
import useTheme from './hooks/useTheme';
import useActiveSection from './hooks/useActiveSection';
import useLegacyRoutes from './hooks/useLegacyRoutes';

/** Section ids in page order. Stable reference so hooks don't re-subscribe. */
const SECTION_IDS = ['home', 'about', 'experience', 'projects', 'skills', 'education', 'contact'];

const App = () => {
  const { theme, toggle } = useTheme();
  const activeId = useActiveSection(SECTION_IDS);
  useLegacyRoutes();

  return (
    <>
      <a className='skip-link' href='#about'>
        Skip to content
      </a>
      <Navbar activeId={activeId} theme={theme} onToggleTheme={toggle} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default App;
