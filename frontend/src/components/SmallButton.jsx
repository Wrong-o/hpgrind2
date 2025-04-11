import React from 'react';
import PropTypes from 'prop-types';

const SmallButton = ({ 
  text, 
  onClick, 
  className = '',
  icon = null
}) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-md 
        bg-blue-600 text-white hover:bg-blue-700 
        transition-colors duration-200 flex items-center gap-2 ${className}`}
      onClick={onClick}
    >
      {icon && icon}
      {text}
    </button>
  );
};

SmallButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  icon: PropTypes.element,
};

export default SmallButton;
