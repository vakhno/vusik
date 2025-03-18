import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/shared/ui/form";
import { Checkbox } from "@/shared/ui/checkbox";
import { Control, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> {
	className?: string;
	control: Control<T>;
	label?: string;
	description?: string;
	name: Path<T>;
}

const FormCheckbox = <T extends FieldValues>({ className, control, label = "", description = "", name }: Props<T>) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem
					className={`flex flex-row items-start space-x-2 space-y-0 rounded-md border px-3 py-2 ${className}`}
				>
					<FormControl>
						<>
							<Checkbox id={name} checked={field.value} onCheckedChange={field.onChange} />
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
