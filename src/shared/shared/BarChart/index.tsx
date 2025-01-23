import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui/chart";
import { cn } from "@/lib/utils";

type Props = {
	className?: string;
	config: ChartConfig;
	data: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
};

const index = ({ data, config, className }: Props) => {
	return (
		<ChartContainer config={config} className={cn(className)}>
			<BarChart
				accessibilityLayer
				data={data}
				margin={{
					left: 12,
					right: 12,
				}}
			>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="date"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					minTickGap={32}
					tickFormatter={(value) => {
						const date = new Date(value);
						return date.toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						});
					}}
				/>
				<YAxis domain={[0, "auto"]} />
				<ChartTooltip
					content={
						<ChartTooltipContent
							labelFormatter={(value) => {
								return new Date(value).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
								});
							}}
						/>
					}
				/>
				<Bar dataKey={"adopted"} fill={`var(--color-${"adopted"})`} />
			</BarChart>
		</ChartContainer>
	);
};

export default index;
