import { Types } from "mongoose";
import EditArticleForm from "@/features/article/editArticle/ui/editArticleForm";
type Props = {
	articleId: Types.ObjectId;
};

const Page = async ({ articleId }: Props) => {
	return <EditArticleForm articleId={articleId} />;
};

export default Page;
