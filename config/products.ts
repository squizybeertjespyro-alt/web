// ============================================
// PRODUCTS LIST - Add your products here!
// ============================================
//
// HOW TO ADD A NEW PRODUCT:
// 1. Add a new object to the "products" array below
// 2. Put an image in /public/images/ folder
// 3. Match the "gameSlug" to one of your games from games.ts
//
// PRICE TYPES:
// - Use "options" for products with different versions (like Standard/Premium)
// - Use "price" and "salePrice" for single-price products

export interface ProductOption {
  name: string;        // Option name like "Standard" or "1 Month"
  price: number;       // Original price
  salePrice?: number;  // Sale price (optional - remove line if no sale)
  inStock: boolean;    // true = in stock, false = out of stock
}

export interface Product {
  id: string;
  name: string;
  image: string;
  slug: string;
  gameSlug: string;           // Must match a game's slug from games.ts
  shortDescription: string;   // Shows on category page
  fullDescription: string;    // Shows on product page
  status: "Undetected" | "Detected" | "Use at own risk" | "Updating";
  onSale: boolean;
  options: ProductOption[];
}

export const products: Product[] = [
  // ============================================
  // GTA V PRODUCTS
  // ============================================
  {
    id: "cherax",
    name: "Cherax",
    image: "/images/cherax.png",
    slug: "cherax-mod-menu-gtav",
    gameSlug: "gtav-cheats",  // Links to GTA V
    shortDescription: "The best GTA V mod menu",
    fullDescription: "Cherax is a powerful and feature-rich mod menu for Grand Theft Auto V. It offers a wide range of features including money drops, vehicle spawning, player modifications, and much more. With regular updates and excellent customer support, Cherax is the go-to choice for GTA V modding.",
    status: "Undetected",
    onSale: false,
    options: [
      { name: "Standard", price: 25.00, inStock: false },
      { name: "Premium", price: 45.00, inStock: false },
      { name: "Standard > Premium Upgrade", price: 20.00, inStock: false },
    ],
  },
  {
    id: "stand",
    name: "Stand",
    image: "/images/Stand.png",
    slug: "stand-mod-menu-gtav",
    gameSlug: "gtav-cheats",  // Links to GTA V
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

  // ============================================
  // ROBLOX PRODUCTS (add yours here!)
  // ============================================
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

  // ============================================
  // ADD MORE PRODUCTS BELOW!
  // ============================================
];



// Helper function to get products for a specific game
export function getProductsByGame(gameSlug: string): Product[] {
  return products.filter((product) => product.gameSlug === gameSlug);
}

// Helper function to get a single product by its slug
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
