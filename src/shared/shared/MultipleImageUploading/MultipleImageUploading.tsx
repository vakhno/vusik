import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Upload, X, File as FileIcon, Check, AlertCircle, Trash } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface FileWithPreview {
	file: File;
	id: string;
	preview?: string;
	status: "uploading" | "success" | "error";
	progress?: number;
}

interface MultipleFileUploaderProps {
	maxFiles?: number;
	maxSizeMB?: number;
	accept?: string;
	onChange?: (files: File[]) => void;
	onError?: (message: string) => void;
	className?: string;
}

const MultipleFileUploader = ({ maxFiles = 5, maxSizeMB = 10, accept = "image/*", onChange, onError, className }: MultipleFileUploaderProps) => {
	const [files, setFiles] = useState<FileWithPreview[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = useCallback(
		(selectedFiles: FileList | null) => {
			if (!selectedFiles || selectedFiles.length === 0) return;

			if (files.length + selectedFiles.length > maxFiles) {
				onError?.(`Maximum ${maxFiles} files allowed`);
				return;
			}

			const newFilesArray: FileWithPreview[] = [];
			const validFiles: File[] = [];

			Array.from(selectedFiles).forEach((file) => {
				// Check file size
				if (file.size > maxSizeMB * 1024 * 1024) {
					onError?.(`File "${file.name}" exceeds maximum size of ${maxSizeMB}MB`);
					return;
				}

				// Check file type
				const fileType = file.type;
				const acceptTypes = accept.split(",").map((type) => type.trim());

				const isAccepted = acceptTypes.some((type) => {
					if (type === "*/*") return true;
					if (type.endsWith("/*")) {
						const category = type.split("/")[0];
						return fileType.startsWith(`${category}/`);
					}
					return type === fileType;
				});

				if (!isAccepted) {
					onError?.(`File "${file.name}" is not an accepted file type`);
					return;
				}

				// Create file preview for images
				let preview: string | undefined;
				if (file.type.startsWith("image/")) {
					preview = URL.createObjectURL(file);
				}

				// Create new file object
				const newFile: FileWithPreview = {
					file,
					id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
					preview,
					status: "success",
					progress: 100,
				};

				newFilesArray.push(newFile);
				validFiles.push(file);
			});

			// Update state
			setFiles((prevFiles) => [...prevFiles, ...newFilesArray]);

			// Call onChange with all files
			if (validFiles.length > 0) {
				const allFiles = [...files.map((f) => f.file), ...validFiles];
				onChange?.(allFiles);
			}
		},
		[files, maxFiles, maxSizeMB, accept, onChange, onError],
	);

	const removeFile = useCallback(
		(id: string) => {
			// Find the file to clean up any object URLs before removing
			const fileToRemove = files.find((file) => file.id === id);
			if (fileToRemove?.preview) {
				URL.revokeObjectURL(fileToRemove.preview);
			}

			setFiles((prevFiles) => {
				const updatedFiles = prevFiles.filter((file) => file.id !== id);
				onChange?.(updatedFiles.map((f) => f.file));
				return updatedFiles;
			});
		},
		[files, onChange],
	);

	// Clean up object URLs when component unmounts
	useEffect(() => {
		return () => {
			files.forEach((file) => {
				if (file.preview) {
					URL.revokeObjectURL(file.preview);
				}
			});
		};
	}, []);

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return `${bytes} bytes`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	// Handle drag events
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

	const openFileDialog = () => {
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
		<div className={cn("w-full space-y-4", className)}>
			{/* Drag and drop area */}
			<div className={cn("relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all duration-200", isDragging ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:bg-slate-900/50", files.length >= maxFiles ? "opacity-50" : "")} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} onClick={files.length < maxFiles ? openFileDialog : undefined} style={{ cursor: files.length < maxFiles ? "pointer" : "not-allowed" }}>
				<input ref={fileInputRef} type="file" multiple accept={accept} onChange={handleInputChange} className="hidden" disabled={files.length >= maxFiles} />

				<div className="flex flex-col items-center justify-center text-center">
					<Upload className={cn("mb-2 h-10 w-10", isDragging ? "text-primary" : "text-slate-400 dark:text-slate-500")} />
					<p className="mb-1 text-sm font-medium">{isDragging ? "Drop files here" : "Drag & drop files or click to browse"}</p>
					<p className="text-xs text-slate-500 dark:text-slate-400">{`Upload up to ${maxFiles} files (max ${maxSizeMB}MB each)`}</p>
					{files.length >= maxFiles && <p className="mt-2 text-xs font-medium text-amber-500">Maximum file limit reached</p>}
				</div>
			</div>

			{/* File preview list */}
			{files.length > 0 && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{files.map((fileItem) => (
						<div key={fileItem.id} className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow dark:border-slate-800 dark:bg-slate-950">
							{/* File preview for images */}
							{fileItem.preview ? (
								<div className="relative aspect-square w-full overflow-hidden">
									<Image
										src={fileItem.preview}
										alt={fileItem.file.name}
										fill
										sizes="(max-width: 768px) 100vw, 
                           (max-width: 1200px) 50vw, 
                           33vw"
										className="object-cover"
										priority={false}
									/>
									<div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												removeFile(fileItem.id);
											}}
											className="rounded-full bg-white/90 p-1 text-red-500 transition-transform hover:scale-110 dark:bg-slate-800/90"
										>
											<Trash className="h-5 w-5" />
										</button>
									</div>
								</div>
							) : (
								/* Non-image file representation */
								<div className="flex aspect-square w-full items-center justify-center bg-slate-100 dark:bg-slate-900">
									<FileIcon className="h-10 w-10 text-slate-400 dark:text-slate-500" />
								</div>
							)}

							{/* File info footer */}
							<div className="p-3">
								<div className="flex items-start justify-between">
									<div className="flex-1 truncate">
										<p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{fileItem.file.name}</p>
										<p className="text-xs text-slate-500 dark:text-slate-400">{formatFileSize(fileItem.file.size)}</p>
									</div>

									{/* Status indicator */}
									<div className="ml-2 flex-shrink-0">
										{fileItem.status === "success" && <Check className="h-4 w-4 text-green-500" />}
										{fileItem.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
									</div>
								</div>

								{/* Remove button outside of image overlay */}
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

			{/* File counter */}
			{files.length > 0 && (
				<p className="text-xs text-slate-500 dark:text-slate-400">
					{files.length} of {maxFiles} files selected
				</p>
			)}
		</div>
	);
};

export default MultipleFileUploader;
