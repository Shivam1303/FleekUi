import React from 'react';

interface TestButton1Props {
  label: string;
}

const TestButton1: React.FC<TestButton1Props> = ({ label }) => {
  return <div>{label}</div>;
};

export default TestButton1;
