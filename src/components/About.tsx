import React from 'react';

interface AboutProps {
  onClose: () => void;
}

const About: React.FC<AboutProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg mx-auto relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">About This Theme Builder</h2>
        <p className="mb-4 text-gray-700">
          This software is a tool designed to help users create custom themes for their Nintendo Switch. 
          It is provided for creative and personal use only.
        </p>
        <p className="mb-4 text-gray-700 font-bold">
          Disclaimer: We do not endorse, support, or condone the creation or distribution of themes that promote hate speech, discrimination, violence, or any illegal or unethical content. 
          Users are solely responsible for the content they create and distribute using this software.
        </p>
        <p className="mb-4 text-gray-700">
          We denounce hate and discrimination in all its forms. We believe in fostering a community of creativity, respect, and positivity. 
          Please be excellent to each other.
        </p>
        <p className="text-gray-700">
          Thank you for using the Nintendo Switch Theme Builder.
        </p>
        <button
          onClick={onClose}
          className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg float-right"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default About;
