import { useEffect, useState } from "react";
import ImageUploading from "@/shared/shared/ImageUploading";

interface Props {
	onChange: (value: File[]) => void;
	defaultFiles?: File[];
	imagesCount: number;
}

const AvatarUploading = ({ onChange, imagesCount, defaultFiles = [] }: Props) => {
	const [imageFiles, setImageFiles] = useState<File[]>(defaultFiles || []);

	useEffect(() => {
		if (defaultFiles.length > 0) {
			setImageFiles(defaultFiles);
		}
	}, [defaultFiles]);

	// const handleAvatarsClick = (index?: number) => {
	// 	if (typeof index === "number" && imageFiles[index]) {
	// 		const newFileAvatars = imageFiles.filter((_, i) => i !== index);

	// 		setImageFiles(newFileAvatars);
	// 	}
	// };

	const oldImageChange = (file: File | undefined, index: number) => {
		const oldImageFiles = [...imageFiles];

		if (file) {
			oldImageFiles.splice(index, 1, file);
		} else {
			oldImageFiles.splice(index, 1);
		}

		const updateImageFiles = [...oldImageFiles];

		setImageFiles(updateImageFiles);
		onChange(updateImageFiles);
	};

	const defaultImageUpload = (file: File | undefined) => {
		if (file) {
			const newImageFiles = [...imageFiles, file];
			setImageFiles(newImageFiles);
			onChange(newImageFiles);
		} else {
			setImageFiles([]);
			onChange([]);
		}
	};
	return (
		<div>
			<div className={`m-auto mb-4 grid h-full w-full grid-cols-auto-fit-260-1fr justify-center gap-6`}>
				{imageFiles && imageFiles.length
					? imageFiles.map((previewAvatar, index) => (
							<ImageUploading
								key={`${previewAvatar.lastModified}_${index}`} // Unique key using lastModified and index
								defaultFile={previewAvatar}
								onChange={(file) => oldImageChange(file, index)}
								// onRemove={() => handleAvatarsClick(index)}
								className="group relative m-auto h-64 max-h-full w-52 max-w-full cursor-pointer border-2 border-slate-950 bg-slate-400"
							/>
						))
					: null}
				{imageFiles && imageFiles.length < imagesCount ? (
					<ImageUploading
						isUploadingImitation
						onChange={defaultImageUpload}
						className="group relative m-auto h-64 max-h-full w-52 max-w-full cursor-pointer border-2 border-slate-950 bg-slate-400"
					/>
				) : // <MultipleImageUploader onHandleChange={(files) => defaultImageUpload(files)} />
				null}
			</div>
		</div>
	);
};

export default AvatarUploading;
