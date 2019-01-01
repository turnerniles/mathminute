import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import Member from '../../containers/Member';
import Header from './Header';
import Footer from './Footer';
import { Sidebar } from './Sidebar';

const Template = ({ children }) => (
  <React.Fragment>
    <Member Layout={Header} />
    <Container fluid style={{ height: '100%' }}>
      <Row style={{ height: '100%' }}>
        <Sidebar />
        <Col md="10" sm="9" className="px-sm-5 py-sm-5 ml-sm-auto">
          {children}
          <Footer />
        </Col>
      </Row>
    </Container>
  </React.Fragment>
);

Template.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Template;
