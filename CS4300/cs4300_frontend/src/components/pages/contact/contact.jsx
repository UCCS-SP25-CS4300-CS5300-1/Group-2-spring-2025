import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="page-section">
        <h1>Contact Us</h1>
        <p>
          Have questions, feedback, or need support? We'd love to hear from you!
        </p>
        <p>Email: <a href="mailto:johara3@uccs.edu">group2@uccs.edu</a></p>
        <p>GitHub: <a href="https://github.com/UCCS-SP25-CS4300-CS5300-1/Group-2-spring-2025" target="_blank" rel="noopener noreferrer">Group 2 Repo</a></p>
      </div>
    </div>
  );
};

export default Contact;
