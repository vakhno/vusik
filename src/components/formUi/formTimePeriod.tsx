import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import FormInput from "./formInput";
import FormCheckbox from "./formCheckbox";
import { Control, FieldValues, Path, useWatch as watch, useController as controller } from "react-hook-form";

type Props<T extends FieldValues> = {
	control: Control<T>;
	label?: string;
	checkboxLabel?: string;
	beginName: Path<T>;
	defaultBeginTime?: string;
	endName: Path<T>;
	defaultEndTime?: string;
	isWeekendName: Path<T>;
	disabled?: boolean;
};

const FormTimePeriod = <T extends FieldValues>({
	control,
	label,
	checkboxLabel,
	beginName,
	defaultBeginTime,
	endName,
	defaultEndTime,
	isWeekendName,
	disabled,
}: Props<T>) => {
	const isWeekendWatch = watch({ control: control, name: isWeekendName });
	const {
		field: { onChange: onBeginChange },
	} = controller({
		name: beginName,
		control,
	});
	const {
		field: { onChange: onEndChange },
	} = controller({
		name: endName,
		control,
	});

	useEffect(() => {
		if (isWeekendWatch) {
			onBeginChange("");
			onEndChange("");
		} else {
			onBeginChange(defaultBeginTime);
			onEndChange(defaultEndTime);
		}
	}, [isWeekendWatch]);

	return (
		<div className="flex flex-col">
			{label && label.trim().length ? <Label className="mb-1">{label}</Label> : null}
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<FormInput
						control={control}
						disabled={disabled}
						name={beginName}
						placeholder="Begin time"
						type="time"
					/>
					<span className="mx-2">-</span>
					<FormInput
						control={control}
						disabled={disabled}
						name={endName}
						placeholder="End time"
						type="time"
					/>
				</div>
				{checkboxLabel && checkboxLabel.trim().length ? (
					<FormCheckbox control={control} name={isWeekendName} label={checkboxLabel} />
				) : (
					<FormCheckbox control={control} name={isWeekendName} />
				)}
			</div>
		</div>
	);
};

export default FormTimePeriod;
