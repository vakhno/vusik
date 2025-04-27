import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Upload, X, File as FileIcon, Check, Trash } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export type PreviewFile = {
	file: File;
	id: string;
	preview?: string;
};

export type Props = {
	isMultiple?: boolean;
	maxFiles?: number;
	maxSizeMB?: number;
	accept?: string[];
	onChange?: (files: File | File[] | undefined) => void;
	className?: string;
	defaultFile?: File | string | string[] | File[];
};

const convertToFile = async (url: string): Promise<File | null> => {
	const toFile = async (str: string): Promise<File | null> => {
		try {
			const response = await fetch(str);
			const { ok } = response;

			if (ok) {
				const blob = await response.blob();
				const filename = str.split("/").pop() || "file";
				const file = new File([blob], filename, { type: blob.type });

				return file;
			}

			return null;
		} catch (_) {
			return null;
		}
	};

	return toFile(url);
};

const isFileAccepted = (file: File, accept: string[]): boolean => {
	const isAccepted = (fileType: string) =>
		accept.some((type) => {
			if (type === "*/*") return true;
			if (type.endsWith("/*")) {
				const category = type.split("/")[0];
				return fileType.startsWith(`${category}/`);
			}
			return type === fileType;
		});

	const fileType = file.type;

	return isAccepted(fileType);
};

const generatePreviewFile = (file: File): PreviewFile => {
	const preview = URL.createObjectURL(file);

	return {
		file: file,
		id: `file-${Date.now()}-${Math.random().toString(36)}`,
		preview: preview,
	};
};

