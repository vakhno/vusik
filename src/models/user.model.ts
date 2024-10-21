// mongoose
import mongoose, { Schema } from "mongoose";
// types
import { UserType } from "@/types/user.type";
import AnimalModel from "./animal.model";
import ShelterModel from "./shelter.model";

const UserSchema = new Schema<UserType>(
	{
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: function () {
				return !this.isSocial;
			},
			select: false,
		},
		name: {
			type: String,
			required: true,
		},
		isSocial: {
			type: Boolean,
			required: true,
			default: false,
		},
		avatar: {
			type: String,
		},
		facebook: {
			type: String,
		},
		instagram: {
			type: String,
		},
		telegram: {
			type: String,
		},
		twitter: {
			type: String,
		},
		youtube: {
			type: String,
		},
		shelters: [
			{
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: ShelterModel,
				default: [],
			},
		],
		animals: [
			{
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: AnimalModel,
				default: [],
			},
		],
	},
	{ timestamps: true },
);

const UserModel = mongoose?.models?.User || mongoose.model("User", UserSchema);

export default UserModel;
