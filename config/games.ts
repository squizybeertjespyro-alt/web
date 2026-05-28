// ============================================
// GAMES LIST - Add or remove games here!
// ============================================
// 
// HOW TO ADD A NEW GAME:
// 1. Add a new object to the "games" array below
// 2. Put an image in /public/images/ folder (png or jpg)
// 3. Create a page for it (copy an existing one from /app/product-category/)
//
// EXAMPLE:
// {
//   id: "3",                        <-- Just increase the number
//   name: "Fortnite",               <-- Name shown on the card
//   image: "/images/fortnite.png",  <-- Path to your image
//   slug: "fortnite-cheats",        <-- URL path (no spaces, use dashes)
// },

export interface Game {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export const games: Game[] = [
  // -------- GAME 1: GTA V --------
  {
    id: "1",
    name: "GTA V",
    image: "/images/gtav.png",
    slug: "gtav-cheats",
  },

  // -------- GAME 2: ROBLOX --------
  {
    id: "2",
    name: "Roblox",
    image: "/images/roblox.png",
    slug: "roblox-cheats",
  },

  // -------- ADD MORE GAMES BELOW --------
  // Copy the format above and paste here!
];
