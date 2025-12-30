import React from 'react';
import Masonry from 'react-masonry-css';
import { Card, Button, Tag } from 'antd';
import { GithubOutlined, LinkOutlined } from '@ant-design/icons';
import './index.css';

const { Meta } = Card;

const PROJECTS = [
  {
    title: 'John Edward Elliott Portfolio Website',
    description: 'This current website',
    videoUrl: '',
    githubUrl: 'https://github.com/jelliott2021/PersonalWebsite',
    liveUrl: 'https://johnedwardelliott.com',
    tags: ['Typescript', 'React', 'Node.js', 'HTML',  'CSS', 'MongoDB', 'Azure'],
  },
  {
    title: 'Multiplayer Party Game Website',
    description: 'Lobby based multiplayer party game website where users can create or join game rooms to play various mini-games with friends in real-time. Built with React, TypeScript, Node.js, Express, and Socket.io for seamless real-time communication. Features include user authentication, dynamic game room management, and interactive gameplay mechanics.',
    videoUrl: '/videos/BoozeBrawlDemo.mp4',
    liveUrl: 'https://boozebrawl.com',
    tags: ['Typescript', 'React', 'Node.js', 'HTML',  'CSS', 'Azure'],
    extra: `Code can be shown upon request`
  },
  {
    title: 'Docker Wake Up',
    description: 'Open-source reverse proxy that automatically starts Docker containers on-demand when they receive HTTP requests. Provides seamless, zero-downtime proxying with startup loading pages while services boot, intelligent idle management to stop unused containers after a configurable timeout to save CPU and memory, and automatic generation of SSL-enabled NGINX reverse proxy configurations. Services are defined in a single JSON file and the project includes a one-command installer for automated setup.',
    videoUrl: '',
    githubUrl: 'https://github.com/jelliott2021/DockerWakeUp',
    tags: ['Open Source', 'Typescript', 'Node.js', 'Docker', 'NGINX', 'HTML',  'CSS'],
  },
  {
    title: 'Husky Connection',
    description: 'Husky Connection is a web platform built to connect Northeastern students by enabling personalized profiles, real-time chat, and notification services for questions, comments, and updates. Developed using React, TypeScript, Node.js, Express, and MongoDB, the project employs a modular, service-oriented design to ensure scalability and maintainability, with features like customizable user accounts, group chats, and email/on-site notifications implemented as independent modules.',
    videoUrl: '/videos/HuskyConnect.mp4',
    githubUrl: 'https://github.com/jelliott2021/Fake-StackOverflow',
    liveUrl: 'https://cs4530-f24-110.onrender.com',
    extra: `Hosted on OnRender might take a few seconds to load
Test Account
User: jelliott 
Password: 1234`,
    tags: ['Typescript', 'React', 'Node.js', 'Jest', 'HTML',  'CSS', 'MongoDB'],
  },
  {
    title: 'Canvas Quiz',
    description: 'A full-stack web application replicating the core functionality of Canvas, featuring role-based authentication for students, faculty, and administrators. Administrators can manage courses, modules, assignments, and quizzes, while faculty can create and configure quizzes with various settings for students to complete. Independently developed the quiz functionality, ensuring customizable quiz settings and seamless student interaction.',
    videoUrl: '/videos/CanvasQuiz.mp4',
    githubUrl: 'https://github.com/jelliott2021/Canvas-Quiz-React',
    liveUrl: 'https://fake-canvas-react.onrender.com/#/Kanbas/Account/Signin',
    extra: `Hosted on OnRender might take a few seconds to load
Test Account
User: Jack
Password: 1234`,
    tags: ['Typescript', 'React', 'Node.js', 'HTML',  'CSS', 'MongoDB'],
  },
  {
    title: 'Photo Editor',
    description: 'The Photo Editor is a Java-based GUI application following the MVC design pattern, allowing users to open, edit, and save images in PNG, JPG, JPEG, BMP, and PPM formats. Users can adjust brightness, apply various greyscale filters (red, green, blue, luma, intensity, value), enhance images with blur, sharpen, greyscale, and sepia effects, flip images horizontally or vertically, and create a mosaic effect with a specified number of panels. Once edits are complete, the modified image can be saved in a supported format.',
    videoUrl: '/videos/PhotoEditor.mp4',
    githubUrl: 'https://github.com/jelliott2021/PhotoEditor',
    liveUrl: '',
    tags: ['Java', 'JFrame', 'JUnit'],
  },
];

const ProjectPage: React.FC = () => (
  <div className='project-container'>
    <Masonry breakpointCols={{default: 2, 768: 1}}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {PROJECTS.map((project, index) => (
        <div key={index}>
          <Card
            hoverable
            className='project-card'
            cover={
              project.videoUrl ? (
                <video controls>
                  <source src={project.videoUrl} type='video/mp4' />
                  Your browser does not support the video tag.
                </video>
                ) : null
              }
              actions={[
                project.githubUrl && (
                <Button
                  key={`github-${index}`}
                  type='link'
                  href={project.githubUrl}
                  target='_blank'
                  icon={<GithubOutlined />}
                >
                  GitHub
                </Button>
                ),
                project.liveUrl && (
                <Button
                  key={`live-${index}`}
                  type='link'
                  href={project.liveUrl}
                  target='_blank'
                  icon={<LinkOutlined />}
                >
                  Visit Site
                </Button>
                ),
              ].filter(Boolean)}
              >
              <Meta
                title={project.title}
                description={
                <>
                  <p>{project.description}</p>
                  <br />
                  {project.tags.map((tag, tagIndex) => (
                    <Tag key={tagIndex}>{tag}</Tag>
                  ))}
                  {project.extra && (
                    <div>
                      <br /><pre>{project.extra}</pre>
                    </div>
                  )}
                </>
              }
            />
          </Card>
        </div>
      ))}
    </Masonry>
  </div>
);

export default ProjectPage;
