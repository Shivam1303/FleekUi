import React from 'react';
import { Button } from '@my-scope/common'; // Example of using a common component

interface TestCompo1Props {
  label: string;
}

const TestCompo1: React.FC<TestCompo1Props> = ({ label }) => {
  return (
    <div>
      <Button label="Common Button" />
      {label}
    </div>
  );
};

export default TestCompo1;
