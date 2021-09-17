import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorModal from "./ErrorModal";
import { sleep } from "../util";
import { error_message_clear } from "../actions";

class ErrorModalWithLogic extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }

  async _on_close_modal(prevProps) {
    // Save the most current valid props.
    await this.setState({
      title:
        typeof this.props.title === "string"
          ? this.props.title
          : prevProps.title,
      message:
        typeof this.props.message === "string"
          ? this.props.message
          : prevProps.message,
      dismissLabel:
        typeof this.props.dismissLabel === "string"
          ? this.props.dismissLabel
          : prevProps.dismissLabel,
    });

    // Delay, then clear out the state derived from the props.
    await sleep(this.closeTimeoutMS);
    await this.setState({
      title: null,
      message: null,
      dismissLabel: null,
    });
  }

  componentDidUpdate(prevProps) {
    // Closing
    if (!!prevProps.isOpen && !this.props.isOpen) {
      this._on_close_modal(prevProps);
    }
  }

  get closeTimeoutMS() {
    return this.props.closeTimeoutMS || 500;
  }

  render() {
    const {
      isOpen,
      closeTimeoutMS,
      onClickDismiss,
      error_message_clear,
    } = this.props;
    const title = this.state.title || this.props.title;
    const message = this.state.message || this.props.message;
    const dismissLabel = this.state.dismissLabel || this.props.dismissLabel;

    return (
      <div>
        <ErrorModal
          isOpen={isOpen}
          closeTimeoutMS={closeTimeoutMS}
          onClickDismiss={() => {
            error_message_clear();
            if (onClickDismiss) {
              onClickDismiss();
            }
          }}
          title={title}
          message={message}
          dismissLabel={dismissLabel}
        />
      </div>
    );
  }
}
ErrorModalWithLogic.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeTimeoutMS: PropTypes.number,
  onClickDismiss: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  dismissLabel: PropTypes.string,
};

const mapStateToProps = (state) => ({
  isOpen: !!state.error_message,
  title: (state.error_message && state.error_message.error) || null,
  message: (state.error_message && state.error_message.reason) || null,
  dismissLabel:
    (state.error_message && state.error_message.dismiss_label) || null,
});

const mapDispatchToProps = {
  error_message_clear,
};

const ErrorModalWithData = connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorModalWithLogic);
ErrorModalWithData.propTypes = {
  onClickDismiss: PropTypes.func,
};

export default ErrorModalWithData;
