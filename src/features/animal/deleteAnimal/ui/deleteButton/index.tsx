"use client";

// shared
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
// next-intl
import { useTranslations } from "next-intl";
// mongoose
import { Types } from "mongoose";

type Props = {
	className?: string;
	animalId: Types.ObjectId;
};

const Index = ({ className = "" }: Props) => {
	const t = useTranslations();
	const onHandleSubmit = () => {};

	return (
		<AlertDialog>
			<AlertDialogTrigger className={className}>{t("delete")}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onHandleSubmit}>Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default Index;
