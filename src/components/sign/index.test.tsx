import { render, screen } from '@testing-library/react';
import Sign, { lineFor } from '.';

describe('lineFor', () => {
  it('cycles through the MBTA line colours in section order', () => {
    expect(lineFor('01')).toBe('red');
    expect(lineFor('02')).toBe('orange');
    expect(lineFor('03')).toBe('green');
    expect(lineFor('04')).toBe('blue');
    expect(lineFor('05')).toBe('silver');
    expect(lineFor('06')).toBe('purple');
    expect(lineFor('07')).toBe('red');
  });

  it('falls back to red for a non-numeric index', () => {
    expect(lineFor('x')).toBe('red');
  });
});

describe('Sign', () => {
  it('renders the title on the band and the caption on the strip', () => {
    const { container } = render(<Sign index='03' title='Projects' caption='Things' />);
    const sign = container.firstChild as HTMLElement;
    expect(sign).toHaveClass('sign', 'sign--green', 'sign--md');
    expect(screen.getByText('Projects').tagName).toBe('SPAN');
    expect(screen.getByText('03')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Things')).toHaveClass('sign__caption');
  });

  it('accepts a heading tag, size, and extra class', () => {
    const { container } = render(
      <Sign index='06' title='Contact' caption='Next' tag='h3' size='sm' className='extra' />,
    );
    expect(container.firstChild).toHaveClass('sign--purple', 'sign--sm', 'extra');
    expect(screen.getByRole('heading', { level: 3, name: 'Contact' })).toBeInTheDocument();
  });
});
