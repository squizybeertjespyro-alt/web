import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

const products = [
  {
    id: "stand",
    name: "Stand",
    game: "GTA V",
    discord: null,
    discordNote: "Discord access is granted after successful key activation and account creation on the website.",
    sections: [
      {
        title: "License Key Activation",
        steps: [
          { text: "Create your account at", link: { href: "https://stand.sh/account/register", label: "stand.sh/account/register" } },
          { text: "Follow the instructions on the page (save your account ID, etc.)" },
          { text: "Once on the account dashboard, press \"Download Launchpad\". Your antivirus might cause issues — disable it temporarily if needed." },
          { text: "Run the Launchpad. See", link: { href: "https://stand.sh/help/troubleshooting", label: "stand.sh/help/troubleshooting" }, suffix: " if you're having trouble." },
          { text: "Ensure GTA V is running, then inject Stand using the Launchpad." },
          { text: "Click on the activation key from the account dashboard to activate Stand." },
        ],
      },
      {
        title: "Upgrade Key Activation",
        steps: [
          { text: "Go to", link: { href: "https://stand.sh/account", label: "stand.sh/account" }, suffix: " and ensure you're logged in." },
          { text: "Scroll down until you see \"Use your upgrade key\"." },
          { text: "Paste the upgrade key into the input box and press Enter." },
        ],
      },
    ],
  },
  {
    id: "ovix",
    name: "Ovix",
    game: "GTA V",
    discord: "https://discord.gg/ESr87CR7Ux",
    sections: [
      {
        title: "Activation & Installation",
        steps: [
          { text: "Activate your license at", link: { href: "https://ovix.one", label: "ovix.one" } },
          { text: "Create an account, then paste your license and click \"Redeem\"." },
          { text: "Download and install VC Redist (also available on the dashboard)." },
          { text: "Download the OVIX Installer from the dashboard." },
          { text: "Run the OVIX Installer. Choose a folder and provide administrator permissions." },
          { text: "OVIX Loader is now installed. A shortcut has been created on your desktop and start menu." },
          { text: "Add an antivirus exclusion for the OVIX executable." },
          { text: "Launch GTA V and load into Story Mode." },
          { text: "When fully loaded, launch the OVIX Loader and connect using your credentials." },
          { text: "Press the Inject button to inject the menu." },
          { text: "Press F4 in-game to open the menu. Enjoy!" },
        ],
      },
    ],
  },
  {
    id: "cherax",
    name: "Cherax",
    game: "GTA V",
    discord: "https://discord.gg/cherax",
    sections: [
      {
        title: "Download & Activation",
        steps: [
          { text: "Download the loader from", link: { href: "https://cherax.menu/loader", label: "cherax.menu/loader" } },
          { text: "Run the loader and log in with your Cherax account." },
          { text: "Pick your game version (GTA V Legacy, Enhanced, etc.), menu version (Standard, Premium, Prime), and platform (Social Club, Steam, Epic Games)." },
          { text: "Press Start — GTA V will launch and Cherax injects automatically." },
          { text: "Open the menu with the End key (or Ctrl + Numpad 1), or use the on-screen keyboard." },
          { text: "Note: If using Prime with BattlEye, press F7 once in-game to trigger injection." },
          { text: "The loader auto-updates every time you start it — you always get the latest build." },
        ],
      },
    ],
  },
  {
    id: "yari",
    name: "Yari",
    game: "GTA V",
    discord: "https://discord.com/invite/cB23b7Btwr",
    sections: [
      {
        title: "Getting Started",
        steps: [
          { text: "Create an account at", link: { href: "https://yari.one", label: "yari.one" } },
          { text: "Have your license key ready." },
          { text: "Download the Yari Launcher from your dashboard." },
          { text: "Run the launcher and log in with your credentials." },
          { text: "Launch GTA V and inject using the launcher." },
        ],
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-2 text-3xl font-bold">
            Product <span className="text-primary">Documentation</span>
          </h1>
          <p className="text-muted-foreground">
            Step-by-step guides to activate and set up your products.
          </p>
        </div>

        {/* Quick nav */}
        <div className="mb-10 flex flex-wrap gap-2">
          {products.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {p.name}
            </a>
          ))}
        </div>

        {/* Products */}
        <div className="space-y-16">
          {products.map((product) => (
            <section key={product.id} id={product.id} className="scroll-mt-20">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{product.name}</h2>
                  <p className="text-sm text-muted-foreground">{product.game}</p>
                </div>
                {product.discord && (
                  <a
                    href={product.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    Discord
                  </a>
                )}
              </div>

              {product.discordNote && (
                <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                  💬 {product.discordNote}
                </div>
              )}

              <div className="space-y-6">
                {product.sections.map((section) => (
                  <div key={section.title} className="cyber-card">
                    <h3 className="mb-5 text-base font-semibold text-primary">{section.title}</h3>
                    <ol className="space-y-4">
                      {section.steps.map((step, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {i + 1}
                          </span>
                          <span className="text-sm leading-relaxed text-muted-foreground">
                            {step.text}{" "}
                            {step.link && (
                              <a
                                href={step.link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline hover:opacity-80"
                              >
                                {step.link.label}
                              </a>
                            )}
                            {step.suffix}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={`/product-category/gtav-cheats`}
                  className="text-sm text-primary underline hover:opacity-80"
                >
                  ← Back to shop
                </Link>
                {product.discord && (
                  <p className="text-xs text-muted-foreground">
                    Need help?{" "}
                    <a href={product.discord} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                      Join the {product.name} Discord
                    </a>
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}