import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import NAActions from './NAActions';
import NAButton from './NAButton';
import './ErrorModal.css';

const modal_style = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    padding: 0,
    width: '50%',
  },
};

export default function ErrorModal(props) {
  const {
    isOpen,
    closeTimeoutMS,
    onClickDismiss,
    title = "ERROR",
    message = "Error message",
    dismissLabel = "DISMISS",
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      style={modal_style}
      closeTimeoutMS={closeTimeoutMS || 500}
    >
      <div className="error_modal">
      <div className="title">{title}</div>
          <br/>
          <div className="message">{message}</div>
          <NAActions justify="right">
            <NAButton varWidth onClick={onClickDismiss} primary>{dismissLabel}</NAButton>
          </NAActions>
      </div>
    </Modal>
  );
};
ErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeTimeoutMS: PropTypes.number,
  onClickDismiss: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  dismissLabel: PropTypes.string,
};
