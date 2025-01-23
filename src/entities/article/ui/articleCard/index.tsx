import Image from "next/image";
import { AspectRatio } from "@/shared/ui/aspect-ratio";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { useState, MouseEvent } from "react";
import { ArticleType } from "@/entities/article/model/type";
// import { NewArticleSchemaType } from "@/entities/article/model/type/newArticleForm";
// import { useToast } from "@/shared/ui/use-toast";
import Link from "next/link";

type Props = {
	article: ArticleType;
	isEditable?: boolean;
};

// const buildFormDataForNewArticle = (fields: NewArticleSchemaType): FormData => {
// 	const { title, category, text, image } = fields;

// 	const formData = new FormData();

// 	formData.append("title", title);
// 	formData.append("category", category);
// 	formData.append("text", text);

// 	if (image) {
// 		formData.append("image", image);
// 	}

// 	return formData;
// };

const Index = ({ article, isEditable = false }: Props) => {
	// const { toast } = useToast();
	const [isEditArticleOpened, setIsEditArticleOpened] = useState<boolean>(false);

	const handleEditClick = (e: MouseEvent<HTMLImageElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsEditArticleOpened(!isEditArticleOpened);
	};

	// const handleSuccessDeleteClick = async (article: ArticleType) => {
	// 	const formData = new FormData();

	// 	formData.append("articleId", article._id);
	// 	formData.append("userId", String(article.author));

	// 	const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/article/delete-article`, {
	// 		method: "DELETE",
	// 		body: formData,
	// 	});
	// 	const { ok } = response;
	// 	if (ok) {
	// 		// const data = await response.json();
	// 		// const { success } = data;
	// 	}
	// };

	// const handleSuccessSubmitClick = async (fields: NewArticleSchemaType) => {
	// 	const formData = buildFormDataForNewArticle(fields);
	// 	formData.append("id", article._id);
	// 	const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/article/put-edit-article`, {
	// 		method: "PUT",
	// 		body: formData,
	// 	});

	// 	const { ok } = response;
	// 	if (ok) {
	// 		const data = await response.json();
	// 		const { success } = data;

	// 		if (success) {
	// 			toast({
	// 				title: "Success",
	// 				description: `New article is created!`,
	// 				variant: "default",
	// 			});
	// 		} else {
	// 			toast({
	// 				title: "Error",
	// 				description: `Something went wrong while creating a new article!`,
	// 				variant: "destructive",
	// 			});
	// 		}
	// 	}
	// };
	// console.log("article", article);
	return (
		<>
			{isEditArticleOpened ? (
				<></>
			) : // <AddNewArticleModal
			// 	isOpen={isEditArticleOpened}
			// 	setIsOpen={setIsEditArticleOpened}
			// 	isDeletable={true}
			// 	deleteButtonTitle={"Delete"}
			// 	handleSuccessDeleteClick={handleSuccessDeleteClick}
			// 	handleSuccessSubmitClick={(fields) => handleSuccessSubmitClick(fields)}
			// 	article={article}
			// 	titleValue={article.title}
			// 	textValue={article.text}
			// 	imageValue={article.image}
			// 	categoryValue={article.category}
			// />
			null}
			<Card className="w-full bg-secondary">
				<Link href={`/article/${article._id}`}>
					<CardContent className="relative h-full w-full overflow-hidden p-2">
						{isEditable ? (
							<Image
								width={40}
								height={40}
								alt=""
								src="/icons/edit.svg"
								onClick={(e: MouseEvent<HTMLImageElement>) => handleEditClick(e)}
								className="absolute right-0 top-0 z-10 cursor-pointer"
							/>
						) : null}
						<div className="grid grid-cols-1 lg:grid-cols-2">
							<AspectRatio ratio={5 / 3} className="relative h-full w-full">
								{article?.image ? (
									<Image
										src={article.image}
										alt="Article photo"
										fill
										className="h-full w-full object-cover"
									/>
								) : null}
							</AspectRatio>
							<div className="flex flex-col justify-between p-4">
								<div className="flex flex-col">
									<h2>{article.title}</h2>
								</div>
								<Button>More</Button>
							</div>
						</div>
					</CardContent>
				</Link>
			</Card>
		</>
	);
};

export default Index;
