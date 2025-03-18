"use client";

// react
import { useState } from "react";
// features
import AdopAnimalForm from "@/features/animal/adoptAnimal/ui/adoptAnimalForm";
//shared
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { useTranslations } from "next-intl";

const Index = () => {
	const t = useTranslations();
	const [isOpen, setIsOpen] = useState(false);

	const onHandleClick = () => setIsOpen(!isOpen);

	return (
		<>
			<Dialog onOpenChange={setIsOpen} open={isOpen} defaultOpen={isOpen} modal>
				<DialogContent className="max-w-[720px]">
					<DialogHeader>
						<DialogTitle>{t("adopt.title")}</DialogTitle>
					</DialogHeader>
					<div className="flex h-full items-center space-x-2 overflow-auto">
						<AdopAnimalForm />
					</div>
				</DialogContent>
			</Dialog>

			<Button onClick={onHandleClick}>{t("adopt.button")}</Button>
		</>
	);
};

export default Index;
