import { useState } from "react";
import { Slider } from "@/shared/ui/slider";

interface Props {
	handleChange?: (value: number[]) => void;
	minValue: number;
	maxValue: number;
	minDefaultValue: number;
	maxDefaultValue: number;
	stepValue: number;
}

// const DAYS_IN_YEAR = 365;
// const DAYS_IN_MONTH = 30;

// const formatAgeLabel = (days: number) => {
// 	if (days < DAYS_IN_YEAR) {
// 		return `${Math.round(days / DAYS_IN_MONTH)} months`;
// 	}
// 	return `${(days / DAYS_IN_YEAR).toFixed(1)} years`;
// };

const FormSlider = ({ handleChange, minValue, maxValue, minDefaultValue, maxDefaultValue, stepValue }: Props) => {
	const [ageRange, setAgeRange] = useState<number[]>([minDefaultValue, maxDefaultValue]);

	return (
		<>
			<div className="mx-auto mb-10 mt-14 flex w-full max-w-xl flex-col gap-4 px-10">
				<Slider
					min={minValue}
					max={maxValue}
					step={stepValue}
					value={ageRange}
					defaultValue={ageRange}
					onValueCommit={(value) => {
						handleChange && handleChange(value);
					}}
					onValueChange={(value) => {
						setAgeRange(value);
					}}
				/>
				<div className="flex w-full justify-center px-2">
					<span>{ageRange[0]}</span>
					<span> - </span>
					<span>{ageRange[1]}</span>
				</div>
			</div>
		</>
	);
};

export default FormSlider;
