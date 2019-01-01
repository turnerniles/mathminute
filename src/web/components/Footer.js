import React from 'react';
import { Row, Col } from 'reactstrap';

const Footer = () => (
  <footer className="mt-5">
    <Row>
      <Col sm="12" className="text-right pt-3">
        <p>
          Learn More and Contribute to the
          {' '}
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/turnerniles/mathminute">
            Github Repo
          </a>
          {' '}
          &nbsp; | &nbsp; Written and Maintained by
          {' '}
          <a target="_blank" rel="noopener noreferrer" href="">
            Some Blokes
          </a>
          .
        </p>
      </Col>
    </Row>
  </footer>
);

export default Footer;
