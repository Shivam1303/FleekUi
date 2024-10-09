import React from 'react';

interface TestButtonProps {
  label: string;
}

const TestButton: React.FC<TestButtonProps> = ({ label }) => {
  return <div>{label}</div>;
};

export default TestButton;
