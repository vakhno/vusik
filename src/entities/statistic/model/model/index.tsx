// mongoose
import mongoose, { Schema } from "mongoose";

const StatisticSchema = new Schema(
	{
		animal: {
			total: {
				type: Number,
			},
			active: {
				type: Number,
			},
			adopted: {
				type: Number,
			},
			deleted: {
				type: Number,
			},
			avarageAdoptionTime: {
				type: Number,
			},
			adoptedByDay: {
				type: Map,
				of: [{ type: mongoose.Schema.Types.ObjectId, ref: "Animal" }],
			},
		},
		shelter: {
			total: {
				type: Number,
			},
			countByState: {
				type: Number,
			},
			biggestShelterInEveryState: [mongoose.Schema.Types.ObjectId],
		},
		user: {
			total: {
				type: Number,
			},
		},
	},
	{ timestamps: true },
);

const StatisticModel = mongoose?.models?.User || mongoose.model("Statistic", StatisticSchema);

export default StatisticModel;
