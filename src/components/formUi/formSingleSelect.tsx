import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { SingleSelect, SingleSelectProps } from "@/components/shared/SingleSelect";
import { Control, FieldValues, Path } from "react-hook-form";
export type Option = {
	value: string;
	label: string;
	[key: string]: unknown;
};
interface Props<T extends FieldValues> extends SingleSelectProps {
	name: Path<T>;
	control: Control<T>;
	formLabel?: string;
	optionList: Option[];
	handleChange?: (value: string) => void;
}

const FormSingleSelect = <T extends FieldValues>({
	name,
	control,
	formLabel = "",
	optionList,
	handleChange,
	...props
}: Props<T>) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{formLabel ? <FormLabel>{formLabel}</FormLabel> : null}
					<SingleSelect
						optionList={optionList}
						onChange={(value) => {
							field.onChange(value); // Ensure the form state is updated
							handleChange?.(value); // Call any additional onChange handler passed via props
						}}
						value={field.value}
					/>
				</FormItem>
			)}
		/>
	);
};

export default FormSingleSelect;
