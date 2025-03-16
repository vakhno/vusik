// mongoose
import mongoose, { Schema, Model } from "mongoose";
// types
import { UserType } from "@/entities/profile/model/type/profile";
//
import { UserRole } from "@/shared/constants/user";

const UserSchema = new Schema<UserType>(
	{
		role: {
			type: String,
			default: UserRole.OWNER,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			// required: true, - if user sign up manually; required: false, - if user sign in/sign up by OAuth (google log in etc.)
			required: function () {
				return !this.isSocial;
			},
			// select: false, - means, that this field will not be included by default in query result
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
			default: null,
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
		articles: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Article",
				default: [],
			},
		],
		shelters: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Shelter",
				default: [],
			},
		],
		animals: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Animal",
				default: [],
			},
		],
	},
	{ timestamps: true },
);

const UserModel: Model<UserType> = mongoose?.models?.User || mongoose.model("User", UserSchema);

export default UserModel;