const generateFileSizeLabel = (bytes: number): string => {
	if (bytes < 1024) {
		return `${bytes} bytes`;
	}
	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(1)} KB`;
	}
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Index = ({ isMultiple = false, maxFiles = 4, maxSizeMB = 10, accept = ["image/*"], onChange, className, defaultFile = "" }: Props) => {
	const [files, setFiles] = useState<PreviewFile[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const canAddMoreFiles = isMultiple ? files.length < maxFiles : files.length === 0;

	useEffect(() => {
		(async () => {
			if (Array.isArray(defaultFile)) {
				if (isMultiple) {
					const convertedFiles = await Promise.all(defaultFile.map((file) => (typeof file === "string" ? convertToFile(file) : file)));
					const filteredConvertedFiles = convertedFiles.filter((file) => file) as File[];
					const acceptedFilteredConvertedFiles = filteredConvertedFiles.filter((file) => isFileAccepted(file, accept));
					const previewFiles = acceptedFilteredConvertedFiles.map((file) => generatePreviewFile(file));

					setFiles([...previewFiles]);
				} else {
					const passedFile = defaultFile[0];

					if (typeof passedFile === "string") {
						const convertedFile = await convertToFile(passedFile);

						if (convertedFile) {
							if (isFileAccepted(convertedFile, accept)) {
								const previewFile = generatePreviewFile(convertedFile);

								setFiles((prev) => [...prev, previewFile]);
							}
						}
					} else {
						if (isFileAccepted(passedFile, accept)) {
							const previewFile = generatePreviewFile(passedFile);

							setFiles([previewFile]);
						}
					}
				}
			} else {
				if (typeof defaultFile === "string") {
					const convertedFile = await convertToFile(defaultFile);

					if (convertedFile) {
						if (isFileAccepted(convertedFile, accept)) {
							const previewFile = generatePreviewFile(convertedFile);

							setFiles([previewFile]);
						}
					}
				} else {
					if (isFileAccepted(defaultFile, accept)) {
						const previewFile = generatePreviewFile(defaultFile);

						setFiles([previewFile]);
					}
				}
			}
		})();

		return () => {
			files.forEach((file) => {
				if (file.preview) {
					URL.revokeObjectURL(file.preview);
				}
			});
		};
	}, []);

	const handleFileChange = useCallback(
		(files: FileList | null) => {
			if (files) {
				if (isMultiple) {
					const filteredFiles = Array.from(files).filter((file) => isFileAccepted(file, accept));

					if (filteredFiles.length) {
						const selectedFilteredFiles = filteredFiles.slice(0, maxFiles);
						const previewSelectedFilteredFiles = selectedFilteredFiles.map((file) => generatePreviewFile(file));

						setFiles((prev) => [...prev, ...(prev.length >= maxFiles ? [] : previewSelectedFilteredFiles.slice(0, maxFiles - prev.length))]);
					}
				} else {
					const foundFile = Array.from(files).find((file) => isFileAccepted(file, accept));

					if (foundFile) {
						const previewFoundFile = generatePreviewFile(foundFile);

						setFiles([previewFoundFile]);
					}
				}
			}
		},
		[files],
	);

	const removeFile = useCallback(
		(id: string) => {
			const fileToRemove = files.find((file) => file.id === id);
			if (fileToRemove?.preview) {
				URL.revokeObjectURL(fileToRemove.preview);
			}

			if (isMultiple) {
				setFiles((prev) => {
					const updatedFiles = prev.filter((file) => file.id !== id);
					onChange?.(updatedFiles.map((f) => f.file));
					return updatedFiles;
				});
			} else {
				setFiles([]);
				onChange?.(undefined);
				return;
			}
		},
		[files],
	);

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const droppedFiles = e.dataTransfer.files;
		handleFileChange(droppedFiles);
	};

	const handleClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleFileChange(e.target.files);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className={cn(className)}>
			{canAddMoreFiles && (
				<div className={cn("relative mb-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all duration-200", isDragging ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:bg-slate-900/50")} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} onClick={handleClick} style={{ cursor: "pointer" }}>
					<input ref={fileInputRef} type="file" multiple={isMultiple} accept={accept.join(", ")} onChange={handleInputChange} className="hidden" />

					<div className="pointer-events-none flex flex-col items-center justify-center text-center">
						<Upload className={cn("mb-2 h-10 w-10", isDragging ? "text-primary" : "text-slate-400 dark:text-slate-500")} />
						<p className="mb-1 text-sm font-medium">{isDragging ? "Drop files here" : `Drag & drop ${isMultiple ? "files" : "file"} or click to browse`}</p>
						<p className="text-xs text-slate-500 dark:text-slate-400">{isMultiple ? `Upload up to ${maxFiles} files (max ${maxSizeMB}MB each)` : `Max size: ${maxSizeMB}MB`}</p>
					</div>
				</div>
			)}

			{!isMultiple && files.length > 0 && (
				<div className="group relative m-auto max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow dark:border-slate-800 dark:bg-slate-950">
					<div className="relative aspect-square w-full overflow-hidden">
						{files[0].preview ? (
							<Image src={files[0].preview} alt={files[0].file.name} fill className="object-cover" priority={false} />
						) : (
							<div className="flex aspect-square w-full items-center justify-center bg-slate-100 dark:bg-slate-900">
								<FileIcon className="h-10 w-10 text-slate-400 dark:text-slate-500" />
							</div>
						)}

						<div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									removeFile(files[0].id);
								}}
								className="rounded-full bg-white/80 p-2 text-red-500 transition-transform hover:bg-white/100 dark:bg-slate-800/90"
							>
								<Trash className="h-5 w-5" />
							</button>
						</div>
					</div>

					<div className="p-3">
						<div className="flex items-start justify-between">
							<div className="flex-1 truncate">
								<p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{files[0].file.name}</p>
								<p className="text-xs text-slate-500 dark:text-slate-400">{generateFileSizeLabel(files[0].file.size)}</p>
							</div>

							<div className="ml-2 flex-shrink-0">
								<Check className="h-4 w-4 text-green-500" />
							</div>
						</div>
					</div>
				</div>
			)}

			{isMultiple && files.length > 0 && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{files.map((fileItem) => (
						<div key={fileItem.id} className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow dark:border-slate-800 dark:bg-slate-950">
							{fileItem.preview ? (
								<div className="relative aspect-square w-full overflow-hidden">
									<Image src={fileItem.preview} alt={fileItem.file.name} fill className="object-cover" priority={false} />
									<div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												removeFile(fileItem.id);
											}}
											className="rounded-full bg-white/80 p-1 text-red-500 transition-transform hover:bg-white/100 dark:bg-slate-800/90"
										>
											<Trash className="h-5 w-5" />
										</button>
									</div>
								</div>
							) : (
								<div className="flex aspect-square w-full items-center justify-center bg-slate-100 dark:bg-slate-900">
									<FileIcon className="h-10 w-10 text-slate-400 dark:text-slate-500" />
								</div>
							)}

							<div className="p-3">
								<div className="flex items-start justify-between">
									<div className="flex-1 truncate">
										<p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{fileItem.file.name}</p>
										<p className="text-xs text-slate-500 dark:text-slate-400">{generateFileSizeLabel(fileItem.file.size)}</p>
									</div>

									<div className="ml-2 flex-shrink-0">
										<Check className="h-4 w-4 text-green-500" />
									</div>
								</div>

								{!fileItem.preview && (
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											removeFile(fileItem.id);
										}}
										className="mt-2 flex w-full items-center justify-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
									>
										<X className="mr-1 h-3 w-3" />
										Remove
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{isMultiple && files.length > 0 ? (
				<p className="text-xs text-slate-500 dark:text-slate-400">
					{files.length} of {maxFiles} files selected
				</p>
			) : null}
		</div>
	);
};

export default Index;
