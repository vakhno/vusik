"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Calendar } from "@/shared/ui/calendar";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Control, FieldValues, Path } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import React from "react";

interface Props<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label?: string;
	placeholder?: string;
	description?: string | React.ReactNode;
	defaultValue?: Date;
	onChange?: (date: Date | undefined) => void;
	disabledDates?: (date: Date) => boolean;
	className?: string;
}

const FormCalendar = <T extends FieldValues>({ control, name, label, placeholder, description, onChange, disabledDates, className }: Props<T>) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={cn("flex flex-col", className)}>
					{label ? <FormLabel>{label}</FormLabel> : null}
					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
								<Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
									{field.value ? format(field.value, "PPP") : <span>{placeholder}</span>}
									<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={field.value}
								onSelect={(date) => {
									field.onChange(date);
									if (onChange) {
										onChange(date);
									}
								}}
								disabled={disabledDates || ((date) => date > new Date() || date < new Date("1900-01-01"))}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
					{description ? <FormDescription>{description}</FormDescription> : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default FormCalendar;
