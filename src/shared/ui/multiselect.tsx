/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable react/prop-types */
import { useEffect, useId, useState, useRef } from "react";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/shared/ui/command";
import { Checkbox } from "@/shared/ui/checkbox";
import { PopoverContent, Popover, PopoverTrigger } from "@/shared/ui/popover";

type ItemType = {
	heading: string;
	values: {
		value: string;
		label: string;
	}[];
};

import { ScrollArea } from "@/shared/ui/scroll-area";

type Props = {
	items: ItemType[];
};

const multiselect = ({ items = [] }: Props) => {
	const multiselectId = useId();
	const [open, setOpen] = useState(false);
	const multiSelectListRef = useRef<HTMLDivElement | null>(null);
	const multiSelectPopupRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		const handleClickOutside = (e: Event) => {
			if (
				multiSelectListRef.current &&
				!multiSelectListRef.current.contains(e.target as Node) &&
				multiSelectPopupRef.current &&
				!multiSelectPopupRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (open && inputRef.current) {
			inputRef.current.focus();
		} else if (!open && inputRef.current) {
			inputRef.current.blur();
		}
	}, [open]);

	const [selectedItems, setselectedItems] = useState<string[]>([]);

	const handleBreedSelection = (itemValue: string) => {
		const isAlreadySelectedItem = selectedItems.includes(itemValue);
		if (isAlreadySelectedItem) {
			const updatedselectedItems = selectedItems.filter((selectedItem) => selectedItem !== itemValue);
			setselectedItems([...updatedselectedItems]);
		} else {
			setselectedItems([...selectedItems, itemValue]);
		}
	};

	return (
		<div ref={multiSelectListRef} className="h-full w-full">
			<Popover open={open}>
				<Command className="rounded-lg border shadow-md">
					<PopoverTrigger className="w-full">
						<CommandInput
							ref={inputRef}
							placeholder="Type a command or search..."
							onFocus={(e) => {
								e.preventDefault();
								e.stopPropagation();

								setOpen(true);
								inputRef.current?.focus();
							}}
						/>
					</PopoverTrigger>

					{open ? (
						<CommandList className={`${multiselectId}`}>
							<PopoverContent ref={multiSelectPopupRef}>
								<ScrollArea>
									<div className="max-h-[280px]">
										{items.map((item, index) => {
											return (
												<>
													<CommandGroup heading={item.heading} key={item.heading}>
														{item.values.map((breed) => (
															<CommandItem className="w-full" key={breed.value}>
																<Checkbox
																	id={breed.value}
																	checked={selectedItems.includes(breed.value)}
																	onCheckedChange={() =>
																		handleBreedSelection(breed.value)
																	}
																/>
																<label
																	htmlFor={breed.value}
																	className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
																>
																	{breed.label}
																</label>
															</CommandItem>
														))}
													</CommandGroup>
													{index !== items.length - 1 ? <CommandSeparator /> : null}
												</>
											);
										})}
									</div>
								</ScrollArea>
							</PopoverContent>
						</CommandList>
					) : null}
				</Command>
			</Popover>
		</div>
	);
};

export default multiselect;
