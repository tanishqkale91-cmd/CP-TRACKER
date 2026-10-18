import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const routes = [
  { to: "/", label: "Home", end: true },
  { to: "/Leetcode", label: "LeetCode" },
  { to: "/Codeforce", label: "Codeforces" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [menuOpen]);

  function closeMenu() {
    if (menuRef.current?.open) menuRef.current.close();
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Primary navigation">
        <Link to="/" className="brand">CP Tracker</Link>
        <ul className="nav-list nav-list--desktop">
          {routes.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className="nav-link">{label}</NavLink>
            </li>
          ))}
        </ul>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => {
            const dialog = menuRef.current;
            if (dialog && !dialog.open) dialog.showModal();
            setMenuOpen(true);
          }}
        >Menu</button>
      </nav>
      <dialog
        className="mobile-menu"
        id="mobile-navigation"
        ref={menuRef}
        aria-label="Mobile navigation"
        onClose={() => setMenuOpen(false)}
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const dialog = menuRef.current;
          const focusable = [...dialog.querySelectorAll('button:not([disabled]), a[href]')];
          const first = focusable[0];
          const last = focusable.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <div className="mobile-menu__header">
          <span className="brand">CP Tracker</span>
          <button className="menu-close" type="button" onClick={closeMenu}>Close</button>
        </div>
        <nav aria-label="Mobile navigation links">
          <ul className="mobile-menu__list">
            {routes.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className="mobile-menu__link" onClick={closeMenu}>{label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </header>
  );
}
