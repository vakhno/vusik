import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	control: Control<T>;
	label?: string;
	description?: string;
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
					<FormControl>
						<Input
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
					{description && description.length ? <FormDescription>{description}</FormDescription> : null}
				</FormItem>
			)}
		/>
	);
};

export default FormInput;
