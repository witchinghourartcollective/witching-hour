export type SiteLink = {
  href: string;
  label: string;
};

export type SiteConfig = {
  brand: {
    mark: string;
    name: string;
    collection: string;
    volume: string;
    tagline: string;
  };
  links: {
    primary: SiteLink[];
    hero: SiteLink[];
    utility: SiteLink[];
  };
};

export const siteConfig: SiteConfig = {
  brand: {
    mark: "WHM",
    name: "hOUR ARCHIVES",
    collection: "WHM: hOUR ARCHIVES",
    volume: "VOL. 1: TROPHY SCARS FROM THE hOUR",
    tagline: "Not everything heals. Some things become trophies.",
  },
  links: {
    primary: [
      { href: "/", label: "Archive" },
      { href: "/collection", label: "Collection" },
      { href: "/profile", label: "Profile" },
      { href: "/account", label: "Account" },
      { href: "/mint", label: "Mint" },
      { href: "/token", label: "Token" },
      { href: "/access", label: "Access" },
    ],
    hero: [
      { href: "/mint", label: "Enter the Archive" },
      { href: "/collection", label: "View Collection" },
      { href: "/profile", label: "Track Progression" },
    ],
    utility: [
      { href: "/about", label: "About" },
      { href: "/links", label: "Links" },
      { href: "/press", label: "Press" },
    ],
  },
};
