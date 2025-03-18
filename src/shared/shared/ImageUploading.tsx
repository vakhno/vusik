import { useEffect, useRef, useState } from "react";
// next tools
import Image from "next/image";
// constants
import { imageFileTypesAsString } from "@/shared/constants/files";
// libs
import { cn } from "@/shared/lib/utils";

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

interface Props {
	onChange?: (value: File | undefined) => void;
	isUploadingImitation?: boolean;
	className?: string;
	// defaultFile can be file or string if we want to pass image from S3 bucket
	defaultFile?: File | string;
}

const ImageUploading = ({ onChange, isUploadingImitation = false, className, defaultFile }: Props) => {
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [imageFile, setImageFile] = useState<null | File>(null);
	const [isDragEnter, setIsDragEnter] = useState<boolean>(false);

	const imageInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const cleanUp = () => {
			previewImage && window.URL.revokeObjectURL(previewImage);
		};

		if (imageFile) {
			const urlFile = window.URL.createObjectURL(imageFile);

			setPreviewImage(urlFile);
		}

		return cleanUp;
	}, [imageFile]);

	useEffect(() => {
		(async () => {
			if (defaultFile) {
				if (typeof defaultFile === "string") {
					const urlFile = await mainPhotoUrlToFile(defaultFile);
					setImageFile(urlFile);
					setPreviewImage(defaultFile);
				} else {
					setImageFile(defaultFile);
				}
			}
		})();
	}, [defaultFile]);

	const handleImageAreaClick = () => {
		if (imageFile) {
			setImageFile(null);
			setPreviewImage(null);

			if (imageInputRef?.current && imageInputRef?.current?.value) {
				imageInputRef.current.value = "";
			}

			onChange && onChange(undefined);
		} else {
			imageInputRef && imageInputRef?.current && imageInputRef?.current.click();
		}
	};

	const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e?.currentTarget && e?.currentTarget?.files && e?.currentTarget?.files[0];

		if (file) {
			if (!isUploadingImitation) {
				setImageFile(file);
			}
			onChange && onChange(file);
		}
	};

	const handleImageAreaDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();

		const file = e?.dataTransfer?.files && e?.dataTransfer?.files[0];

		if (file) {
			if (!isUploadingImitation) {
				setImageFile(file);
			}
			setIsDragEnter(false);
			onChange && onChange(file);
		}
	};

	const handleImageAreaDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();

		setIsDragEnter(false);
	};

	const handleImageAreaDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();

		setIsDragEnter(true);
	};

	const handleImageAreaDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	return (
		<>
			<button
				type="button"
				className={cn(
					"group relative cursor-pointer border-2 border-slate-950 bg-slate-200",
					className,
					isDragEnter ? "border-solid" : "border-dashed",
				)}
				onClick={handleImageAreaClick}
			>
				<div
					className="absolute left-0 top-0 h-full w-full"
					onDrop={handleImageAreaDrop}
					onDragLeave={handleImageAreaDragLeave}
					onDragEnter={handleImageAreaDragEnter}
					onDragOver={handleImageAreaDragOver}
				>
					{previewImage ? (
						<Image
							width={26}
							height={26}
							alt=""
							src={previewImage}
							className="pointer-events-none h-full w-full group-hover:blur-md"
						/>
					) : (
						<Image
							width={26}
							height={26}
							alt=""
							src="/icons/default-profile-icon.svg"
							className="pointer-events-none absolute top-0 h-full w-full items-center justify-center p-4 group-hover:hidden"
						/>
					)}
					{previewImage ? (
						<Image
							width={26}
							height={26}
							alt=""
							src="/icons/close-circle-icon.svg"
							className="pointer-events-none invisible absolute top-0 z-10 h-full w-full items-center justify-center p-4 group-hover:visible"
						/>
					) : (
						<Image
							width={26}
							height={26}
							alt=""
							src="/icons/plus-circle-icon.svg"
							className="pointer-events-none invisible absolute top-0 z-10 h-full w-full items-center justify-center p-4 group-hover:visible"
						/>
					)}
				</div>
			</button>
			<input
				hidden
				type="file"
				ref={imageInputRef}
				onChange={handleFileInputChange}
				accept={imageFileTypesAsString}
			/>
		</>
	);
};

export default ImageUploading;
