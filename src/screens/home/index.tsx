// shared
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { cn } from "@/shared/lib/utils";
// lucide-react
import { SearchIcon, PawPrint, Heart, Home, Users, Medal, Calendar, Shield, Gift } from "lucide-react";
// next-intl
import { useTranslations } from "next-intl";
// next tools
import Link from "next/link";

const Index = () => {
	const t = useTranslations();

	return (
		<main className="flex flex-col items-center space-y-16 px-6 py-12">
			<section className="w-full max-w-6xl space-y-6 text-center">
				<h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">{t("page.home.hero-section.title")}</h1>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">{t("page.home.hero-section.description")}</p>
				<div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
					<Link href="#" className={cn(buttonVariants())}>
						{t("page.home.hero-section.animal-button-title")}
					</Link>
					<Link href="#" className={cn(buttonVariants({ variant: "secondary" }))}>
						{t("page.home.hero-section.shelter-button-title")}
					</Link>
				</div>
			</section>

			<section className="w-full max-w-4xl space-y-8 text-center">
				<h2 className="text-2xl font-semibold">{t("page.home.how-it-works.title")}</h2>
				<Tabs defaultValue="adopt" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="adopt">{t("page.home.how-it-works.animal-trigger-title")}</TabsTrigger>
						<TabsTrigger value="shelter">{t("page.home.how-it-works.shelter-trigger-title")}</TabsTrigger>
					</TabsList>

					<TabsContent value="adopt" className="mt-6">
						<div className="grid gap-8 md:grid-cols-3">
							<div className="flex flex-col items-center space-y-4">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
									<SearchIcon size={32} />
								</div>
								<h3 className="text-lg font-medium">{t("page.home.how-it-works.animal-tab-search-title")}</h3>
								<p className="text-sm text-muted-foreground">{t("page.home.how-it-works.animal-tab-search-description")}</p>
							</div>
							<div className="flex flex-col items-center space-y-4">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Calendar size={32} />
								</div>
								<h3 className="text-lg font-medium">{t("page.home.how-it-works.animal-tab-meet-title")}</h3>
								<p className="text-sm text-muted-foreground">{t("page.home.how-it-works.animal-tab-meet-description")}</p>
							</div>
							<div className="flex flex-col items-center space-y-4">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Heart size={32} />
								</div>
								<h3 className="text-lg font-medium">{t("page.home.how-it-works.animal-tab-adopt-title")}</h3>
								<p className="text-sm text-muted-foreground">{t("page.home.how-it-works.animal-tab-adopt-description")}</p>
							</div>
						</div>
						<Link href="#" className={cn(buttonVariants(), "mt-8")}>
							{t("page.home.how-it-works.animal-tab-button-title")}
						</Link>
					</TabsContent>

					<TabsContent value="shelter" className="mt-6">
						<div className="grid gap-8 md:grid-cols-3">
							<div className="flex flex-col items-center space-y-4">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Home size={32} />
								</div>
								<h3 className="text-lg font-medium">{t("page.home.how-it-works.shelter-tab-register-title")}</h3>
								<p className="text-sm text-muted-foreground">{t("page.home.how-it-works.shelter-tab-register-description")}</p>
							</div>
							<div className="flex flex-col items-center space-y-4">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
									<PawPrint size={32} />
								</div>
								<h3 className="text-lg font-medium">{t("page.home.how-it-works.shelter-tab-list-title")}</h3>
								<p className="text-sm text-muted-foreground">{t("page.home.how-it-works.shelter-tab-list-description")}</p>
							</div>
							<div className="flex flex-col items-center space-y-4">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Users size={32} />
								</div>
								<h3 className="text-lg font-medium">{t("page.home.how-it-works.shelter-tab-connect-title")}</h3>
								<p className="text-sm text-muted-foreground">{t("page.home.how-it-works.shelter-tab-connect-description")}</p>
							</div>
						</div>
						<Link href="#" className={cn(buttonVariants(), "mt-8")}>
							{t("page.home.how-it-works.shelter-tab-button-title")}
						</Link>
					</TabsContent>
				</Tabs>
			</section>

			<section className="w-full max-w-6xl">
				<h2 className="sr-only">{t("page.home.statistics.title")}</h2>
				<div className="grid gap-6 rounded-lg bg-primary/10 p-8 text-center md:grid-cols-3">
					<div className="space-y-2">
						<h3 className="text-4xl font-bold">{t("page.home.statistics.success-adoptions-title")}</h3>
						<p className="text-lg text-muted-foreground">{t("page.home.statistics.success-adoptions-description")}</p>
					</div>
					<div className="space-y-2">
						<h3 className="text-4xl font-bold">{t("page.home.statistics.partners-title")}</h3>
						<p className="text-lg text-muted-foreground">{t("page.home.statistics.partners-description")}</p>
					</div>
					<div className="space-y-2">
						<h3 className="text-4xl font-bold">{t("page.home.statistics.available-title")}</h3>
						<p className="text-lg text-muted-foreground">{t("page.home.statistics.available-description")}</p>
					</div>
				</div>
			</section>

			<section className="w-full max-w-6xl space-y-8">
				<h2 className="text-center text-2xl font-semibold">{t("page.home.benefits.title")}</h2>

				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Shield className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">{t("page.home.benefits.safe-title")}</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">{t("page.home.benefits.safe-description")}</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Heart className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">{t("page.home.benefits.love-title")}</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">{t("page.home.benefits.love-description")}</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Gift className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">{t("page.home.benefits.companion-title")}</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">{t("page.home.benefits.companion-description")}</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Users className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">{t("page.home.benefits.impact-title")}</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">{t("page.home.benefits.impact-description")}</p>
						</CardContent>
					</Card>
				</div>
			</section>

			<section className="w-full max-w-6xl space-y-8 rounded-lg bg-muted/50 p-8">
				<h2 className="text-center text-2xl font-semibold">{t("page.home.advantages.title")}</h2>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
							<Medal size={32} />
						</div>
						<h3 className="text-lg font-medium">{t("page.home.advantages.partners-title")}</h3>
						<p className="text-muted-foreground">{t("page.home.advantages.partners-description")}</p>
					</div>

					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
							<Heart size={32} />
						</div>
						<h3 className="text-lg font-medium">{t("page.home.advantages.mission-title")}</h3>
						<p className="text-muted-foreground">{t("page.home.advantages.mission-description")}</p>
					</div>

					<div className="flex flex-col items-center space-y-4 text-center md:col-span-2 lg:col-span-1">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
							<Users size={32} />
						</div>
						<h3 className="text-lg font-medium">{t("page.home.advantages.community-title")}</h3>
						<p className="text-muted-foreground">{t("page.home.advantages.community-description")}</p>
					</div>
				</div>
			</section>

			<section className="w-full max-w-4xl space-y-8">
				<h2 className="text-center text-2xl font-semibold">{t("page.home.questions.title")}</h2>
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="question1">
						<AccordionTrigger>{t("page.home.questions.how-to-adopt-title")}</AccordionTrigger>
						<AccordionContent>{t("page.home.questions.how-to-adopt-description")}</AccordionContent>
					</AccordionItem>
					<AccordionItem value="question2">
						<AccordionTrigger>{t("page.home.questions.fee-title")}</AccordionTrigger>
						<AccordionContent>{t("page.home.questions.fee-description")}</AccordionContent>
					</AccordionItem>
					<AccordionItem value="question3">
						<AccordionTrigger>{t("page.home.questions.list-my-shelter-title")}</AccordionTrigger>
						<AccordionContent>{t("page.home.questions.list-my-shelter-description")}</AccordionContent>
					</AccordionItem>
					<AccordionItem value="question4">
						<AccordionTrigger>{t("page.home.questions.animal-breeds-title")}</AccordionTrigger>
						<AccordionContent>{t("page.home.questions.animal-breeds-description")}</AccordionContent>
					</AccordionItem>
					<AccordionItem value="question5">
						<AccordionTrigger>{t("page.home.questions.preparing-title")}</AccordionTrigger>
						<AccordionContent>{t("page.home.questions.preparing-description")}</AccordionContent>
					</AccordionItem>
				</Accordion>
			</section>

			<section className="w-full max-w-5xl rounded-lg bg-primary p-8 text-center text-primary-foreground">
				<h2 className="text-3xl font-bold">{t("page.home.difference.title")}</h2>
				<p className="mx-auto mt-4 max-w-2xl">{t("page.home.difference.description")}</p>
				<div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Link href="#" className={cn(buttonVariants({ variant: "secondary" }))}>
						{t("page.home.difference.animal-button-title")}
					</Link>
					<Link href="#" className={cn(buttonVariants({ variant: "secondary" }))}>
						{t("page.home.difference.shelter-button-title")}
					</Link>
				</div>
			</section>
		</main>
	);
};

export default Index;
