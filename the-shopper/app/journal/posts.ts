export type Post = {
  slug: string
  category: string
  title: string
  date?: string
  featured?: boolean
  excerpt: string
  image?: string
  content?: string[]
}

export const posts: Post[] = [
  {
    slug: 'coach-tabby-bag-item-of-the-week',
    category: 'ITEM OF THE WEEK',
    title: 'THE COACH TABBY BAG',
    date: 'June 2026',
    featured: true,
    image: '/journal/coach-tabby-bag-item-of-the-week.jpg',
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
