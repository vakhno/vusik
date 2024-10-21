// react
import { useEffect, useState } from "react";
// schemas
import { EditUserSchema, EditUserSchemaType } from "@/schemas/user/userEdit.schema";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUploading from "@/components/shared/ImageUploading";
// UI components
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
// form UI components
import FormInput from "@/components/formUi/formInput";

type Props = {
	modalTitle: string;
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	handleSuccessSubmitClick: (value: EditUserSchemaType) => void;
	submitButtonTitle: string;
	deleteButtonTitle: string;
	closeButtonTitle: string;
	mainPhotoValue?: string;
	nameValue: string;
	facebookValue?: string;
	instagramValue?: string;
	telegramValue?: string;
	twitterValue?: string;
	youtubeValue?: string;
};

const EditProfileModal = ({
	modalTitle,
	isOpen,
	setIsOpen,
	handleSuccessSubmitClick,
	submitButtonTitle,
	deleteButtonTitle,
	closeButtonTitle,
	mainPhotoValue,
	nameValue,
	facebookValue,
	instagramValue,
	telegramValue,
	twitterValue,
	youtubeValue,
}: Props) => {
	const newAnimalSchema = EditUserSchema();
	const [defaultMainImage, setDefaultMainImage] = useState<File | null>(null);
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

	const newPetForm = useForm<z.infer<typeof newAnimalSchema>>({
		defaultValues: {
			avatar: defaultMainImage || undefined,
			name: nameValue || "",
			facebook: facebookValue || "",
			instagram: instagramValue || "",
			telegram: telegramValue || "",
			twitter: twitterValue || "",
			youtube: youtubeValue || "",
		},
		resolver: zodResolver(newAnimalSchema),
	});

	const onNewAnimalSubmit = async (fields: z.infer<typeof newAnimalSchema>) => {
		handleSuccessSubmitClick(fields);
	};

	useEffect(() => {
		(async () => {
			if (mainPhotoValue) {
				const mainPhotoFile = (await mainPhotoUrlToFile(mainPhotoValue)) as File | null;
				if (mainPhotoFile) {
					setDefaultMainImage(mainPhotoFile);
					newPetForm.setValue("avatar", mainPhotoFile);
				}
			}
		})();
	}, []);

	const mainPhotoChange = (file: File) => {
		newPetForm.setValue("avatar", file);
	};

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen} modal defaultOpen={isOpen}>
			<DialogContent className="h-full max-w-[720px]">
				<DialogHeader>
					<DialogTitle>{modalTitle}</DialogTitle>
				</DialogHeader>
				<div className="flex h-full items-center space-x-2 overflow-auto">
					<Form {...newPetForm}>
						<form
							onSubmit={newPetForm.handleSubmit(onNewAnimalSubmit)}
							className="h-full w-full space-y-8 px-2"
						>
							<ImageUploading
								// defaultPreviewImage={mainPhotoValue}
								defaultFile={defaultMainImage}
								onChange={mainPhotoChange}
								className="m-auto h-96 max-h-full w-80 max-w-full"
							/>

							<FormInput control={newPetForm.control} label="Name" name="name" placeholder="Name" />

							<FormInput
								control={newPetForm.control}
								label="Facebook"
								name="facebook"
								placeholder="Facebook URL"
							/>

							<FormInput
								control={newPetForm.control}
								label="Instagram"
								name="instagram"
								placeholder="Instagram URL"
							/>

							<FormInput
								control={newPetForm.control}
								label="Telegram"
								name="telegram"
								placeholder="Telegram URL"
							/>

							<FormInput
								control={newPetForm.control}
								label="Twitter"
								name="twitter"
								placeholder="Twitter URL"
							/>

							<FormInput
								control={newPetForm.control}
								label="Youtube"
								name="youtube"
								placeholder="Youtube URL"
							/>

							<div className="flex justify-between">
								<Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
									{closeButtonTitle}
								</Button>

								<Button type="button" variant="destructive" onClick={() => {}}>
									{deleteButtonTitle}
								</Button>
								<Button type="submit">{submitButtonTitle}</Button>
							</div>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EditProfileModal;
