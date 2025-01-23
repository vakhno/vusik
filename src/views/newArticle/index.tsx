"use client";
import { NewArticleSchemaType } from "@/entities/article/model/type/newArticleForm";
import { useToast } from "@/shared/ui/use-toast";
import NewArticleForm from "@/features/article/newArticle/ui/newArticleForm";
import { API_NEW_ARTICLE } from "@/routes";
import { categories } from "@/constants/categories";

const buildFormDataForNewArticle = (fields: NewArticleSchemaType): FormData => {
	const { title, image, category, text } = fields;

	const formData = new FormData();

	formData.append("title", title);
	formData.append("category", category);
	formData.append("text", text);

	if (image) {
		formData.append("mainPhoto", image);
	}

	return formData;
};

const createNewArticle = async (formData: FormData): Promise<boolean> => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_NEW_ARTICLE}`, {
			method: "POST",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			const data = await response.json();
			const { success } = data;

			if (success) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} catch (_) {
		return false;
	}
};

const Index = () => {
	const { toast } = useToast();

	const handleSuccessSubmitClick = async (fields: NewArticleSchemaType) => {
		const preparedFormData = buildFormDataForNewArticle(fields);

		const result = await createNewArticle(preparedFormData);
		if (result) {
			toast({
				title: "Success",
				description: `New article is created!`,
				variant: "default",
			});
		} else {
			toast({
				title: "Error",
				description: `Something went wrong while creating a new article!`,
				variant: "destructive",
			});
		}
	};

	return <NewArticleForm categories={categories} handleSuccessSubmitClick={handleSuccessSubmitClick} />;
};

export default Index;
