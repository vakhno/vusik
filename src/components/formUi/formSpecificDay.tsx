import { FieldValues, Path, Control, useWatch, useController } from "react-hook-form";
import FormSingleSelect from "@/components/formUi/formSingleSelect";
import { useEffect } from "react";

type Props<T extends FieldValues> = { control: Control<T>; monthName: Path<T>; dayName: Path<T> };

const formSpecificDay = <T extends FieldValues>({ control, monthName, dayName }: Props<T>) => {
	const monthWatch = useWatch({control, name: monthName});
	// const {
	// 	field: { onChange: onBeginChange },
	// } = useController({
	// 	name: beginName,
	// 	control,
	// });
	// const {
	// 	field: { onChange: onEndChange },
	// } = useController({
	// 	name: endName,
	// 	control,
	// });

	useEffect(() => {

	}, [monthWatch])

	return (
		<div className="flex">
			<FormSingleSelect
				control={control}
				name={monthName}
				optionList={[]}
				placeholder={"Select shelter"}
				formLabel={"Shelter"}
			/>
			<FormSingleSelect
				control={control}
				name={dayName}
				optionList={[]}
				placeholder={"Select shelter"}
				formLabel={"Shelter"}
			/>
		</div>
	);
};

export default formSpecificDay;
