// shared
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
// lucide-react
import { SearchIcon, PawPrint, Heart, Home, Users, Medal, Calendar, Shield, Gift } from "lucide-react";

const Index = () => {
	return (
		<main className="flex flex-col items-center space-y-16 px-6 py-12">
			<section className="w-full max-w-6xl space-y-6 text-center" id="hero">
				<h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
					Find, Love, and <span className="text-primary">Adopt</span> Your New Best Friend
				</h1>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">Thousands of pets are waiting for a second chance. Start your journey of unconditional love today with our trusted animal shelters.</p>
				<div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
					<Button size="lg" className="gap-2">
						<PawPrint size={18} />
						Explore Animals
					</Button>
					<Button variant="outline" size="lg" className="gap-2">
						<Home size={18} />
						List Your Shelter
					</Button>
				</div>
			</section>

			<section className="w-full max-w-4xl space-y-8 text-center" id="how-it-works" aria-labelledby="how-it-works-heading">
				<h2 id="how-it-works-heading" className="text-2xl font-semibold">
					How It Works
				</h2>
				<Tabs defaultValue="adopt" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="adopt">Adopt a Pet</TabsTrigger>
						<TabsTrigger value="shelter">Join as Shelter</TabsTrigger>
					</TabsList>

					<TabsContent value="adopt" className="mt-6">
						<div className="grid gap-8 md:grid-cols-3">
							<div className="flex flex-col items-center space-y-4">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
									<SearchIcon size={32} />
								</div>
								<h3 className="text-lg font-medium">Search</h3>
								<p className="text-sm text-muted-foreground">Browse our database of available pets from trusted shelters.</p>
							</div>
							<div className="flex flex-col items-center space-y-4">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Calendar size={32} />
								</div>
								<h3 className="text-lg font-medium">Meet</h3>
								<p className="text-sm text-muted-foreground">Schedule a visit to meet your potential new family member.</p>
							</div>
							<div className="flex flex-col items-center space-y-4">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Heart size={32} />
								</div>
								<h3 className="text-lg font-medium">Adopt</h3>
								<p className="text-sm text-muted-foreground">Complete the adoption process and welcome them home.</p>
							</div>
						</div>
						<Button className="mt-8">Start Your Search</Button>
					</TabsContent>

					<TabsContent value="shelter" className="mt-6">
						<div className="grid gap-8 md:grid-cols-3">
							<div className="flex flex-col items-center space-y-4">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Home size={32} />
								</div>
								<h3 className="text-lg font-medium">Register</h3>
								<p className="text-sm text-muted-foreground">Sign up your shelter with our simple verification process.</p>
							</div>
							<div className="flex flex-col items-center space-y-4">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
									<PawPrint size={32} />
								</div>
								<h3 className="text-lg font-medium">List Pets</h3>
								<p className="text-sm text-muted-foreground">Add photos and information about your available animals.</p>
							</div>
							<div className="flex flex-col items-center space-y-4">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Users size={32} />
								</div>
								<h3 className="text-lg font-medium">Connect</h3>
								<p className="text-sm text-muted-foreground">Get matched with potential adopters in your area.</p>
							</div>
						</div>
						<Button className="mt-8">Register Your Shelter</Button>
					</TabsContent>
				</Tabs>
			</section>

			<section className="w-full max-w-6xl" id="statistics" aria-labelledby="statistics-heading">
				<h2 id="statistics-heading" className="sr-only">
					Our Impact
				</h2>
				<div className="grid gap-6 rounded-lg bg-primary/10 p-8 text-center md:grid-cols-3">
					<div className="space-y-2">
						<h3 className="text-4xl font-bold">50,000+</h3>
						<p className="text-lg text-muted-foreground">Successful Adoptions</p>
					</div>
					<div className="space-y-2">
						<h3 className="text-4xl font-bold">500+</h3>
						<p className="text-lg text-muted-foreground">Partner Shelters</p>
					</div>
					<div className="space-y-2">
						<h3 className="text-4xl font-bold">10,000+</h3>
						<p className="text-lg text-muted-foreground">Available Pets</p>
					</div>
				</div>
			</section>

			{/* <section className="w-full max-w-6xl rounded-lg bg-primary/5 p-8" id="pet-finder" aria-labelledby="pet-finder-heading">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h2 id="pet-finder-heading" className="text-2xl font-semibold">Not Sure Which Pet Is Right For You?</h2>
          <p className="text-muted-foreground">Answer a few questions about your lifestyle and preferences, and we'll help you find the perfect match.</p>
          <Button size="lg" className="gap-2">
            <PawPrint size={18} />
            Take Our Pet Matching Quiz
          </Button>
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <Badge variant="outline" className="text-xs">Considers your space</Badge>
            <Badge variant="outline" className="text-xs">Activity level</Badge>
            <Badge variant="outline" className="text-xs">Time commitment</Badge>
            <Badge variant="outline" className="text-xs">Experience level</Badge>
            <Badge variant="outline" className="text-xs">Family situation</Badge>
          </div>
        </div>
      </section> */}

			<section className="w-full max-w-6xl space-y-8" id="adoption-benefits" aria-labelledby="adoption-benefits-heading">
				<h2 id="adoption-benefits-heading" className="text-center text-2xl font-semibold">
					Benefits of Pet Adoption
				</h2>

				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Shield className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">Save a Life</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Every year, millions of adoptable pets are euthanized due to shelter overcrowding. By adopting, you are not just finding a new companion; you are saving a life and creating space for another animal in need.</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Heart className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">Unconditional Love</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Adopted pets often show remarkable gratitude and loyalty. Many adopters report that their rescue pets seem to understand they have been given a second chance, creating a special bond of trust and affection.</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Gift className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">Ready-to-Love Companions</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Most shelter pets come vaccinated, spayed/neutered, and often with basic training. Many are already house-trained adults, skipping the challenging puppy or kitten phases while still offering years of companionship.</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Users className="h-5 w-5 text-primary" />
								<CardTitle className="text-lg">Community Impact</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Adopting supports organizations working to improve animal welfare in your community. Your adoption fees help fund rescue operations, medical care, and education programs that benefit all animals.</p>
						</CardContent>
					</Card>
				</div>
			</section>

			<section className="w-full max-w-6xl space-y-8 rounded-lg bg-muted/50 p-8" id="about" aria-labelledby="about-heading">
				<h2 id="about-heading" className="text-center text-2xl font-semibold">
					Why Choose Our Platform
				</h2>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
							<Medal size={32} />
						</div>
						<h3 className="text-lg font-medium">Trusted Partners</h3>
						<p className="text-muted-foreground">We partner exclusively with verified shelters and rescue organizations committed to animal welfare.</p>
					</div>

					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
							<Heart size={32} />
						</div>
						<h3 className="text-lg font-medium">Mission Driven</h3>
						<p className="text-muted-foreground">Our mission is to reduce euthanasia rates and find loving homes for every adoptable animal.</p>
					</div>

					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
							<Users size={32} />
						</div>
						<h3 className="text-lg font-medium">Community Focused</h3>
						<p className="text-muted-foreground">Join a passionate community of animal lovers sharing advice, stories, and support.</p>
					</div>
				</div>
			</section>

			{/* <section className="w-full max-w-6xl" id="location-banner">
				<Card className="overflow-hidden border-none bg-primary text-primary-foreground">
					<CardContent className="p-0">
						<div className="grid md:grid-cols-2">
							<div className="flex flex-col justify-center space-y-4 p-8">
								<h2 className="text-2xl font-semibold">Find Shelters Near You</h2>
								<p>We partner with shelters and rescue organizations nationwide to help you find the perfect pet close to home.</p>
								<div className="flex flex-col gap-3 pt-2 sm:flex-row">
									<div className="relative flex-1">
										<MapPin className="absolute left-3 top-3 h-4 w-4" />
										<Input type="text" placeholder="Enter ZIP code" className="bg-primary-foreground pl-10 text-primary" />
									</div>
									<Button variant="secondary" className="bg-background text-foreground hover:bg-background/90">
										Search
									</Button>
								</div>
								<p className="text-xs opacity-80">Over 500 shelter locations across all 50 states</p>
							</div>
							<div className="hidden items-center justify-center bg-muted md:flex">
								<div className="p-6">
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												<MapPin className="h-6 w-6" />
											</TooltipTrigger>
											<TooltipContent>
												<p>Find shelters on the map</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</section> */}

			<section className="w-full max-w-4xl space-y-8" id="faq" aria-labelledby="faq-heading">
				<h2 id="faq-heading" className="text-center text-2xl font-semibold">
					Frequently Asked Questions
				</h2>
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="question1">
						<AccordionTrigger>How do I adopt an animal?</AccordionTrigger>
						<AccordionContent>Simply browse the available animals, schedule a visit with the shelter, and complete the adoption paperwork provided by the shelter. Our platform makes it easy to search by location, species, age, and other criteria to find your perfect match.</AccordionContent>
					</AccordionItem>
					<AccordionItem value="question2">
						<AccordionTrigger>Is there an adoption fee?</AccordionTrigger>
						<AccordionContent>Adoption fees vary depending on the shelter and help cover vaccinations, spay/neuter surgeries, and basic care for the animals. These fees ensure animals receive proper veterinary care before joining your family and support the shelters continued rescue efforts.</AccordionContent>
					</AccordionItem>
					<AccordionItem value="question3">
						<AccordionTrigger>How can I list my shelter?</AccordionTrigger>
						<AccordionContent>Click the List Your Shelter button and complete the simple registration form. Once approved, you can start posting available animals. Our verification process helps maintain trust and quality standards across our platform.</AccordionContent>
					</AccordionItem>
					<AccordionItem value="question4">
						<AccordionTrigger>What animals are available for adoption?</AccordionTrigger>
						<AccordionContent>Our platform features dogs, cats, rabbits, birds, small mammals, reptiles, and occasionally farm animals. The availability varies based on the current shelter populations in your area.</AccordionContent>
					</AccordionItem>
					<AccordionItem value="question5">
						<AccordionTrigger>How do I prepare for my new pet?</AccordionTrigger>
						<AccordionContent>We offer comprehensive guides for new pet parents on our resources page. These include checklists for supplies, tips for introducing pets to your home, training resources, and more. Our shelter partners can also provide specific advice for your new family member.</AccordionContent>
					</AccordionItem>
				</Accordion>
			</section>

			<section className="w-full max-w-5xl rounded-lg bg-primary p-8 text-center text-primary-foreground" id="cta" aria-labelledby="cta-heading">
				<h2 id="cta-heading" className="text-3xl font-bold">
					Ready to Find Your Perfect Companion?
				</h2>
				<p className="mx-auto mt-4 max-w-2xl">Every day you wait is another day a pet spends without a family. Start your search today and change a life forever.</p>
				<div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
					<Button variant="secondary" size="lg" className="gap-2">
						<PawPrint size={18} />
						Find a Pet
					</Button>
				</div>
			</section>
		</main>
	);
};

export default Index;
