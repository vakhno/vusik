"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable react/prop-types */
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		className={cn("relative flex w-full touch-none select-none items-center", className)}
		{...props}
	>
		<SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
			<SliderPrimitive.Range className="absolute h-full bg-primary" />
		</SliderPrimitive.Track>
		<SliderPrimitive.Thumb className="relative block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
			<div className="absolute -top-8 left-1/2 z-30 -translate-x-1/2 transform rounded-md border bg-popover px-2 text-popover-foreground shadow-sm">
				{value ? value[0] : ""}
			</div>
			{/* {value ? <span className="absolute bottom-[100%] left-[50%] translate-x-[-50%]">{value[0]}</span> : ""} */}
		</SliderPrimitive.Thumb>
		<SliderPrimitive.Thumb className="relatvie block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
			{/* {value ? <span className="absolute bottom-[100%] left-[50%] translate-x-[-50%]">{value[1]}</span> : ""} */}
			<div className="absolute -top-8 left-1/2 z-30 -translate-x-1/2 transform rounded-md border bg-popover px-2 text-popover-foreground shadow-sm">
				{value ? value[1] : ""}
			</div>
		</SliderPrimitive.Thumb>
	</SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

// "use client";
// import { Fragment, useEffect, useState, forwardRef } from 'react';
// import * as SliderPrimitive from '@radix-ui/react-slider';
// import { cn } from '@/lib/utils';

// export type SliderProps = {
//   className?: string;
//   min: number;
//   max: number;
//   minStepsBetweenThumbs: number;
//   step: number;
//   formatLabel?: (value: number) => string;
//   value?: number[] | readonly number[];
//   onValueChange?: (values: number[]) => void;
// };

// const Slider = forwardRef(
//   ({ className, min, max, step, formatLabel, value, onValueChange, ...props }: SliderProps, ref) => {
//     const initialValue = Array.isArray(value) ? value : [min, max];
//     const [localValues, setLocalValues] = useState(initialValue);

//     useEffect(() => {
//       // Update localValues when the external value prop changes
//       setLocalValues(Array.isArray(value) ? value : [min, max]);
//     }, [min, max, value]);

//     const handleValueChange = (newValues: number[]) => {
//       setLocalValues(newValues);
//       if (onValueChange) {
//         onValueChange(newValues);
//       }
//     };

//     return (
//       <SliderPrimitive.Root
//         ref={ref as React.RefObject<HTMLDivElement>}
//         min={min}
//         max={max}
//         step={step}
//         value={localValues}
//         onValueChange={handleValueChange}
//         className={cn('relative flex w-full touch-none select-none mb-6 items-center', className)}
//         {...props}
//       >
//         <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
//           <SliderPrimitive.Range className="absolute h-full bg-primary" />
//         </SliderPrimitive.Track>
//         {localValues.map((value, index) => (
//           <Fragment key={index}>
//             <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
//               <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-30 rounded-md border bg-popover text-popover-foreground shadow-sm px-2">
//                 {formatLabel ? formatLabel(value) : value}
//               </div>
//             </SliderPrimitive.Thumb>
//           </Fragment>
//         ))}
//       </SliderPrimitive.Root>
//     );
//   }
// );

// Slider.displayName = SliderPrimitive.Root.displayName;

// export { Slider };
