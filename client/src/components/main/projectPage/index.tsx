import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { GithubOutlined, LinkOutlined } from '@ant-design/icons';
import './index.css';

const { Meta } = Card;

const PROJECTS = [
  {
    title: 'This Website',
    description: 'A brief description of Project One.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    githubUrl: 'https://github.com/jelliott2021/PersonalWebsite',
    liveUrl: 'http://localhost:3000/projects',
  },
  {
    title: 'Fake StackOverflow',
    description: 'A brief description of Project Two.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    githubUrl: 'https://github.com/jelliott2021/Fake-StackOverflow',
    liveUrl: 'https://projecttwo.com',
  },
  {
    title: 'Canvas Quiz',
    description: 'A brief description of Project Three.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    githubUrl: 'https://github.com/jelliott2021/Canvas-Quiz-React',
    liveUrl: 'https://projectthree.com',
  },
  {
    title: 'Photo Editor',
    description: 'A brief description of Project Four.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    githubUrl: 'https://github.com/jelliott2021/Photo-Editor',
    liveUrl: 'https://projectfour.com',
  },
];

const ProjectPage: React.FC = () => (
  <div className='project-container'>
    <Row gutter={[24, 24]}>
      {PROJECTS.map((project, index) => (
        <Col xs={24} sm={12} md={12} lg={12} xl={12} key={index}>
          <Card
            hoverable
            className='project-card'
            cover={
              <iframe
                width='100%'
                height='200px'
                src={project.videoUrl}
                title={project.title}
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            }
            actions={[
              <Button
                key={`github-${index}`}
                type='link'
                href={project.githubUrl}
                target='_blank'
                icon={<GithubOutlined />}>
                GitHub
              </Button>,
              <Button
                key={`live-${index}`}
                type='link'
                href={project.liveUrl}
                target='_blank'
                icon={<LinkOutlined />}>
                Visit Site
              </Button>,
            ]}>
            <Meta title={project.title} description={project.description} />
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

export default ProjectPage;
