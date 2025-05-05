import React, { useState } from 'react';
import './about.css';

import dev1 from '../../../assets/dev1.png';
import dev2 from '../../../assets/dev2.png';
import dev3 from '../../../assets/dev3.png';
import dev4 from '../../../assets/dev4.png';
import dev5 from '../../../assets/dev5.png';

const developers = [
  {
    name: 'Jimmy',
    img: dev1,
    bio: 'React specialist working all around the board to keep development running smoothly.',
  },
  {
    name: 'Jenna',
    img: dev2,
    bio: 'API wizard who loves enhancing productivity whenever she can.',
  },
  {
    name: 'Thomas',
    img: dev3,
    bio: 'Pipeline guru keeping the integration & development continuous and the UI popping.',
  },
  {
    name: 'Jordan',
    img: dev4,
    bio: 'Full-stack developer with a knack for database management.',
  },
  {
    name: 'Nick',
    img: dev5,
    bio: 'Nick tries his best when it comes to the user interface.',
  },
];

const About = () => {
  const [activeDev, setActiveDev] = useState(null);

  return (
    <div className="page-container about-page">
      <section className="page-section">
        <h1>About Our Project</h1>
        <p>
          Welcome to our CS 4300 Spring 2025 project! We’re a team of five passionate developers building a full-stack
          web application using React, Django, and modern deployment tools. We are all students at the University of Colorado Colorado Springs and want to make eating healthy a convenient and viable option for everyone!
        </p>
      </section>

      <h1>Meet the Team</h1>
      <div className="team-grid">
        {developers.map((dev, index) => (
          <div key={index} className="team-card" onClick={() => setActiveDev(dev)}>
            <img src={dev.img} alt={dev.name} />
            <h3>{dev.name}</h3>
            <p>{dev.bio}</p>
          </div>
        ))}
      </div>

      {activeDev && (
        <div className="dev-modal" onClick={() => setActiveDev(null)}>
          <div className="dev-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setActiveDev(null)}>×</button>
            <img src={activeDev.img} alt={activeDev.name} />
            <h2>{activeDev.name}</h2>
            <p>{activeDev.bio}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
