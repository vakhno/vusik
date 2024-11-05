import { useEffect, useState } from "react";
import { FieldValues, Path, Control, useWatch as watch } from "react-hook-form";
import FormSingleSelect from "@/components/formUi/formSingleSelect";
import { monthLong } from "@/constants/month";
import { Button } from "@/components/ui/button";

type Props<T extends FieldValues> = {
	control: Control<T>;
	monthName: Path<T>;
	dayName: Path<T>;
	onHandleRemove: () => void;
};

const days = (month: number) => {
	const maxDays = new Date(2024, month, 0).getDate();
	return Array.from({ length: maxDays }, (_, i) => ({ value: `${i}`, label: (i + 1).toString() }));
};

const FormSpecificDay = <T extends FieldValues>({ control, monthName, dayName, onHandleRemove }: Props<T>) => {
	const monthWatch = watch({ control, name: monthName });
	const monthList = monthLong.map((value, index) => ({ value: `${index}`, label: value }));
	const [dayList, setDayList] = useState<
		{
			value: string;
			label: string;
		}[]
	>([]);

	useEffect(() => {
		const newDayList = days(+monthWatch);
		setDayList(newDayList);
	}, [monthWatch]);

	return (
		<div className="flex">
			<FormSingleSelect
				control={control}
				name={monthName}
				optionList={monthList}
				placeholder={"Select month"}
				formLabel={"Month"}
			/>
			<FormSingleSelect
				control={control}
				name={dayName}
				optionList={dayList}
				placeholder={"Select day"}
				formLabel={"Day"}
			/>
			<Button onClick={onHandleRemove}>remove</Button>
		</div>
	);
};

export default FormSpecificDay;
