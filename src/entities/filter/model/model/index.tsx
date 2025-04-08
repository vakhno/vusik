// mongoose
import mongoose, { Schema } from "mongoose";
// types
import { FiltersType } from "@/entities/filter/model/type/filters";

const FilterSchema = new Schema<FiltersType>({
	animals: {
		species: {
			type: Map,
			of: new Schema({
				breeds: { type: Map, of: Number, default: {} },
				size: { type: Map, of: Number, default: {} },
				birthday: { type: Map, of: Number, default: {} },
				sex: { type: Map, of: Number, default: {} },
			}),
			default: {},
		},
		states: { type: Map, of: Number, default: {} },
		cities: { type: Map, of: Number, default: {} },
		shelters: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Shelter",
			},
		],
	},
	shelters: {
		shelter: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Shelter",
			},
		],
		state: { type: Map, of: Number, default: {} },
		city: { type: Map, of: Number, default: {} },
	},
	articles: {
		category: { type: Map, of: Number, default: {} },
	},
	users: {
		type: Map,
		of: new Schema({
			animals: {
				species: {
					type: Map,
					of: new Schema({
						breeds: { type: Map, of: Number, default: {} },
						size: { type: Map, of: Number, default: {} },
						birthday: { type: Map, of: Number, default: {} },
						sex: { type: Map, of: Number, default: {} },
					}),
					default: {},
				},
				states: { type: Map, of: Number, default: {} },
				cities: { type: Map, of: Number, default: {} },
				shelters: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: "Shelter",
					},
				],
			},
			shelters: {
				shelter: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: "Shelter",
					},
				],
				state: { type: Map, of: Number, default: {} },
				city: { type: Map, of: Number, default: {} },
			},
			articles: {
				category: { type: Map, of: Number, default: {} },
			},
		}),
		default: {},
	},
});

const FilterModel = mongoose.models.Filter || mongoose.model("Filter", FilterSchema);

export default FilterModel;
