import SiteNav from '@/components/SiteNav'

const h2Cls = 'font-mono text-[13px] text-brand-text uppercase tracking-[0.15em] mb-3'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <SiteNav activePath="/terms" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-8 py-16 sm:py-20">
        <p className="font-mono text-[10px] text-brand-gold uppercase tracking-[0.3em] mb-4">Legal</p>
        <h1 className="font-display text-4xl sm:text-5xl text-brand-text uppercase leading-none mb-8">
          Terms of Service
        </h1>
        <p className="font-sans text-brand-muted text-sm mb-10">Last updated: 8 July 2026</p>

        <div className="space-y-8 font-sans text-brand-muted text-sm leading-relaxed">
          <section>
            <h2 className={h2Cls}>1. The Service</h2>
            <p>
              The Shopper is a personal shopping concierge service. You submit a request describing an item you
              would like us to source; we locate the item, quote you a price, and — once you confirm and pay —
              purchase it on your behalf.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>2. Quotes</h2>
            <p>
              Quotes are estimates based on availability and pricing at the time they are given. Prices can
              change if an item&apos;s availability changes before payment is received. We will notify you of any
              change before proceeding.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>3. Payment</h2>
            <p>
              Payment is made by direct bank transfer using the payment link provided in your quote email. Please
              include the reference number given so we can match your payment to your order. We do not accept
              payment in any other form unless otherwise agreed in writing.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>4. Order Confirmation and Cancellation</h2>
            <p>
              Your order is confirmed once payment is received. Before payment, you may cancel your request at
              any time free of charge. Once payment is received and we have purchased the item on your behalf,
              the order cannot be cancelled, as we are no longer able to return the item to the original seller.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>5. Delivery</h2>
            <p>
              We will confirm delivery timelines and arrangements with you directly once your order is placed.
              Delivery times vary depending on the item and its source.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>6. Authenticity and Condition</h2>
            <p>
              We take reasonable steps to verify the authenticity and condition of items we source. If an item
              arrives faulty, not as described, or not authentic, contact us within 48 hours of delivery so we
              can investigate and, where appropriate, arrange a refund or replacement.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>7. Brand Names</h2>
            <p>
              The Shopper is an independent personal shopping service. We are not affiliated with, endorsed by,
              or sponsored by any brand referenced on this site or in our communications with you. Brand names
              are used solely to describe the items we can source.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>8. Limitation of Liability</h2>
            <p>
              We are not liable for delays or issues caused by third parties, including couriers, banks, or the
              original sellers of items we source. Our liability for any claim is limited to the amount you paid
              for the relevant order.
            </p>
          </section>

          <section>
            <h2 className={h2Cls}>9. Governing Law</h2>
            <p>These terms are governed by the laws of England and Wales.</p>
          </section>

          <section>
            <h2 className={h2Cls}>10. Contact</h2>
            <p>Questions about these terms can be sent to tstheshopper@outlook.com.</p>
          </section>
        </div>
      </main>
    </div>
  )
}
