import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	control: unknown;
	label?: string;
	name: string;
}

const FormInput = ({ onChange, control, label, name, ...props }: Props) => {
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
