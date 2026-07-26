export type NavItem = { title: string; href: string };
export type NavSection = { title: string; items: NavItem[] };

export const NAV: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction',  href: '/docs' },
      { title: 'Installation',  href: '/docs/installation' },
      { title: 'Quick Start',   href: '/docs/quick-start' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { title: 'Customization',    href: '/docs/customization' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { title: 'All Loaders',   href: '/docs/loaders' },
      { title: 'API Reference', href: '/docs/api-reference' },
    ],
  },
];
