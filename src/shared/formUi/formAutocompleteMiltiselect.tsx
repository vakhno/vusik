/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable react/prop-types */
import {
	CommandGroup,
	CommandItem,
	CommandList,
	CommandInput,
	CommandSeparator,
	CommandEmpty,
} from "@/shared/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useState, useRef, useId, useEffect } from "react";
import { Checkbox } from "@/shared/ui/checkbox";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { cn } from "@/shared/lib/utils";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { FormControl, FormField, FormItem, FormMessage } from "@/shared/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";

export type Option = {
	heading?: {
		value: string;
		label: string;
	};
	values: {
		value: string;
		label: string;
	}[];
};

type Props<T extends FieldValues> = {
	className?: string;
	options: Option[];
	emptyMessage: string;
	disabled?: boolean;
	placeholder?: string;
	control: Control<T>;
	name: Path<T>;
	defaultValues?: string[];
};

export const FormAutocompleteMultiselect = <T extends FieldValues>({
	className,
	options,
	placeholder,
	disabled = false,
	control,
	name,
}: Props<T>) => {
	const multiselectId = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const allAreaRef = useRef<HTMLInputElement>(null);
	const popupRef = useRef<HTMLInputElement>(null);
	const [isOpen, setOpen] = useState(false);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent): void => {
			if (e.target instanceof HTMLElement) {
				if (
					allAreaRef.current &&
					!allAreaRef.current.contains(e.target) &&
					popupRef.current &&
					!popupRef.current.contains(e.target)
				) {
					setOpen(false);
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<CommandPrimitive ref={allAreaRef} className={`rounded-lg border ${className}`}>
			<FormField
				control={control}
				name={name}
				render={({ field }) => {
					const { value } = field;
					return (
						<>
							<div className="flex w-full flex-wrap items-center">
								{value.length ? (
									<div className="flex flex-wrap items-center gap-1 p-2">
										{value.map((s: string) => (
											<Badge key={s}>{s}</Badge>
										))}
									</div>
								) : null}
								<div className="w-full min-w-80 flex-1">
									<CommandInput
										ref={inputRef}
										onFocus={() => setOpen(true)}
										placeholder={placeholder}
										disabled={disabled}
									/>
								</div>
							</div>
							<div className="relative" ref={popupRef}>
								<div
									className={cn(
										"relative",
										// "absolute top-0 z-10 w-full rounded-xl bg-white outline-none animate-in fade-in-0 zoom-in-95",
										isOpen ? "block" : "hidden",
									)}
								>
									<CommandList className={`${multiselectId}`}>
										<Card>
											<CommandEmpty>No results found.</CommandEmpty>
											<ScrollArea>
												<div className="max-h-[280px]">
													<FormItem>
														{options.map((item, index) => (
															<div key={index}>
																<CommandGroup
																	heading={
																		item?.heading ? item.heading.label : undefined
																	}
																	key={index}
																>
																	{item.values.map((breed) => (
																		<FormField
																			key={breed.value}
																			control={control}
																			name={name}
																			render={({ field }) => {
																				return (
																					<FormItem
																						key={breed.value}
																						className="flex flex-row items-start space-x-3 space-y-0"
																					>
																						<FormControl>
																							<CommandItem
																								className="w-full"
																								key={breed.value}
																							>
																								{
																									<>
																										<Checkbox
																											checked={field.value.includes(
																												breed.value,
																											)}
																											onCheckedChange={(
																												checked,
																											) => {
																												return checked
																													? field.onChange(
																															[
																																...field.value,
																																breed.value,
																															],
																														)
																													: field.onChange(
																															field.value?.filter(
																																(
																																	value: string,
																																) =>
																																	value !==
																																	breed.value,
																															),
																														);
																											}}
																										/>
																										<label
																											htmlFor={
																												breed.value
																											}
																											className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
																										>
																											{
																												breed.label
																											}
																										</label>
																									</>
																								}
																							</CommandItem>
																						</FormControl>
																					</FormItem>
																				);
																			}}
																		/>
																	))}
																</CommandGroup>
																{index !== options.length - 1 ? (
																	<CommandSeparator />
																) : null}
															</div>
														))}
														<FormMessage />
													</FormItem>
												</div>
											</ScrollArea>
										</Card>
									</CommandList>
								</div>
							</div>
						</>
					);
				}}
			/>
		</CommandPrimitive>
	);
};
