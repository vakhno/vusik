import React from "react";
import { Label } from "@/components/ui/label";
import FormInput from "./formInput";
import FormCheckbox from "./formCheckbox";

type Props = {
	control?: unknown;
	label?: string;
	beginName: string;
	endName: string;
	isWeekendName: string;
	disabled?: boolean;
};

const formTimePeriod = ({ control, label, beginName, endName, isWeekendName, disabled = false }: Props) => {
	return (
		<div className="flex flex-col">
			{label && label.trim().length ? <Label className="mb-2">{label}</Label> : null}

			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<FormInput
						control={control}
						disabled={disabled}
						name={beginName}
						placeholder="Begin time"
						type="time"
					/>
					-
					<FormInput
						control={control}
						disabled={disabled}
						name={endName}
						placeholder="End time"
						type="time"
					/>
				</div>
				<FormCheckbox control={control} name={isWeekendName} label={"Is weekend"} />
			</div>
		</div>
	);
};

export default formTimePeriod;
