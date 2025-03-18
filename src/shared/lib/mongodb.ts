// mongoose
import mongoose from "mongoose";
// mongodb
import { MongoClient, ServerApiVersion } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;

export const mongoConnection = async () => {
	try {
		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(MONGODB_URI as string);
			console.log("Successfully connected to DB");
		}
	} catch (error) {
		console.error("Failed to connect to DB", error);
	}
};

export const mongoClient = async () => {
	if (!MONGODB_URI) {
		throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
	}

	const uri = MONGODB_URI;
	const options = {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true,
		},
	};
	let client: MongoClient;

	if (NODE_ENV === "development") {
		const globalWithMongo = global as typeof globalThis & {
			_mongoClient?: MongoClient;
		};

		if (!globalWithMongo._mongoClient) {
			globalWithMongo._mongoClient = new MongoClient(uri, options);
		}

		client = globalWithMongo._mongoClient;
	} else {
		client = new MongoClient(uri, options);
	}
	return client;
};
