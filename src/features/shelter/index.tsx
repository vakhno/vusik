"use client";

import { queryShelter } from "@/entities/shelter/model/query/shelterById";
import { Types } from "mongoose";
import Image from "next/image";

type Props = { shelterId: Types.ObjectId };

const Index = ({ shelterId }: Props) => {
	const { data } = queryShelter({ shelterId: shelterId });

	if (data) {
		return (
			<div>
				<Image src={data.mainPhoto} width={40} height={100} alt="shelter photo" />
				<span>{data.name}</span>
			</div>
		);
	}

	return null;
};

export default Index;
