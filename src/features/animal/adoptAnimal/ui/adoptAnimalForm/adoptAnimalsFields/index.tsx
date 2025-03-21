"use client";

// features
import AdoptSchema from "@/features/animal/adoptAnimal/model/schema/adoptForm";
import AdoptSchemaType from "@/features/animal/adoptAnimal/model/type/adoptFormSchema";
// react-hook-form
import { useForm } from "react-hook-form";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
// shared
import { Button } from "@/shared/ui/button";
import { Form } from "@/shared/ui/form";
import FormInput from "@/shared/formUi/formInput";
// next-intl
import { useTranslations } from "next-intl";

type Props = {
	onFormSubmit: (value: AdoptSchemaType) => void;
};

const Index = ({ onFormSubmit }: Props) => {
	const t = useTranslations();
	const adoptSchema = AdoptSchema(t);

	const form = useForm<AdoptSchemaType>({
		defaultValues: {
			name: "",
			email: "",
		},
		resolver: zodResolver(adoptSchema),
	});

	const { control } = form;

	const onHandleSubmit = (value: AdoptSchemaType) => {
		onFormSubmit(value);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onHandleSubmit)} className="h-full w-full space-y-8 px-2">
				<FormInput control={control} label="Name" name="name" placeholder="Name" />
				<FormInput control={control} label="Email" name="email" placeholder="Email" />
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
};

export default Index;
