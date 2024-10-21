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
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useState, useRef, useId, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Card } from "./card";
import { Badge } from "@/components/ui/badge";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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

type Props =
	| {
			options: Option[];
			emptyMessage: string;
			disabled?: boolean;
			placeholder?: string;
			isForm: true;
			control: unknown;
			name: string;
			defaultValues?: string[];
	  }
	| {
			options: Option[];
			emptyMessage: string;
			disabled?: boolean;
			placeholder?: string;
			isForm: false;
			control?: unknown;
			name: string;
			defaultValues?: string[];
	  };

export const AutocompleteMultiselect = ({
	options,
	placeholder,
	disabled = false,
	isForm = false,
	control,
	name = "",
	defaultValues = [],
}: Props) => {
	const multiselectId = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const allAreaRef = useRef<HTMLInputElement>(null);
	const popupRef = useRef<HTMLInputElement>(null);
	const [isOpen, setOpen] = useState(false);
	const [selected, setSelected] = useState<string[]>(defaultValues);

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

	const handleOptionSelection = (value: string): void => {
		const isAlreadySelected = selected.some((selectedValue) => selectedValue === value);
		if (isAlreadySelected) {
			const updatedSelected = selected.filter((selectedValue) => selectedValue !== value);
			setSelected(updatedSelected);
		} else {
			setSelected([...selected, value]);
		}
	};

	return (
		<CommandPrimitive ref={allAreaRef} className="rounded-lg border">
			<div className="flex w-full flex-wrap items-center">
				{selected.length ? (
					<div className="flex flex-wrap items-center gap-1 p-2">
						{selected.map((s) => (
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
						"absolute top-0 z-10 w-full rounded-xl bg-white outline-none animate-in fade-in-0 zoom-in-95",
						isOpen ? "block" : "hidden",
					)}
				>
					<CommandList className={`${multiselectId}`}>
						<Card>
							<CommandEmpty>No results found.</CommandEmpty>
							<ScrollArea>
								<div className="max-h-[280px]">
									{isForm ? (
										<>
											<FormField
												control={control}
												name={name}
												render={() => (
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
																												handleOptionSelection(
																													breed.value,
																												);

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
																																	value,
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
																						<FormLabel className="font-normal">
																							{item.label}
																						</FormLabel>
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
												)}
											/>
										</>
									) : (
										<>
											{options.map((item, index) => {
												return (
													<div key={index}>
														<CommandGroup heading={item.heading} key={item.heading}>
															{item.values.map((breed) => (
																<CommandItem className="w-full" key={breed.value}>
																	{
																		<>
																			<Checkbox
																				id={breed.value}
																				checked={selected.includes(breed.value)}
																				onCheckedChange={() =>
																					handleOptionSelection(breed.value)
																				}
																			/>
																			<label
																				htmlFor={breed.value}
																				className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
																			>
																				{breed.label}
																			</label>
																		</>
																	}
																</CommandItem>
															))}
														</CommandGroup>
														{index !== options.length - 1 ? <CommandSeparator /> : null}
													</div>
												);
											})}
										</>
									)}
								</div>
							</ScrollArea>
						</Card>
					</CommandList>
				</div>
			</div>
		</CommandPrimitive>
	);
};
