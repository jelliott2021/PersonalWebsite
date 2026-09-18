import { render, screen } from '@testing-library/react';
import CountUp from '.';
import { setMediaQuery } from '../../test-utils/dom';

describe('CountUp', () => {
  it('renders text without a number unchanged', () => {
    const { container } = render(<CountUp value='Lots' className='stat' />);
    expect(container.firstChild).toHaveTextContent('Lots');
    expect(container.firstChild).toHaveClass('stat');
    expect(container.querySelector('.sr-only')).toBeNull();
  });

  it('exposes the final value to screen readers and starts the digits at zero', () => {
    const { container } = render(<CountUp value='1,000+' />);
    expect(container.querySelector('.sr-only')).toHaveTextContent('1,000+');
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('0+');
  });

  it('formats grouped numbers with separators once revealed', () => {
    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    const { container } = render(<CountUp value='1,000+' />);
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('1,000+');
  });

  it('keeps decimals and prefixes once revealed', () => {
    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    const { container } = render(<CountUp value='$4.50/mo' />);
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('$4.50/mo');
    expect(screen.getByText('$4.50/mo', { selector: '.sr-only' })).toBeInTheDocument();
  });
});
