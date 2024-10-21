"use client";

import { queryAnimal } from "@/queries/animal.query";
import Image from "next/image";
import React from "react";

type Props = { animalId: string };

const Index = ({ animalId }: Props) => {
	const { data } = queryAnimal({ animalId: animalId });

	if (data) {
		return (
			<div>
				<Image src={data.mainPhoto} alt="animal photo" />
				<span>{data.name}</span>
			</div>
		);
	}

	return null;
};

export default Index;
