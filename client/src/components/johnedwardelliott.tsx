import { Routes, Route } from 'react-router-dom';
import Layout from './layout';
import AboutPage from './main/aboutPage';
import ProjectPage from './main/projectPage';
import UnderConstructionPage from './main/underConstructionPage';

/**
 * Represents the main component of the application.
 */
const JohnEdwardElliott = () => (
    <Routes>
      {/* Routes with Layout */}
      <Route element={<Layout />}>
        <Route path='/projects' element={<ProjectPage />} />
        <Route path='/skills' element={<UnderConstructionPage />} />
        <Route path='/experience' element={<UnderConstructionPage />} />
        <Route path='/' element={<AboutPage />} />
      </Route>
    </Routes>
  );

export default JohnEdwardElliott;
