// ============================================
// PRODUCTS LIST - Add your products here!
// ============================================

export interface ProductOption {
  name: string;
  price: number;
  salePrice?: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  slug: string;
  gameSlug: string;
  shortDescription: string;
  fullDescription: string;
  status: "Undetected" | "Detected" | "Use at own risk" | "Updating";
  onSale: boolean;
  options: ProductOption[];
  isRobux?: boolean; // special flag for Robux product
}

export const products: Product[] = [
  // ============================================
  // GTA V PRODUCTS
  // ============================================
  {
  id: "ovix",
  name: "Ovix",
  image: "/images/ovix.png",
  slug: "ovix-mod-menu-gtav",
  gameSlug: "gtav-cheats",
  shortDescription: "The best GTA V Enhanced mod menu",
  fullDescription: "Ovix is a premium, feature-packed mod menu built for Grand Theft Auto V, delivering a refined and powerful modding experience across the latest Enhanced & Expanded editions. Packed with an extensive suite of advanced player and vehicle features, deep customization, scripting capabilities, custom themes, and community-driven functionality, Ovix gives you complete control over your GTA V experience.Engineered with performance, stability, and usability in mind, Ovix combines a sleek interface with powerful features and continuous development. With regular updates and dedicated support, Ovix is built to provide a reliable, modern, and premium GTA V modding experience.",
  status: "Undetected",
  onSale: false,
  options: [
    { name: "Lifetime", price: 4.99, inStock: false },
  ],
  },
  {
  
  id: "yari",
  name: "Yari",
  image: "/images/yari.webp",
  slug: "yari-mod-menu-gtav",
  gameSlug: "gtav-cheats",
  shortDescription: "The best GTA V Enhanced mod menu",
  fullDescription: "Yari is a powerful and feature-rich mod menu for Grand Theft Auto V, built for the latest Enhanced & Expanded editions. It offers advanced GTA V modding features, a powerful Lua API, vehicle and player modifications, custom themes, community file sharing, and BattlEye bypass technology. With regular updates and 24/7 support, Yari delivers a powerful and stable GTA V modding experience.",
  status: "Undetected",
  onSale: false,
  options: [
    { name: "7 Days", price: 6.99, inStock: false },
    { name: "30 Days", price: 24.99, inStock: false },
    { name: "60 Days", price: 44.99, inStock: false },
    { name: "90 Days", price: 59.99, inStock: false },
    { name: "Lifetime", price: 109.99, inStock: false },
  ],
  },
  {
    id: "cherax",
    name: "Cherax",
    image: "/images/cherax.png",
    slug: "cherax-mod-menu-gtav",
    gameSlug: "gtav-cheats",
    shortDescription: "The best GTA V mod menu",
    fullDescription: "Cherax is a powerful and feature-rich mod menu for Grand Theft Auto V. It offers a wide range of features including money drops, vehicle spawning, player modifications, and much more. With regular updates and excellent customer support, Cherax is the go-to choice for GTA V modding.",
    status: "Undetected",
    onSale: false,
    options: [
      { name: "Standard", price: 24.99, inStock: false },
      { name: "Premium", price: 49.99, inStock: false },
      { name: "Standard > Premium Upgrade", price: 24.99, inStock: false },
    ],
  },
  {
    id: "stand",
    name: "Stand",
    image: "/images/Stand.png",
    slug: "stand-mod-menu-gtav",
    gameSlug: "gtav-cheats",
    shortDescription: "One of the best GTA V mod menu's out there",
    fullDescription: "Stand is a highly popular mod menu for Grand Theft Auto V, known for its extensive features and user-friendly interface. It offers a wide variety of options including money drops, vehicle spawning, player modifications, and more. With regular updates and a strong community, Stand remains a top choice for GTA V modding enthusiasts.",
    status: "Undetected",
    onSale: false,
    options: [
      { name: "basic", price: 12.99, inStock: true },
      { name: "Regular", price: 26.99, inStock: true },
      { name: "Ultimate", price: 50.99, salePrice: 20.00, inStock: false },
    ],
  },
  {
    id: "midnight",
    name: "Midnight",
    image: "/images/midnight.png",
    slug: "midnight-mod-menu-gtav",
    gameSlug: "gtav-cheats",
    shortDescription: "Greate and Unique GTA V mod menu",
    fullDescription: "Midnight is a unique and feature-packed mod menu for Grand Theft Auto V. It offers a wide range of features including money drops, vehicle spawning, player modifications, and more. With regular updates and excellent customer support, Midnight is a great choice for GTA V modding.",
    status: "Undetected",
    onSale: false,
    options: [
      { name: "Month", price: 7.99, inStock: true },
      { name: "Lifetime", price: 20.99, inStock: true },
    ],
  },

  // ============================================
  // ROBLOX PRODUCTS
  // ============================================
  {
    id: "robux",
    name: "Robux",
    image: "/images/roblox.png",
    slug: "robux",
    gameSlug: "roblox-cheats",
    shortDescription: "Cheap Robux delivered fast via Discord",
    fullDescription: "Get Robux at the best prices. Open a ticket on our Discord and we'll handle the rest. Fast, safe and reliable delivery.",
    status: "Undetected",
    onSale: false,
    isRobux: true,
    options: [
      { name: "1,000 R$", price: 5.99, inStock: true },
      { name: "2,500 R$", price: 13.99, inStock: true },
      { name: "5,000 R$", price: 25.99, inStock: true },
      { name: "7,500 R$+", price: 0, inStock: true },
    ],
  },
  {
    id: "xenov2",
    name: "XenoV2",
    image: "/images/xeno.png",
    slug: "xeno-executor-roblox",
    gameSlug: "roblox-cheats",
    shortDescription: "One of the best Roblox executor's out there",
    fullDescription: "Xeno V2 is a powerful Roblox executor With 100% UNC and sUNC known for its beginner friendly interface and extensive features.",
    status: "Undetected",
    onSale: false,
    options: [
      { name: "Month", price: 28.99, inStock: true },
      { name: "Lifetime", price: 48.99, inStock: true },
    ],
  },
  {
    id: "potassium",
    name: "Potassium",
    image: "/images/potassium.png",
    slug: "potassium-executor-roblox",
    gameSlug: "roblox-cheats",
    shortDescription: "Powerful Roblox executor with advanced features",
    fullDescription: "Potassium is a top-tier Roblox executor designed for both beginners and advanced users. It offers a user-friendly interface, high execution speed, and compatibility with a wide range of scripts. With regular updates and excellent customer support, Potassium is the ideal choice for anyone looking to enhance their Roblox experience.",
    status: "Undetected",
    onSale: false,
    options: [
      { name: "Lifetime", price: 23.00, inStock: false },
    ],
  },
];

export function getProductsByGame(gameSlug: string): Product[] {
  return products.filter((product) => product.gameSlug === gameSlug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
