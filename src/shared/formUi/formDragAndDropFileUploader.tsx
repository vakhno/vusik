import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/shared/ui/form";
import type { Props as DragAndDropFileUploaderProps } from "@/shared/shared/dragAndDropFileUploader";
import DragAndDropFileUploader from "@/shared/shared/dragAndDropFileUploader";
import { Control, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> extends DragAndDropFileUploaderProps {
	control: Control<T>;
	label?: string;
	description?: string | React.ReactNode;
	name: Path<T>;
}

const FormDragAndDropFileUploader = <T extends FieldValues>({ onChange, control, label, name, maxFiles, isMultiple, accept, defaultFile, maxSizeMB, description, ...props }: Props<T>) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<DragAndDropFileUploader
							isMultiple={isMultiple}
							maxFiles={maxFiles}
							maxSizeMB={maxSizeMB}
							accept={accept}
							defaultFile={defaultFile}
							onChange={(files) => {
								field.onChange(files);
							}}
							{...props}
						/>
					</FormControl>
					{description ? <FormDescription>{description}</FormDescription> : null}
				</FormItem>
			)}
		/>
	);
};

export default FormDragAndDropFileUploader;
