import React from 'react';
import { Card, Typography, Divider, Row, Col, Timeline } from 'antd';
import type { TimelineItemProps } from 'antd/es/timeline/TimelineItem';
import './index.css';

const { Title, Paragraph } = Typography;

const AboutPage: React.FC = () => {
  // EDUCATION TIMELINE
  const educationTimeline: TimelineItemProps[] = [
    {
      label: 'Sep. 2021 – Dec. 2024',
      children: (
        <>
          <strong>Northeastern University, Boston, MA</strong>
          <br />
          B.Sc. in Computer Science, GPA: 3.3/4.0
        </>
      ),
    },
    {
      label: 'Sep. 2017 – Apr. 2021',
      children: (
        <>
          <strong>Milton Highschool, Milton, MA</strong>
          <br />
          Highschool Graduate, GPA 3.9/5.0
        </>
      ),
    },
  ];

  // EXPERIENCE TIMELINE
  const experienceTimeline: TimelineItemProps[] = [
    {
      label: 'May. 2025 – Current',
      children: (
        <>
          <strong>MEDITECH, Canton, MA</strong>
          <br />
          Software Developer
        </>
      ),
    },
    {
      label: 'Jul. 2023 – Dec. 2023',
      children: (
        <>
          <strong>MFS Investments, Boston, MA</strong>
          <br />
          Software Engineer Co-op
        </>
      ),
    },
    {
      label: 'Jan. 2023 – Apr. 2023',
      children: (
        <>
          <strong>Northeastern University, Boston, MA</strong>
          <br />
          CS3200 Database Design Teaching Assistant
        </>
      ),
    },
    {
      label: 'Jul. 2016 – Aug. 2022',
      children: (
        <>
          <strong>Town of Wellfleet, Wellfleet, MA</strong>
          <br />
          Tennis/Pickleball Director (Seasonal)
        </>
      ),
    },
  ];

  return (
    <div className='about-container'>
      {/* Cover Section */}
      <div className='cover-section'>
        <div className='cover-text'>
          <h5>Hello, I&apos;m</h5>
          <h1>John Elliott</h1>
          <h5>Software Engineer</h5>
        </div>
      </div>

      {/* About */}
      <Card className='about-card introduction-card' id='about-me'>
        <Title level={1} className='about-title'>
          About Me
        </Title>
        <Paragraph className='about-paragraph'>
          I’m a passionate software developer with a strong background in Full-Stack, QA Automation, web
          development, and object-oriented design. I enjoy working on innovative projects, exploring
          new technologies, and collaborating with cross-functional teams.
        </Paragraph>
        <Paragraph className='about-paragraph'>
          <strong>Available:</strong> January 2025
        </Paragraph>
      </Card>

      {/* Background */}
      <Card className='about-card background-card'>
        <Title level={3} className='about-subtitle'>
          Background & Activities
        </Title>
        <Paragraph className='about-paragraph'>
          After three and a half years, I have recently graduated with a B.Sc. in Computer Science at Northeastern University. During my
          studies, I have gained experience in software development through my 6-month co-op at MFS Investments, where I worked
          as a QA Automation Software Engineer. I have also worked as a Teaching Assistant for the CS3200 Database Design course at Northeastern.
        </Paragraph>
        <Paragraph className='about-paragraph'>
          In my free time, I enjoy playing golf, spikeball, tennis, and pickleball, and have worked as a Tennis/Pickleball Director 
          in Wellfleet, MA for six years.
        </Paragraph>
      </Card>

      {/* Education & Experience */}
      <Row gutter={0} className='edu-exp-row' id='education-experience' style={{ margin: 0, padding: 0, width: '100%' }}>
        <Col xs={24} lg={12} style={{ padding: 0, margin: 0 }}>
          <Card
            className='about-card education-card'
            style={{ width: '100%', height: '100%', margin: 0 }}>
            <Title level={3} className='about-subtitle'>
              Education
            </Title>
            <Timeline mode='right' items={educationTimeline} />
          </Card>
        </Col>
        <Col xs={24} lg={12} style={{ padding: 0, margin: 0 }}>
          <Card
            className='about-card experience-card'
            style={{ width: '100%', height: '100%', margin: 0 }}>
            <Title level={3} className='about-subtitle'>
              Professional Experience
            </Title>
            <Timeline mode='right' items={experienceTimeline} />
          </Card>
        </Col>
      </Row>

      {/* Skills */}
      <Card className='about-card skills-card' hoverable id='skills'>
        <Title level={3} className='about-subtitle'>
          Technical Knowledge
        </Title>
        <Divider className='about-divider' />
        <Row gutter={[16, 16]} className='skills-row'>
          <Col xs={24} sm={12} lg={8}>
            <Title level={5} className='skills-subtitle'>
              Languages & Frameworks
            </Title>
            <Paragraph className='about-paragraph'>
              TypeScript, Java, C/C++, JavaScript
              <br />
              React, Angular, Node.js, Flask
              <br />
              HTML, CSS
            </Paragraph>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Title level={5} className='skills-subtitle'>
              Testing / Tools
            </Title>
            <Paragraph className='about-paragraph'>
              Selenium, JUnit4, Jest
              <br />
              RESTful Services, APIs
              <br />
              Docker, Ngrok, AppSmith
            </Paragraph>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Title level={5} className='skills-subtitle'>
              Systems & Applications
            </Title>
            <Paragraph className='about-paragraph'>
              Windows, Linux, Ubuntu, Mac OS
              <br />
              Git, Jira, Jenkins, Confluence
              <br />
              IntelliJ IDEA, VS Code, DataGrip, Postman, WireShark
            </Paragraph>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AboutPage;
