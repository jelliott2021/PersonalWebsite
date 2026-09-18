import Navbar from './components/navbar';
import Hero from './components/hero';
import About from './components/about';
import Experience from './components/experience';
import Projects from './components/projects';
import Skills from './components/skills';
import Education from './components/education';
import Contact from './components/contact';
import Footer from './components/footer';
import { SECTION_IDS } from './data/navigation';
import useTheme from './hooks/useTheme';
import useActiveSection from './hooks/useActiveSection';
import useLegacyRoutes from './hooks/useLegacyRoutes';

/** The whole single-page site, sections in reading order. */
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
