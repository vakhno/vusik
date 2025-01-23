import { ReactNode } from "react";
// ui
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import { EmblaOptionsType } from "embla-carousel";
// libs
import { cn } from "@/lib/utils";

type Props<T> = {
	data: T[];
	className?: string;
	renderSlide: (item: T, index: number) => ReactNode;
	itemClassName: string;
	options?: EmblaOptionsType;
};

const index = <T,>({ className, data, renderSlide, itemClassName, options = {} }: Props<T>) => {
	return (
		<Carousel className={cn(className)} opts={options}>
			<CarouselContent>
				{data.map((item, index) => (
					<CarouselItem key={index} className={itemClassName}>
						{renderSlide(item, index)}
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
};

export default index;
