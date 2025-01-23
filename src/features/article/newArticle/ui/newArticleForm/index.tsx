"use client";
import React, { useState, useEffect } from "react";
import { NewArticleSchema } from "@/entities/article/model/schema/newArticleForm";
import { NewArticleSchemaType } from "@/entities/article/model/type/newArticleForm";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shared/ui/form";
import ImageUploading from "@/shared/shared/ImageUploading";
import { Button } from "@/shared/ui/button";
import FormInput from "@/shared/formUi/formInput";
import { ArticleType } from "@/entities/article/model/type";
// import { useTranslations } from "next-intl";
import FormSingleSelect from "@/shared/formUi/formSingleSelect";

type Props = {
	isDeletable?: boolean;
	deleteButtonTitle?: string;
	handleSuccessDeleteClick?: (value: ArticleType) => void;
	article?: ArticleType;
	handleSuccessSubmitClick: (value: NewArticleSchemaType) => void;
	categories: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

const mainPhotoUrlToFile = async (url: string): Promise<File | null> => {
	try {
		const response = await fetch(url);
		const { ok } = response;

		if (ok) {
			const contentType = response.headers.get("Content-Type");

			if (contentType === "image/jpeg" || contentType === "image/png" || contentType === "image/webp") {
				const extension = contentType.split("/").pop();
				const fileName = (url.split("/").pop() || "image") + `.${extension}`;
				const blob = await response.blob();
				const file = new File([blob], fileName, { type: contentType });

				return file;
			} else {
				return null;
			}
		} else {
			return null;
		}
	} catch (_) {
		return null;
	}
};

const AddNewArticleModal = ({
	isDeletable = false,
	deleteButtonTitle,
	handleSuccessDeleteClick,
	handleSuccessSubmitClick,
	article,
	categories,
}: Props) => {
	// const t = useTranslations();
	const newArticleSchema = NewArticleSchema();

	const [defaultMainImage, setDefaultMainImage] = useState<File>();
	const newArticleForm = useForm<z.infer<typeof newArticleSchema>>({
		defaultValues: {
			image: defaultMainImage || undefined,
			title: article?.title || "",
			category: article?.category || "",
			text: article?.text || "",
		},
		resolver: zodResolver(newArticleSchema),
	});

	const onNewAnimalSubmit = async (fields: z.infer<typeof newArticleSchema>) => {
		handleSuccessSubmitClick(fields);
	};

	const imageChange = (file: File | undefined) => {
		newArticleForm.setValue("image", file);
	};

	useEffect(() => {
		(async () => {
			if (article?.image) {
				const mainPhotoFile = (await mainPhotoUrlToFile(article?.image)) as File | null;
				if (mainPhotoFile) {
					setDefaultMainImage(mainPhotoFile);
					newArticleForm.setValue("image", mainPhotoFile);
				}
			}
		})();
	}, []);

	return (
		<>
			<h2>Create new article</h2>
			<div className="flex h-full items-center space-x-2 overflow-auto">
				<Form {...newArticleForm}>
					<form
						onSubmit={newArticleForm.handleSubmit(onNewAnimalSubmit)}
						className="h-full w-full space-y-8 px-2"
					>
						<ImageUploading
							onChange={imageChange}
							defaultFile={defaultMainImage}
							className="m-auto h-96 max-h-full w-80 max-w-full"
						/>

						<FormInput control={newArticleForm.control} label="Title" name="title" placeholder="Title" />

						{/* <FormInput
							control={newArticleForm.control}
							label="Category"
							name="category"
							placeholder="Category"
						/> */}

						<FormSingleSelect
							control={newArticleForm.control}
							name={"category"}
							optionList={categories}
							placeholder={"Select an animal category"}
							formLabel={"Category"}
						/>

						<FormInput control={newArticleForm.control} label="Text" name="text" placeholder="Text" />

						<div className="flex justify-between">
							{/* <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
								Close
							</Button> */}
							{isDeletable ? (
								<Button
									type="button"
									variant="destructive"
									onClick={() =>
										article && handleSuccessDeleteClick && handleSuccessDeleteClick(article)
									}
								>
									{deleteButtonTitle}
								</Button>
							) : null}
							<Button type="submit">Submit</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
};

export default AddNewArticleModal;
