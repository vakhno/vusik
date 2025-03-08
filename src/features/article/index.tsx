"use client";

import { queryArticle } from "@/entities/article/model/query/queryById";
import Image from "next/image";
import { AspectRatio } from "@/shared/ui/aspect-ratio";
import { Types } from "mongoose";

type Props = { articleId: Types.ObjectId };

const Index = ({ articleId }: Props) => {
	const { data } = queryArticle({ articleId: articleId });

	if (data) {
		return (
			<>
				<div className="flex gap-10">
					<div className="flex-1">
						<AspectRatio ratio={4 / 3}>
							<Image src={data.image} fill alt="photo" className="object-cover" />
						</AspectRatio>
					</div>
					<div className="flex flex-1 flex-col items-center">
						<h2>{data.title}</h2>
						<div className="w-full flex-1">
							<span>{data.text}</span>
						</div>
					</div>
				</div>
			</>
		);
	}

	return null;
};

export default Index;
