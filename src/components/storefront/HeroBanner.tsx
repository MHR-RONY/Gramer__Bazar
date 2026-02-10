import { useEffect, useMemo, useState } from "react";
import { defaultContentConfig, readContentConfig, type HeroSlide } from "@/data/storefront/content";

export const HeroBanner = () => {
	const [config, setConfig] = useState(defaultContentConfig);

	useEffect(() => {
		// Read once on mount; keep simple for now
		setConfig(readContentConfig());
	}, []);

	const slides: HeroSlide[] = useMemo(() => config.heroSlides, [config.heroSlides]);

	const [active, setActive] = useState(0);

	useEffect(() => {
		const id = window.setInterval(() => {
			setActive((p) => (p + 1) % slides.length);
		}, 4500);
		return () => window.clearInterval(id);
	}, [slides.length]);

	return (
		<section className="bg-background">
			<div className="container py-8 lg:py-10">
				<div className="relative overflow-hidden rounded-2xl border bg-surface">
					{/* Slider */}
					<div
						className="flex w-full transition-transform duration-500 motion-reduce:transition-none"
						style={{ transform: `translateX(-${active * 100}%)` }}
					>
						{slides.map((s) => (
							<img
								key={s.url}
								src={s.url}
								alt={s.alt}
								className="h-[200px] w-full shrink-0 object-cover sm:h-[360px] lg:h-[420px]"
								loading="lazy"
							/>
						))}
					</div>

					<div
						className="absolute inset-0 hidden sm:block"
						style={{
							background:
								"linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.3) 50%, transparent 65%)",
						}}
					/>

					<div className="absolute inset-0">
						<div className="flex h-full items-end">
							<div className="w-full p-4 pb-6 sm:p-10 sm:pb-14 lg:max-w-[60%]">
								<p className="mb-2 hidden sm:inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-foreground">
									{config.heroBadge}
								</p>

								<h1 className="hidden sm:block text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
									{config.heroTitle}
								</h1>

								<p className="hidden sm:block mt-3 max-w-xl text-pretty text-sm text-ink-muted sm:text-base">
									{config.heroSubtitle}
								</p>

								<div className="sm:mt-6 flex items-center gap-2">
									{slides.map((_, i) => (
										<button
											key={i}
											type="button"
											aria-label={`Go to slide ${i + 1}`}
											onClick={() => setActive(i)}
											className={
												"h-2.5 w-2.5 rounded-full border transition-colors " +
												(i === active ? "bg-foreground" : "bg-background hover:bg-accent")
											}
										/>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

