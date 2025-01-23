"use client";

import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import LinkCard from "@/shared/shared/LinkCard";
import ContentLinkCard from "@/shared/shared/ContentLinkCard";
import BarChart from "@/shared/shared/BarChart";
import BasicCarousel from "@/shared/shared/BasicCarousel";

const chartData = [
	{ date: "2024-04-01", adopted: 222 },
	{ date: "2024-04-02", adopted: 97 },
	{ date: "2024-04-03", adopted: 167 },
	{ date: "2024-04-04", adopted: 242 },
	{ date: "2024-04-05", adopted: 373 },
	{ date: "2024-04-06", adopted: 301 },
	{ date: "2024-04-07", adopted: 245 },
	{ date: "2024-04-08", adopted: 309 },
	{ date: "2024-04-09", adopted: 59 },
	{ date: "2024-04-10", adopted: 261 },
	{ date: "2024-04-11", adopted: 327 },
	{ date: "2024-04-12", adopted: 292 },
	{ date: "2024-04-13", adopted: 342 },
	{ date: "2024-04-14", adopted: 137 },
	{ date: "2024-04-15", adopted: 120 },
	{ date: "2024-04-16", adopted: 138 },
	{ date: "2024-04-17", adopted: 346 },
	{ date: "2024-04-18", adopted: 364 },
	{ date: "2024-04-19", adopted: 243 },
	{ date: "2024-04-20", adopted: 89 },
	{ date: "2024-04-21", adopted: 137 },
	{ date: "2024-04-22", adopted: 224 },
	{ date: "2024-04-23", adopted: 138 },
	{ date: "2024-04-24", adopted: 387 },
	{ date: "2024-04-25", adopted: 215 },
];
const chartConfig = {
	adopted: {
		label: "Прилаштовано:",
		color: "var(--chart-1)",
	},
};

const animalData = [
	{ name: "Buddy", species: "Dog", age: 3, breed: "Corgi", sex: "boy" },
	{ name: "Whiskers", species: "Cat", age: 2, breed: "Corgi", sex: "boy" },
	{ name: "Rockies", species: "Cat", age: 5, breed: "Corgi", sex: "boy" },
	{ name: "Spike", species: "Dog", age: 5, breed: "Corgi", sex: "boy" },
	{ name: "Cubie", species: "Dog", age: 5, breed: "Corgi", sex: "boy" },
	{ name: "Buddy", species: "Dog", age: 3, breed: "Corgi", sex: "boy" },
	{ name: "Whiskers", species: "Cat", age: 2, breed: "Corgi", sex: "boy" },
	{ name: "Rockies", species: "Cat", age: 5, breed: "Corgi", sex: "boy" },
	{ name: "Spike", species: "Dog", age: 5, breed: "Corgi", sex: "boy" },
	{ name: "Cubie", species: "Dog", age: 5, breed: "Corgi", sex: "boy" },
	{ name: "Buddy", species: "Dog", age: 3, breed: "Corgi", sex: "boy" },
	{ name: "Whiskers", species: "Cat", age: 2, breed: "Corgi", sex: "boy" },
	{ name: "Rockies", species: "Cat", age: 5, breed: "Corgi", sex: "boy" },
	{ name: "Spike", species: "Dog", age: 5, breed: "Corgi", sex: "boy" },
	{ name: "Cubie", species: "Dog", age: 5, breed: "Corgi", sex: "boy" },
];

