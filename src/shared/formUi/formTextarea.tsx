import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/shared/ui/form";
import { Textarea } from "@/shared/ui/textarea";
import { Control, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> extends React.InputHTMLAttributes<HTMLTextAreaElement> {
	onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	control: Control<T>;
	label?: string;
	description?: string | React.ReactNode;
	name: Path<T>;
}

const FormInput = <T extends FieldValues>({ onChange, control, label, name, description, ...props }: Props<T>) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					{description ? <FormDescription>{description}</FormDescription> : null}
					<FormControl>
						<Textarea
							{...field}
							{...props}
							onChange={(event) => {
								if (onChange) {
									onChange(event);
								} else {
									field.onChange(event);
								}
							}}
						/>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};

export default FormInput;
