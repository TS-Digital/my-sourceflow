export type Post = {
  slug: string
  category: string
  title: string
  date?: string
  featured?: boolean
  excerpt: string
  image?: string
  imagePosition?: string
  heroImagePosition?: string
  heroHeight?: string
  heroFit?: 'cover' | 'natural'
  content?: string[]
}

export const posts: Post[] = [
  {
    slug: 'jacquemus-nike-moon-shoe-item-of-the-week',
    category: 'ITEM OF THE WEEK',
    title: 'THE JACQUEMUS X NIKE MOON SHOE',
    date: 'July 2026',
    featured: true,
    image: '/journal/jacquemus-nike-moon-shoe-item-of-the-week.jp.jpg',
    heroHeight: 'h-72 md:h-[600px]',
    excerpt:
      'Solange fronted the campaign, it sold out again within hours, and the waitlist keeps growing. The ballet-core sneaker moment just found its main character.',
    content: [
      'Nike dug into the archive for this one. The original Moon Shoe was hand-made by Bill Bowerman for the 1972 Olympic trials — Jacquemus took that silhouette and gave it a ruched nylon upper, an elasticated back, and a Nike Grind outsole. Heritage meets ballet flat. It should not work. It works.',
      'Three drops in, every colourway has sold out inside hours. Black, university red, white, and now brown, Sail, and pink for the summer run. Retail lists open and close before most people even see the notification.',
      'This is the ballet sneaker trend at its peak — soft, feminine silhouettes replacing the chunky trainer era, but with enough Nike DNA to stay credible on both sides of the fashion-versus-sneakerhead divide. Celine and Miu Miu have their own versions circling the same energy; this is the one everyone is actually asking us for.',
      'We are tracking every restock across regions right now. Sizes go in minutes, resale is already inflated, and the next drop date is not public yet. Drop a request and we get you in before the general release.',
    ],
  },
  {
    slug: 'coach-tabby-bag-item-of-the-week',
    category: 'PAST ITEM OF THE WEEK',
    title: 'THE COACH TABBY BAG',
    date: 'June 2026',
    image: '/journal/coach-tabby-bag-item-of-the-week.jpg',
    imagePosition: 'object-bottom',
    heroImagePosition: 'object-center',
    excerpt:
      'Coach is back and the Tabby is leading the charge. Vintage shape, modern energy, and a price point that makes sense. Here is why this is the bag of the moment.',
    content: [
      'Coach had the best glow-up in fashion. Slept on for years while European houses ran the noise. Then the Tabby happened and the whole thing flipped.',
      'Soft structured leather, iconic C hardware, bold colours and metallic finishes. Looks expensive without screaming about it. That balance is rare at this price.',
      'The silhouette is 70s but the energy is now. Strap drops at the right length, the turnlock closure is a proper old-money detail. TikTok caught on first — now the streets have too.',
      'We are sourcing the Tabby in every colourway right now. Classic black, cherry red, limited seasonal drops. Drop a request and we handle the rest.',
    ],
  },
  {
    slug: 'the-soccer-casual-fit',
    category: 'OUTFIT BREAKDOWN',
    title: 'THE SOCCER CASUAL FIT',
    date: 'July 2026',
    image: '/journal/the-soccer-casual-fit.jpg.jpg',
    imagePosition: 'object-top',
    heroFit: 'natural',
    excerpt:
      'Retro boot-inspired trainers, a boxy track top, tapered trousers. Terrace culture is back in the front row.',
    content: [
      'Soccer casual is not a costume. Done right it borrows the low-profile trainer, the boxy zip track top, and the tapered leg — and drops the shirt entirely. Vintage colourways over anything branded loud.',
      'The build: retro football-boot-inspired trainer in a muted colourway, a fitted zip track top layered over a plain tee, straight-leg trousers with a slight taper. Nothing oversized, nothing screaming a badge.',
      'The trainer does the talking. Low profile, suede or soft leather, a colourway that looks pulled from an old kit rather than a current one. This is the detail that separates the fit from fancy dress.',
      'We are sourcing the archive boot-inspired releases and the harder-to-find colourways every week. Drop a request and we will put the fit together properly.',
    ],
  },
  {
    slug: 'why-ballet-sneakers-are-everywhere',
    category: 'CULTURE',
    title: 'WHY BALLET SNEAKERS ARE EVERYWHERE',
    date: 'July 2026',
    image: '/journal/why-ballet-sneakers-are-everywhere.jpg.jpg',
    imagePosition: 'object-bottom',
    excerpt:
      'Soft, feminine, and suddenly on every It girl. We break down why the ballet sneaker beat the chunky trainer.',
    content: [
      'For a decade the loudest trainer won. Chunky soles, exaggerated proportions, dad-shoe energy dressed up as fashion. That cycle is ending, and the ballet sneaker is what replaced it.',
      'Celine started the runway version, Miu Miu pushed it further with the Plume, and Nike and Jacquemus turned it into a genuine sellout. Soft uppers, ribbon-like laces, a silhouette borrowed straight from the studio rather than the court.',
      'It works because it is the opposite of everything the last era stood for. Quiet instead of loud, feminine instead of technical, and it pairs with tailoring as easily as it pairs with denim. Maximalist silver trainers are having their own moment alongside it, but the ballet shoe is the one crossing into everyday wear.',
      'We are sourcing across the ballet-sneaker field right now — Celine, Miu Miu, and the Jacquemus x Nike drops. Drop a request and we will find your size before the restock disappears.',
    ],
  },
  {
    slug: 'how-to-source-a-watch-without-getting-burned',
    category: 'SOURCING GUIDE',
    title: 'HOW TO SOURCE A WATCH WITHOUT GETTING BURNED',
    date: 'July 2026',
    image: '/journal/how-to-source-a-watch-without-getting-burned.jpg.jpg',
    heroHeight: 'h-72 md:h-[600px]',
    excerpt:
      'Superfakes are good enough to fool most jewellers now. Here is how we make sure what lands on your wrist is real.',
    content: [
      'Watches are a different level of risk to a bag or a pair of trainers. The counterfeit game has gotten scary good — superfakes now run genuine movements and pass a magnet test and a loupe check. A quick glance is not authentication, it is a guess.',
      'Step one: papers, box, and service history. A full set matters for resale and for proving the piece is what it claims to be, but papers can be faked too — so the serial number gets cross-checked against the manufacturer, not just read off the case back.',
      'Step two: know your source. Authorized dealers control allocation and waitlists on the pieces everyone wants, which pushes real demand onto the grey market. Grey market is fine when the dealer is established and reputable — it is the random marketplace listing with "no returns, cash only" that gets people burned.',
      'Step three: independent verification before money moves, every time. Not the seller\'s watchmaker — an independent one who opens the case back and checks the movement itself. On anything four figures and up, this step is non-negotiable.',
      'Same principle as everything else we source: know the category cold, verify before committing, and take the risk off the client\'s hands. Drop a request and we will run the whole process for you.',
    ],
  },
  {
    slug: 'the-quiet-luxury-fit',
    category: 'OUTFIT BREAKDOWN',
    title: 'THE QUIET LUXURY FIT',
    date: 'June 2026',
    image: '/journal/the-quiet-luxury-fit.jpg',
    excerpt:
      'Loro Piana bomber, cream trousers, clean runners. How to look rich without trying.',
    content: [
      'Quiet luxury is simple. Look expensive without announcing it. No logos, no prints — just quality fabric and a palette that stays in the cream, camel, and navy zone.',
      'The build: Loro Piana Storm System bomber in camel, off-white straight-leg trousers, clean white leather runners. Nothing on the outside tells you the price. The people who know, know.',
      'Fit and fabric are everything here. Trousers should hit with a clean break at the ankle, footwear low-profile and simple. The shoe should be the last thing anyone notices.',
      'We source Loro Piana, Brunello Cucinelli, and the runners that tie this kind of fit together every week. Drop us a request and we will build it out properly.',
    ],
  },
  {
    slug: 'why-goyard-hits-different-in-2026',
    category: 'CULTURE',
    title: 'WHY GOYARD HITS DIFFERENT IN 2026',
    date: 'June 2026',
    image: '/journal/why-goyard-hits-different.jpg',
    excerpt:
      'The bag everyone is carrying but nobody is talking about. We break down the appeal.',
    content: [
      'Goyard does not advertise. No runway shows, no gifting strategy, no paid placements. Been doing the same thing since 1853 — in a world full of noise, silence is the flex.',
      'The St Louis tote is for people who are done proving themselves. Coated canvas, near indestructible, made by hand in Paris — the design has not changed in decades. You are paying for permanence.',
      'The current wave is generational. Younger buyers are moving away from pieces that broadcast and toward things that whisper. The Chevron print is only recognisable if you are already in the conversation.',
      'We are sourcing Goyard regularly — Saint Louis, Anjou, Artois. Boutique waitlists are long and the secondary market is patchy. Want a specific colourway without the runaround, we handle it properly.',
    ],
  },
  {
    slug: 'how-to-cop-heat-without-getting-played',
    category: 'SOURCING GUIDE',
    title: 'HOW TO COP HEAT WITHOUT GETTING PLAYED',
    date: 'June 2026',
    image: '/journal/how-to-cop-heat.jpg',
    excerpt:
      'Reseller market is full of games. Here is how we navigate it for our clients every day.',
    content: [
      'The reseller market is a minefield. Fakes, inflated prices, sellers who ghost after payment, items that arrive in worse shape than described. If you have been in this space, you have taken an L somewhere.',
      'First rule: not buying direct means proper authentication. Not a quick glance at the box — a specialist who knows that category inside out. Generic auth misses things. Trained eyes do not.',
      'Second rule: know your platforms. Some marketplaces are better regulated, some seller profiles are worth reading closely — transaction history, dispute record, response rate. Most people do not have time for this, which is exactly why concierge sourcing exists.',
      'Every piece we source goes through verification before we confirm. We know which sellers we trust and which we avoid. We have done the work so our clients do not have to take the risk.',
    ],
  },
]

export const featuredPost = posts.find((p) => p.featured) ?? posts[0]
export const gridPosts = posts.filter((p) => !p.featured)
