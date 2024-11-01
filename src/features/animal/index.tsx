"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { queryAnimal } from "@/queries/animal.query";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AnimalAdoptionSchema, AnimalAdoptionSchemaType } from "@/schemas/animal/animalAdopt.schema";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import FormInput from "@/components/formUi/formInput";

type Props = { animalId: string };

const Index = ({ animalId }: Props) => {
	const t = useTranslations();
	const animalAdoptionSchema = AnimalAdoptionSchema(t);

	const { data } = queryAnimal({ animalId: animalId });
	const [isAdoptModalOpened, setIsAdoptModalOpened] = useState<boolean>(false);

	const newPetForm = useForm<z.infer<typeof animalAdoptionSchema>>({
		defaultValues: {
			name: "",
			email: "",
		},
		resolver: zodResolver(animalAdoptionSchema),
	});

	const onNewAnimalSubmit = async (value: AnimalAdoptionSchemaType) => {
		const { name, email } = value;
		const formData = new FormData();

		formData.set("name", name);
		formData.set("email", email);

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/ses/post-adoption-message`, {
			method: "POST",
			body: formData,
		});

		const { ok } = response;
		if (ok) {
			const result = await response.json();
			const { success } = result;

			if (success) {
				// console.log("success");
			}
		}
	};

	if (data) {
		return (
			<>
				<Dialog
					onOpenChange={setIsAdoptModalOpened}
					open={isAdoptModalOpened}
					modal
					defaultOpen={isAdoptModalOpened}
				>
					<DialogContent className="h-full max-w-[720px]">
						<DialogHeader>
							<DialogTitle>ADOPT</DialogTitle>
						</DialogHeader>
						<div className="flex h-full items-center space-x-2 overflow-auto">
							<Form {...newPetForm}>
								<form
									onSubmit={newPetForm.handleSubmit(onNewAnimalSubmit)}
									className="h-full w-full space-y-8 px-2"
								>
									<FormInput
										control={newPetForm.control}
										label="Name"
										name="name"
										placeholder="Name"
									/>
									<FormInput
										control={newPetForm.control}
										label="Email"
										name="email"
										placeholder="Email"
									/>

									<Button type="submit">Submit</Button>
								</form>
							</Form>
						</div>
					</DialogContent>
				</Dialog>

				<div>
					<Image src={data.mainPhoto} width={40} height={100} alt="animal photo" />
					<span>{data.name}</span>
					<Button onClick={() => setIsAdoptModalOpened(!isAdoptModalOpened)}>ADOPT</Button>
				</div>
			</>
		);
	}

	return null;
};

export default Index;
