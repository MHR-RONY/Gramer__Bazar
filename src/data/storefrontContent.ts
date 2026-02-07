export type HeroSlide = {
  url: string;
  alt: string;
};

export type StorefrontContentConfig = {
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroContactLabel: string;
  heroContactSubtext: string;
  heroSlides: HeroSlide[];
  offerTitle: string;
  offerSubtitle: string;
  offerCtaLabel: string;
};

const CONTENT_KEY = "gb_content_v1";

export const defaultContentConfig: StorefrontContentConfig = {
  heroTitle: "শুরু হোক আপনার হেলদি জার্নি",
  heroSubtitle: "দেশি-খাঁটি তেল, মধু, ঘি, খেজুর ও আরও অনেক ঐতিহ্যবাহী খাবার—সব এক জায়গায়।",
  heroBadge: "বিশ্বস্ত • খাঁটি • সেরা সার্ভিস",
  heroContactLabel: "WhatsApp/Call: +8801577302590 • হট লাইন: 09000000000",
  heroContactSubtext: "সহযোগিতার জন্য যোগাযোগ করুন",
  heroSlides: [
    {
      url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=2400&q=80",
      alt: "Traditional food banner 1",
    },
    {
      url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2400&q=80",
      alt: "Traditional food banner 2",
    },
    {
      url: "https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&w=2400&q=80",
      alt: "Traditional food banner 3",
    },
  ],
  offerTitle: "Offer Zone",
  offerSubtitle: "আজকের অফার — সীমিত স্টক",
  offerCtaLabel: "See Offers",
};

export const readContentConfig = (): StorefrontContentConfig => {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    if (!raw) return defaultContentConfig;
    const parsed = JSON.parse(raw) as Partial<StorefrontContentConfig>;
    return {
      ...defaultContentConfig,
      ...parsed,
      heroSlides: parsed.heroSlides && parsed.heroSlides.length > 0 ? parsed.heroSlides : defaultContentConfig.heroSlides,
    };
  } catch {
    return defaultContentConfig;
  }
};

export const writeContentConfig = (config: StorefrontContentConfig) => {
  try {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
};
