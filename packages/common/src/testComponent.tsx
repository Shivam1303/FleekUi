import React from 'react';

interface testComponentProps {
  label: string;
}

const testComponent: React.FC<testComponentProps> = ({ label }) => {
  return <div>{label}</div>;
};

export default testComponent;
