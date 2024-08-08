// mongoose
import mongoose, { Schema } from "mongoose";
// types
import { UserType } from "@/types/user.type";

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
	},
	{ timestamps: true },
);

const UserModel = mongoose?.models?.User || mongoose.model("User", UserSchema);

export default UserModel;
