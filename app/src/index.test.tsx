import React from 'react';
import { render } from '@testing-library/react';
import DummyComponent from './components/dummy';

describe('Greeting component', () => {
  it('renders the greeting message with the provided name', () => {
    const { getByText } = render(<DummyComponent title="TUMai" />);
    const greetingElement = getByText("#TUMai#");
    expect(greetingElement).toBeInTheDocument();
  });
});
