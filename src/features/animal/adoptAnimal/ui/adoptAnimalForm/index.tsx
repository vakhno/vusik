"use client";

// features
import AdoptSchemaType from "@/features/animal/adoptAnimal/model/type/adoptFormSchema";
import AdopAnimalFields from "@/features/animal/adoptAnimal/ui/adoptAnimalForm/adoptAnimalsFields";

const Index = () => {
	const onHandleSubmit = async (value: AdoptSchemaType) => {
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

	return <AdopAnimalFields onFormSubmit={onHandleSubmit} />;
};

export default Index;
