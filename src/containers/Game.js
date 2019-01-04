import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { login } from '../actions/member';
import { generateQuestions } from '../actions/game';


class Game extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    locale: PropTypes.string,
    member: PropTypes.shape({}).isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    successMessage: PropTypes.string.isRequired,
    answer: PropTypes.number.isRequired,
  };

  static defaultProps = {
    locale: null,
  };

  state = {
    errorMessage: null,
  };

  onFormSubmit = (data) => {
    const { onFormSubmit } = this.props;
    return onFormSubmit(data).catch((err) => {
      this.setState({ errorMessage: err });
      throw err;
    });
  };

  render = () => {
    const {
      member, locale, Layout, isLoading, successMessage, currentQuestions, answer,
    } = this.props;

    const { errorMessage } = this.state;

    console.log('in the container render currentQuestions', currentQuestions);

    return (
      <Layout
        member={member}
        locale={locale}
        loading={isLoading}
        error={errorMessage}
        success={successMessage}
        onFormSubmit={this.onFormSubmit}
        currentQuestions={currentQuestions}
        answer={answer}
        generateQuestions={generateQuestions}
      />
    );
  };
}

const mapStateToProps = state => ({
  recipes: state.recipes || {},
  member: state.member || {},
  locale: state.locale || null,
  isLoading: state.status.loading || false,
  successMessage: state.status.success || '',
  currentQuestions: state.game.currentQuestions,
  answer: state.game.answer,
});

const mapDispatchToProps = {
  onFormSubmit: login,
  generateQuestions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game);
