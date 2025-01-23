import React, { useState, useRef } from "react";
import Image from "next/image";
import { imageFileTypesAsString } from "@/constants/files";

type Props = {
	onHandleChange?: (file: File[]) => void;
};

const MultipleImageUploader = ({ onHandleChange }: Props) => {
	const [isDragEnter, setIsDragEnter] = useState<boolean>(false);
	const avatarInputRef = useRef<HTMLInputElement>(null);

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const files = Array.from(e?.dataTransfer?.files && e?.dataTransfer?.files);
		if (onHandleChange) {
			onHandleChange(files);
		}
		if (avatarInputRef.current) {
			avatarInputRef.current.value = "";
		}
		setIsDragEnter(false);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragEnter(false);
	};

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragEnter(true);
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const handleAvatarsClick = () => {
		avatarInputRef?.current?.click();
	};

	const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.currentTarget.files;
		if (files && files.length > 0) {
			const newFileAvatars = Array.from(files);
			if (onHandleChange) {
				onHandleChange(newFileAvatars);
			}
		}
		if (avatarInputRef.current) {
			avatarInputRef.current.value = "";
		}
	};

	return (
		<>
			<div
				className={`${isDragEnter ? "border-solid" : "border-dashed"} group relative m-auto h-64 w-52 cursor-pointer border-2 border-slate-950 bg-slate-200`}
				onClick={() => handleAvatarsClick()}
				onDrop={handleDrop}
				onDragLeave={handleDragLeave}
				onDragEnter={handleDragEnter}
				onDragOver={handleDragOver}
			>
				<Image
					width={26}
					height={26}
					src="/icons/default-profile-icon.svg"
					alt="Add avatar icon"
					className="pointer-events-none absolute h-full w-full items-center justify-center group-hover:hidden"
				/>
				<Image
					width={26}
					height={26}
					src="/icons/plus-circle-icon.svg"
					alt="Add avatar icon"
					className="absolute hidden h-full w-full items-center justify-center p-4 group-hover:flex"
				/>
			</div>

			<input
				hidden
				type="file"
				ref={avatarInputRef}
				onChange={handleFileInputChange}
				accept={imageFileTypesAsString}
				multiple
			/>
		</>
	);
};

export default MultipleImageUploader;
