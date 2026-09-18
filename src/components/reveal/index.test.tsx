import { act, render } from '@testing-library/react';
import Reveal from '.';
import { latestObserver } from '../../test-utils/dom';

describe('Reveal', () => {
  it('renders a div by default and reveals on intersection', () => {
    const { container } = render(<Reveal className='extra'>Hello</Reveal>);
    const element = container.firstChild as HTMLElement;
    expect(element.tagName).toBe('DIV');
    expect(element).toHaveClass('reveal', 'extra');
    expect(element).not.toHaveClass('is-visible');
    expect(element.style.transitionDelay).toBe('');

    act(() => latestObserver().trigger(true));
    expect(element).toHaveClass('is-visible');
    expect(element).toHaveTextContent('Hello');
  });

  it('renders the requested tag with a stagger delay', () => {
    const { container } = render(
      <Reveal tag='li' delay={120}>
        Item
      </Reveal>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element.tagName).toBe('LI');
    expect(element.style.transitionDelay).toBe('120ms');
  });
});
