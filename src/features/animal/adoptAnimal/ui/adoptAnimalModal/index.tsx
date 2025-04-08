"use client";

// react
import { useState } from "react";
// features
import AdopAnimalForm from "@/features/animal/adoptAnimal/ui/adoptAnimalForm";
//shared
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
// next-intl
import { useTranslations } from "next-intl";
// entities
import { AnimalType, PopulatedAnimalType } from "@/entities/animal/model/type/animal";

type Props = {
	className?: string;
	animal: AnimalType | PopulatedAnimalType;
};

const Index = ({ className, animal }: Props) => {
	const t = useTranslations();
	const [isOpen, setIsOpen] = useState(false);

	const onHandleClick = () => setIsOpen(!isOpen);

	const onSuccess = () => {};

	const onError = () => {};

	return (
		<>
			<Dialog onOpenChange={setIsOpen} open={isOpen} defaultOpen={isOpen} modal>
				<DialogContent className="max-w-[720px]">
					<DialogHeader>
						<DialogTitle>{t("adopt.title")}</DialogTitle>
					</DialogHeader>
					<div className="flex h-full items-center space-x-2 overflow-auto">
						<AdopAnimalForm onSuccess={onSuccess} onError={onError} animal={animal} />
					</div>
				</DialogContent>
			</Dialog>

			<Button onClick={onHandleClick} className={cn(className)}>
				{t("adopt.button")}
			</Button>
		</>
	);
};

export default Index;
