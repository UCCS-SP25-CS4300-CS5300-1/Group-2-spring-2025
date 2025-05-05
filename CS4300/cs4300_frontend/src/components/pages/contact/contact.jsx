import React from 'react';
import './contact.css';

const Contact = () => {
  return (
    <div className="page-container contact-page">
      <section className="contact-section">
        <h1>Contact Us</h1>
        <p>
          Have questions, feedback, or need support? We'd love to hear from you!
        </p>
        <p>
          Email:{" "}
          <a href="mailto:group2@uccs.edu">
            group2@uccs.edu
          </a>
        </p>
        <p>
          GitHub:{" "}
          <a
            href="https://github.com/UCCS-SP25-CS4300-CS5300-1/Group-2-spring-2025"
            target="_blank"
            rel="noopener noreferrer"
          >
            Group 2 Repo
          </a>
        </p>
      </section>
    </div>
  );
};

export default Contact;
