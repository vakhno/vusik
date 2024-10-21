import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
	control: unknown;
	defaultValue: boolean;
	label?: string;
	description?: string;
	name: string;
}

const FormCheckbox = ({ defaultValue = false, control, label = "", description = "", name }: Props) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md border px-3 py-2">
					<FormControl>
						<>
							<Checkbox
								defaultChecked={defaultValue}
								id={name}
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
							{label || description ? (
								<div className="space-y-1 leading-none">
									{label ? <FormLabel htmlFor={name}>{label}</FormLabel> : null}
									{description ? <FormDescription>{description}</FormDescription> : null}
								</div>
							) : null}
						</>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};

export default FormCheckbox;
