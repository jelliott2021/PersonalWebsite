import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar, { MOBILE_BREAKPOINT, SCROLL_THRESHOLD } from '.';
import { NAV_LINKS } from '../../data/navigation';
import { profile } from '../../data/profile';

const setWindow = (property: 'scrollY' | 'innerWidth', value: number) => {
  Object.defineProperty(window, property, { configurable: true, value });
};

const renderNavbar = (props: Partial<React.ComponentProps<typeof Navbar>> = {}) => {
  const onToggleTheme = jest.fn();
  const utils = render(
    <Navbar activeId='about' theme='light' onToggleTheme={onToggleTheme} {...props} />,
  );
  return { ...utils, onToggleTheme };
};

const primaryNav = () => screen.getByRole('navigation', { name: 'Primary' });
const mobileNav = () => document.getElementById('mobile-menu') as HTMLElement;

beforeEach(() => {
  setWindow('scrollY', 0);
  setWindow('innerWidth', 400);
});

describe('Navbar', () => {
  it('lists every section link and marks the active one', () => {
    renderNavbar();
    NAV_LINKS.forEach(link => {
      const anchor = screen.getAllByRole('link', { name: link.label })[0];
      expect(anchor).toHaveAttribute('href', `#${link.id}`);
    });
    const active = primaryNav().querySelector('a.is-active');
    expect(active).toHaveAttribute('href', '#about');
    expect(active).toHaveAttribute('aria-current', 'true');
    expect(screen.getByText(profile.name)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Résumé' })).toHaveAttribute('href', profile.resumeUrl);
  });

  it('labels the theme toggle by the current theme and reports its centre', async () => {
    const user = userEvent.setup();
    const { onToggleTheme, rerender } = renderNavbar();
    const toggle = screen.getByRole('button', { name: 'Switch to dark theme' });
    jest.spyOn(toggle, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 20,
      width: 40,
      height: 40,
    } as DOMRect);
    await user.click(toggle);
    expect(onToggleTheme).toHaveBeenCalledWith({ x: 120, y: 40 });

    rerender(<Navbar activeId='about' theme='dark' onToggleTheme={onToggleTheme} />);
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('picks up a shadow once the page scrolls', () => {
    renderNavbar();
    const header = screen.getByRole('banner');
    expect(header).not.toHaveClass('navbar--scrolled');
    setWindow('scrollY', SCROLL_THRESHOLD + 1);
    fireEvent.scroll(window);
    expect(header).toHaveClass('navbar--scrolled');
  });

  it('opens and closes the mobile menu from the toggle', async () => {
    const user = userEvent.setup();
    renderNavbar();
    expect(mobileNav()).not.toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(mobileNav()).toBeVisible();
    expect(screen.getByRole('banner')).toHaveClass('navbar--open');
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(mobileNav()).not.toBeVisible();
  });

  it('closes the mobile menu on Escape', async () => {
    const user = userEvent.setup();
    renderNavbar();
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.keyboard('{Escape}');
    expect(mobileNav()).not.toBeVisible();
  });

  it('ignores other keys while open', async () => {
    const user = userEvent.setup();
    renderNavbar();
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.keyboard('a');
    expect(mobileNav()).toBeVisible();
  });

  it('closes the mobile menu when the window grows past the breakpoint', async () => {
    const user = userEvent.setup();
    renderNavbar();
    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    setWindow('innerWidth', MOBILE_BREAKPOINT - 1);
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(mobileNav()).toBeVisible();

    setWindow('innerWidth', MOBILE_BREAKPOINT + 1);
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(mobileNav()).not.toBeVisible();
  });

  it('closes the mobile menu after choosing a link, the résumé, or the brand', async () => {
    const user = userEvent.setup();
    renderNavbar();
    const open = () => user.click(screen.getByRole('button', { name: 'Open menu' }));

    await open();
    await user.click(mobileNav().querySelector('a[href="#projects"]') as HTMLElement);
    expect(mobileNav()).not.toBeVisible();

    await open();
    await user.click(screen.getByRole('link', { name: 'Résumé (PDF)' }));
    expect(mobileNav()).not.toBeVisible();

    await open();
    await user.click(screen.getByRole('link', { name: new RegExp(profile.name) }));
    expect(mobileNav()).not.toBeVisible();
  });

  it('removes its listeners on unmount', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderNavbar();
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
