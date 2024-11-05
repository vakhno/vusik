import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	control: Control<T>;
	label?: string;
	name: Path<T>;
}

const FormInput = <T extends FieldValues>({ onChange, control, label, name, ...props }: Props<T>) => {
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
				</FormItem>
			)}
		/>
	);
};

export default FormInput;
