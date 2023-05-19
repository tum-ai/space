import React from 'react';

interface DummyComponentProps {
  title: string;
}

const DummyComponent: React.FC<DummyComponentProps> = ({ title }) => {
  return (
    <div>#{title}#</div>
  );
};

type DummyComponent = any;

export default DummyComponent;
