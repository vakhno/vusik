// components
import SignUpFooter from "@/features/sign-up/signUpFooter/index";
import SignUpContent from "@/features/sign-up/signUpContent/index";
import SignUpHeader from "@/features/sign-up/signUpHeader/index";
// UI components
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const SignUp = () => {
	return (
		<Card>
			<CardHeader>
				<SignUpHeader />
			</CardHeader>
			<CardContent>
				<SignUpContent />
			</CardContent>
			<CardFooter>
				<SignUpFooter />
			</CardFooter>
		</Card>
	);
};

export default SignUp;
