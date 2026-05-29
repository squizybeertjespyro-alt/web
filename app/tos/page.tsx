"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16 lg:px-8">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-white">
            Terms of <span style={{ color: "#b100ff" }}>Service</span>
          </h1>
          <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString("en-GB")}</p>
        </div>

        <div className="space-y-8">

          {/* Section 1 */}
          <section className="cyber-card">
            <h2 className="mb-3 text-lg font-bold text-white">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Welcome to HardDuckMarket. By accessing or using our website (hardduckmarket.xyz) and purchasing
              license keys through our platform, you agree to comply with and be bound by these Terms of Service.
              If you do not agree to these Terms, please do not use our services.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              HardDuckMarket operates an online digital distribution platform. We are responsible for payment
              processing, customer support, delivery coordination, and refund handling for all purchases made
              on our platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="cyber-card">
            <h2 className="mb-3 text-lg font-bold text-white">2. License Key Purchase</h2>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <div>
                <span className="font-semibold text-white">2.1 Product Description</span>
                <p className="mt-1">HardDuckMarket sells online license keys for various software products. The description of each product, including its features and functionalities, is available on the site.</p>
              </div>
              <div>
                <span className="font-semibold text-white">2.2 Payment</span>
                <p className="mt-1">You agree to pay the specified amount for the license key(s) you purchase. Payments are processed securely via cryptocurrency through NOWPayments. Your financial information is not stored on our servers.</p>
              </div>
              <div>
                <span className="font-semibold text-white">2.3 Delivery</span>
                <p className="mt-1">Upon successful payment, you will receive the license key(s) via email. Ensure that the provided email address is accurate to receive timely delivery.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="cyber-card">
            <h2 className="mb-3 text-lg font-bold text-white">3. Use of License Keys</h2>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <div>
                <span className="font-semibold text-white">3.1 Authorized Use</span>
                <p className="mt-1">The license keys purchased through HardDuckMarket are for your personal or business use and are non-transferable.</p>
              </div>
              <div>
                <span className="font-semibold text-white">3.2 Prohibited Use</span>
                <p className="mt-1">You may not resell, distribute, or transfer the license keys to third parties without explicit permission from the software administrator. Any unauthorized use may result in the termination of your account and legal action.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="cyber-card">
            <h2 className="mb-3 text-lg font-bold text-white">4. Refund and Cancellation Policy</h2>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <div>
                <span className="font-semibold text-white">4.1 Refunds</span>
                <p className="mt-1">Refund eligibility and processing are governed by our Refund Policy. Refunds are handled directly by HardDuckMarket and may depend on delivery status, product usage, and technical compatibility.</p>
              </div>
              <div>
                <span className="font-semibold text-white">4.2 Cancellation</span>
                <p className="mt-1">HardDuckMarket reserves the right to cancel any order at its discretion. In such cases, you will be notified and a refund will be issued.</p>
              </div>
              <div>
                <span className="font-semibold text-white">4.3 Refund Refusal</span>
                <p className="mt-1">Refunds may be refused if it is determined that the refund request is not legitimate. This includes cases where the customer did not follow the provided instructions or failed to review the information available on the website or Discord.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="cyber-card">
            <h2 className="mb-3 text-lg font-bold text-white">5. Privacy Policy</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your privacy is important to us. We collect only the information necessary to process your order
              and deliver your product. Your data is never sold to third parties. In accordance with applicable
              data protection laws, you have the right to access, rectify, and erase your personal data by
              contacting us via Discord.
            </p>
          </section>

          {/* Section 6 */}
          <section className="cyber-card">
            <h2 className="mb-3 text-lg font-bold text-white">6. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              HardDuckMarket is not liable for any indirect, incidental, special, consequential, or punitive
              damages arising out of or in connection with the use of our services.
            </p>
          </section>

          {/* Section 7 */}
          <section className="cyber-card">
            <h2 className="mb-3 text-lg font-bold text-white">7. Governing Law</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              These Terms are governed by and construed in accordance with applicable laws. Any disputes arising
              under or in connection with these Terms shall be subject to the exclusive jurisdiction of the
              competent courts.
            </p>
          </section>

          {/* Section 8 */}
          <section className="cyber-card">
            <h2 className="mb-3 text-lg font-bold text-white">8. Changes to Terms</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              HardDuckMarket reserves the right to modify or update these Terms at any time. It is your
              responsibility to review these Terms periodically for changes. Continued use of our services
              after any changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          {/* Section 9 */}
          <section className="cyber-card">
            <h2 className="mb-3 text-lg font-bold text-white">9. Legal Information</h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <div>
                <span className="font-semibold text-white">Site Publisher</span>
                <p className="mt-1">HardDuckMarket<br />Website: hardduckmarket.xyz<br />Contact: via Discord</p>
              </div>
              
              <div>
                <span className="font-semibold text-white">Intellectual Property</span>
                <p className="mt-1">All elements making up the hardduckmarket.xyz website are the exclusive property of HardDuckMarket and are protected by applicable intellectual property laws. Any reproduction or modification without prior written authorization is prohibited.</p>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}