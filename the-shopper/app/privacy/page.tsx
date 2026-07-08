import SiteNav from '@/components/SiteNav'

const h2Cls = 'font-mono text-[13px] text-brand-text uppercase tracking-[0.15em] mb-3'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <SiteNav activePath="/privacy" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-8 py-16 sm:py-20">
        <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-4">Legal</p>
        <h1 className="font-display text-4xl sm:text-5xl text-brand-text uppercase leading-none mb-8">
          Privacy Policy
        </h1>
        <p className="font-sans text-brand-muted text-sm mb-10">Last updated: 8 July 2026</p>

        <div className="space-y-8 font-sans text-brand-muted text-sm leading-relaxed">
          <section>
            <h2 className={h2Cls}>1. Who We Are</h2>
            <p>
              The Shopper (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a personal shopping concierge
              service operating at theshopper.shop. This policy explains what personal data we collect, how we
              use it, and your rights.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>2. Information We Collect</h2>
            <p>
              When you create an account or submit a request, we collect: your name, email address, and phone
              number; details of the items you ask us to source (brand, budget, size, colour, and any notes); and,
              if you sign in with Google, basic profile information provided by Google.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>3. How We Use Your Information</h2>
            <p>
              We use your information to create and manage your account, process and fulfil your requests, send
              you email updates about your request status, quotes, and payment, and communicate with you about
              your order.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>4. Payment</h2>
            <p>
              We do not process or store card details. Payments are made by direct bank transfer via a NatWest
              Payit payment link. We never see or store your banking credentials — payments are handled entirely
              by NatWest.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>5. Third-Party Services</h2>
            <p>
              We use the following third parties to operate our service: Supabase (account authentication and
              database storage), Resend (transactional email delivery), and NatWest Payit (payment collection).
              Each provider processes data only as needed to provide their service to us.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>6. Data Retention</h2>
            <p>
              We retain your account and request information for as long as your account is active, or as needed
              to comply with legal, accounting, or reporting obligations.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>7. Your Rights</h2>
            <p>
              Under UK data protection law, you have the right to access, correct, or delete your personal data,
              and to object to or restrict certain processing. To exercise these rights, contact us at
              tstheshopper@outlook.com.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>8. Contact</h2>
            <p>Questions about this policy can be sent to tstheshopper@outlook.com.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
