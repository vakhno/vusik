"use client";

// schemas
import NewAnimalSchema from "@/entities/animal/model/schema/adoptAnimalForm";
import NewAnimalSchemaType from "@/entities/animal/model/type/adoptAnimalForm";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// UI components
import { Button } from "@/shared/ui/button";
import { Form } from "@/shared/ui/form";
// form UI components
import FormInput from "@/shared/formUi/formInput";
import { useTranslations } from "next-intl";

const Index = () => {
	const t = useTranslations();
	const newAnimalSchema = NewAnimalSchema(t);

	const newPetForm = useForm<z.infer<typeof newAnimalSchema>>({
		defaultValues: {
			name: "",
			email: "",
		},
		resolver: zodResolver(newAnimalSchema),
	});

	const onNewAnimalSubmit = async (value: NewAnimalSchemaType) => {
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

	return (
		<Form {...newPetForm}>
			<form onSubmit={newPetForm.handleSubmit(onNewAnimalSubmit)} className="h-full w-full space-y-8 px-2">
				<FormInput control={newPetForm.control} label="Name" name="name" placeholder="Name" />
				<FormInput control={newPetForm.control} label="Email" name="email" placeholder="Email" />
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
};

export default Index;
