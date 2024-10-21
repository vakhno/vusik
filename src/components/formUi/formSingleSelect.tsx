import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { SingleSelect, SingleSelectProps } from "@/components/shared/SingleSelect";

interface Props extends SingleSelectProps {
	name: string;
	control: unknown;
	formLabel?: string;
	handleChange?: (value: string) => void;
}

const FormSingleSelect = ({ name = "", control, formLabel = "", handleChange, ...props }: Props) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{formLabel ? <FormLabel>{formLabel}</FormLabel> : null}
					<SingleSelect
						optionList={props.optionList}
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
