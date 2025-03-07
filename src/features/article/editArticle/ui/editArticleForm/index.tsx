"use client";
import { queryArticle } from "@/entities/article/model/query/queryById";

import { NewArticleSchemaType } from "@/entities/article/model/type/newArticleForm";
import { useToast } from "@/shared/ui/use-toast";
import NewArticleForm from "@/features/article/editArticle/ui/editArticleForm/formFields";
import { categories } from "@/constants/categories";
import { Types } from "mongoose";

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
		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/article/put-edit-article`, {
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

type Props = {
	articleId: Types.ObjectId;
};

const Index = ({ articleId }: Props) => {
	const { data: article } = queryArticle({ articleId: articleId });
	// console.log("DATA", data);
	if (article) {
		// const { article } = data;
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

		return (
			<NewArticleForm
				article={article}
				categories={categories}
				handleSuccessSubmitClick={handleSuccessSubmitClick}
			/>
		);
	}
};

export default Index;
