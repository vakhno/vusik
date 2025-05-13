"use client";

import { query_getShelterById } from "@/entities/shelter/model/query/shelterById";
import Image from "next/image";

type Props = { shelterId: string };

const Index = ({ shelterId }: Props) => {
	const { data } = query_getShelterById({ shelterId });

	if (data) {
		return (
			<div>
				<Image src={data.mainPhoto || ""} width={40} height={100} alt="shelter photo" />
				<span>{data.name}</span>
			</div>
		);
	}

	return null;
};

export default Index;
