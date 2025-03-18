import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { FormControl } from "@/shared/ui/form";

export type Option = {
	value: string;
	label: string;
	[key: string]: unknown;
};

export interface SingleSelectProps {
	value?: string;
	optionList: Option[];
	placeholder?: string;
	onChange?: (value: string) => void;
}

const SingleSelect = ({ onChange, value = "", optionList = [], placeholder = "" }: SingleSelectProps) => {
	return (
		<Select onValueChange={onChange} value={value}>
			<FormControl>
				<SelectTrigger>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
			</FormControl>
			<SelectContent>
				{optionList && optionList.length
					? optionList.map((option: Option) => {
							return (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							);
						})
					: null}
			</SelectContent>
		</Select>
	);
};

export { SingleSelect };