const Index = () => {
	return (
		<>
			<div className="mb-4 flex min-h-[400px] w-full gap-4 max-md:min-h-[600px] max-md:flex-col">
				<LinkCard className="max-md:min-h-[300px]" href="/" title="Стаття дня" buttonTitle="Читати" />
				<div className="flex flex-1 flex-col gap-4 max-md:flex-col">
					<LinkCard href="/shelters" title="Знайти притулок" buttonTitle="Знайти" />
					<LinkCard href="/animals" title="Забрати тваринку" buttonTitle="Забрати" />
				</div>
			</div>

			<ContentLinkCard
				className="mb-4"
				href="/"
				buttonTitle="Статистика"
				title="Прилаштовані тварини"
				description="Кількість прилаштованих тварин за останні 3 місяці"
			>
				<BarChart className="aspect-auto h-[250px] w-full" config={chartConfig} data={chartData} />
			</ContentLinkCard>

			<ContentLinkCard
				className="mb-4"
				href="/"
				buttonTitle="Притулки"
				title="Притулки"
				description="Список найбільших притулків"
			>
				<BasicCarousel
					className="w-full"
					data={animalData}
					options={{
						align: "start",
						loop: true,
						dragFree: true,
					}}
					itemClassName="basis-1/4 max-md:basis-1/3 max-sm:basis-1/2"
					renderSlide={(animal) => (
						<Card>
							<CardContent className="flex aspect-square items-center justify-center p-6">
								<span className="text-2xl font-semibold">{animal.name}</span>
							</CardContent>
						</Card>
					)}
				/>
			</ContentLinkCard>

			<ContentLinkCard
				className="mb-4"
				href="/"
				buttonTitle="Заводчики"
				title="Заводчики"
				description="Список найбільших заводчиків"
			>
				<BasicCarousel
					className="w-full"
					data={animalData}
					options={{
						align: "start",
						loop: true,
						dragFree: true,
					}}
					itemClassName="basis-1/4 max-md:basis-1/3 max-sm:basis-1/2"
					renderSlide={(animal) => (
						<Card className="overflow-hidden">
							<CardContent className="relative flex aspect-square items-center justify-center">
								<div className="absolute left-0 top-0 z-10 h-full w-full"></div>
								<img
									src="/corgi.jpg"
									alt="an"
									className="absolute left-0 top-0 z-0 h-full w-full object-cover"
								/>
							</CardContent>
							<CardFooter className="bg-[rgba(299,299,299,1)]">{animal.name}</CardFooter>
						</Card>

						// <Card className="bg-[url('/corgi.jpg')] bg-cover bg-center bg-no-repeat shadow-[inset_0_-24px_16px_rgba(0,0,0,0.9)]">
						// 		<CardContent className="flex aspect-square items-center justify-center p-6">
						// 			{/* <img src="/corgi.jpg" alt="an" /> */}
						// 			<span>{animal.age}</span>
						// 			<span>{animal.sex}</span>
						// 			<span>{animal.breed}</span>
						// 			<span>{animal.species}</span>
						// 			<span className="text-2xl font-semibold">{animal.name}</span>
						// 		</CardContent>
						// 	</Card>

						// <Card className="overflow-hidden">
						// 	<CardContent className="relative flex aspect-square items-center justify-center border-b-0">
						// 		<div className="absolute z-10 w-full h-full top-0 left-0 shadow-[inset_0_-10px_10px_0_rgba(299,299,299,1)]"></div>
						// 		<img
						// 			src="/corgi.jpg"
						// 			alt="an"
						// 			className="z-0 top-0 left-0 absolute h-full w-full object-cover"
						// 		/>
						// 	</CardContent>
						// 	<CardFooter className="bg-[rgba(299,299,299,1)] border-t-0">{animal.name}</CardFooter>
						// </Card>
					)}
				/>
			</ContentLinkCard>

			<ContentLinkCard
				className="mb-4"
				href="/"
				buttonTitle="Cтатті"
				title="Cтатті"
				description="Список популярних статтей"
			>
				<div className="grid grid-cols-2 justify-center gap-4 px-2 pt-4 max-md:grid-cols-1">
					<Card className="aspect-square flex-[0_1_45%]">
						<CardContent className="flex flex-1 items-center justify-center p-6">
							<span className="text-2xl font-semibold"></span>
						</CardContent>
					</Card>
					<Card className="aspect-square flex-[0_1_45%]">
						<CardContent className="flex flex-1 items-center justify-center p-6">
							<span className="text-2xl font-semibold"></span>
						</CardContent>
					</Card>
					<Card className="aspect-square flex-[0_1_45%]">
						<CardContent className="flex flex-1 items-center justify-center p-6">
							<span className="text-2xl font-semibold"></span>
						</CardContent>
					</Card>
					<Card className="aspect-square flex-[0_1_45%]">
						<CardContent className="flex flex-1 items-center justify-center p-6">
							<span className="text-2xl font-semibold"></span>
						</CardContent>
					</Card>
				</div>
			</ContentLinkCard>
		</>
	);
};

export default Index;
