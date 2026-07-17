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
    slug: 'air-jordan-7-miro-item-of-the-week',
    category: 'ITEM OF THE WEEK',
    title: 'THE AIR JORDAN 7 "MIRO"',
    date: 'July 2026',
    featured: true,
    excerpt:
      'A 2008 European exclusive capped at 1,000 pairs is finally getting a full retro release, and resale is already climbing before it has even hit shelves.',
    heroHeight: 'h-72 md:h-[600px]',
    content: [
      'The original Miro dropped in Europe only back in 2008, inspired by Michael Jordans 1992 Barcelona Olympic run and the vibrant, abstract print of Spanish artist Joan Miro. Only 1,000 pairs existed. It has been a cult grail ever since, fetching four figures on the resale market whenever a pair surfaces.',
      'Now it is finally getting a proper wide retro. Same silhouette, same Miro-inspired colour explosion on the upper, more pairs in circulation, but early raffle numbers suggest demand is still going to blow past supply.',
      'This is the AJ7 at its loudest. Where most retros this year lean toward muted, wearable colourways, the Miro print is unapologetic. It is a collectors shoe first and a daily wear second, which is exactly why it holds value the way it does.',
      'We are tracking every raffle and regional restock for this one right now. Miss the release window and you are straight into resale at a serious markup. Drop a request and we get you in before general release closes.',
    ],
  },
  {
    slug: 'jacquemus-nike-moon-shoe-item-of-the-week',
    category: 'PAST ITEM OF THE WEEK',
    title: 'THE JACQUEMUS X NIKE MOON SHOE',
    date: 'July 2026',
    image: '/journal/jacquemus-nike-moon-shoe-item-of-the-week.jp.jpg',
    heroHeight: 'h-72 md:h-[600px]',
    excerpt:
      'Solange fronted the campaign, it sold out again within hours, and the waitlist keeps growing. The ballet-core sneaker moment just found its main character.',
    content: [
      'Nike dug into the archive for this one. The original Moon Shoe was hand-made by Bill Bowerman for the 1972 Olympic trials, Jacquemus took that silhouette and gave it a ruched nylon upper, an elasticated back, and a Nike Grind outsole. Heritage meets ballet flat. It should not work. It works.',
      'Three drops in, every colourway has sold out inside hours. Black, university red, white, and now brown, sail, and pink for the summer run. Retail lists open and close before most people even see the notification.',
      'This is the ballet sneaker trend at its peak, soft, feminine silhouettes replacing the chunky trainer era, but with enough Nike DNA to stay credible on both sides of the fashion-versus-sneakerhead divide. Celine and Miu Miu have their own versions circling the same energy; this is the one everyone is actually asking us for.',
      'We are tracking every restock across regions right now. Sizes go in minutes, resale is already inflated, and the next drop date is not public yet. Drop a request and we get you in before the general release.',
    ],
  },
  {
    slug: 'the-biarritz-beachcore-fit',
    category: 'OUTFIT BREAKDOWN',
    title: 'THE BIARRITZ BEACHCORE FIT',
    date: 'July 2026',
    excerpt:
      'Bleached denim, capri-length trousers, and barely-there summer tailoring. The coastal-French look that is taking over every airport this month.',
    content: [
      'Biarritz beachcore is the summer 2026 trend everyone is quietly copying. Relaxed coastal glamour instead of the loud logo-driven resort wear of the last few years, capri-length trousers, bleached and washed denim, and tailoring so soft it barely reads as tailoring at all.',
      'The build: wide-leg capri trousers or bleached denim, a loose linen or poplin shirt worn half-tucked, a woven espadrille or boat-inspired flat, and gold jewellery doing the only loud talking. Nothing oversized, nothing branded loud.',
      'It works because it photographs expensive without trying. This is quiet luxury for warm weather, fabric and cut carrying the whole look instead of a logo. It travels well too, which is exactly why it is everywhere from the Riviera to the airport lounge right now.',
      'We are sourcing capri-cut trousers, proper bleached denim, and the right espadrille every week right now, the good ones sell out of stock fast at the brands actually doing this trend well. Drop a request and we will put the fit together properly.',
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
      'Soccer casual is not a costume. Done right it borrows the low-profile trainer, the boxy zip track top, and the tapered leg, and drops the shirt entirely. Vintage colourways over anything branded loud.',
      'The build: retro football-boot-inspired trainer in a muted colourway, a fitted zip track top layered over a plain tee, straight-leg trousers with a slight taper. Nothing oversized, nothing screaming a badge.',
      'The trainer does the talking. Low profile, suede or soft leather, a colourway that looks pulled from an old kit rather than a current one. This is the detail that separates the fit from fancy dress.',
      'We are sourcing the archive boot-inspired releases and the harder-to-find colourways every week. Drop a request and we will put the fit together properly.',
    ],
  },
  {
    slug: 'why-heirloom-accessories-are-taking-over',
    category: 'CULTURE',
    title: 'WHY HEIRLOOM ACCESSORIES ARE TAKING OVER',
    date: 'July 2026',
    excerpt:
      'Vintage brooches, hair barrettes, and hardware-embossed belts are the new status symbol. We break down the shift away from logos.',
    content: [
      'Quiet luxury has moved into its next phase. For the last few years it meant no logos at all, just fabric and cut. Now the finishing touch is an accent piece with an heirloom feel: vintage brooches, hair barrettes, hardware-embossed belts, metallic buttons that look inherited rather than bought last season.',
      'The appeal is the opposite of a logo bag. A logo says you can afford the brand. A worn-in brooch or an old-money hardware belt says the piece has history, real or implied, and that reads as more expensive than a monogram ever could.',
      'This is harder to source than a mainline handbag. A lot of what people actually want here is vintage or archive, one-off pieces rather than something sitting on a shelf at every boutique in the same city. That means real hunting, not just checking a website.',
      'We are sourcing vintage and archive accessory pieces every week right now, brooches, barrettes, belts with the right hardware. Drop a request with what you are picturing and we will go find it.',
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
      'We are sourcing across the ballet-sneaker field right now, Celine, Miu Miu, and the Jacquemus x Nike drops. Drop a request and we will find your size before the restock disappears.',
    ],
  },
  {
    slug: 'how-to-actually-get-a-retro-before-resale-does',
    category: 'SOURCING GUIDE',
    title: 'HOW TO ACTUALLY GET A RETRO BEFORE RESALE DOES',
    date: 'July 2026',
    heroHeight: 'h-72 md:h-[600px]',
    excerpt:
      'Limited retros sell out in minutes and resale prices climb before most people even see the notification. Here is how we get ahead of it.',
    content: [
      'A hyped retro like this weeks AJ7 Miro moves in minutes. Bots and resellers move faster than a regular buyer clicking refresh, which is why so many people end up paying resale for something that had a retail price a few hours earlier.',
      'Step one: know the entry system for each retailer before drop day, not on it. Some are true raffles where speed does not matter, some are first-come, and treating a raffle like a race or a race like a raffle is how people lose both.',
      'Step two: accounts, saved payment, and shipping details ready in advance. Most losses at drop time come from being unprepared, not from being too slow.',
      'Step three: spread entries across regions and retailers rather than betting everything on one raffle. A single-region approach caps your odds long before the shoe even releases.',
      'Step four: verify immediately after a win or purchase. Superfakes flood the resale market within hours of every hyped drop, and a retail win is not automatically a safe one if it changes hands after the fact.',
      'We run this process for every hyped drop so our clients do not have to guess. Drop a request and we handle the entries and the verification.',
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
      'Watches are a different level of risk to a bag or a pair of trainers. The counterfeit game has gotten scary good, superfakes now run genuine movements and pass a magnet test and a loupe check. A quick glance is not authentication, it is a guess.',
      'Step one: papers, box, and service history. A full set matters for resale and for proving the piece is what it claims to be, but papers can be faked too, so the serial number gets cross-checked against the manufacturer, not just read off the case back.',
      'Step two: know your source. Authorized dealers control allocation and waitlists on the pieces everyone wants, which pushes real demand onto the grey market. Grey market is fine when the dealer is established and reputable, it is the random marketplace listing with no returns, cash only that gets people burned.',
      'Step three: independent verification before money moves, every time. Not the sellers watchmaker, an independent one who opens the case back and checks the movement itself. On anything four figures and up, this step is non-negotiable.',
      'Same principle as everything else we source: know the category cold, verify before committing, and take the risk off the clients hands. Drop a request and we will run the whole process for you.',
    ],
  },
]

export const featuredPost = posts.find((p) => p.featured) ?? posts[0]
export const gridPosts = posts.filter((p) => !p.featured)
