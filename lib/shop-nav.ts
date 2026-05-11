export interface ShopNavLink {
  label: string
  href: string
}

export interface ShopNavGroup {
  heading: string
  links: ShopNavLink[]
}

/** Same destinations as the desktop Shop mega menu — reused in sidebar & mobile. */
export const SHOP_NAV_GROUPS: ShopNavGroup[] = [
  {
    heading: "Winter ’25",
    links: [{ label: "Karandi Shawl Suits", href: "/collections/karandi-shawl-suits" }],
  },
  {
    heading: "Collections",
    links: [
      { label: "Blossom", href: "/collections/blossom" },
      { label: "Linear", href: "/collections/linear" },
      { label: "Flora", href: "/collections/flora" },
      { label: "Stitched", href: "/collections/stitched" },
    ],
  },
]
