// components
import SignInFooter from "@/features/sign-in/signInFooter/index";
import SignInContent from "@/features/sign-in/signInContent/index";
import SignInHeader from "@/features/sign-in/signInHeader/index";
// UI components
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const SignIn = () => {
	return (
		<Card>
			<CardHeader>
				<SignInHeader />
			</CardHeader>
			<CardContent>
				<SignInContent />
			</CardContent>
			<CardFooter>
				<SignInFooter />
			</CardFooter>
		</Card>
	);
};

export default SignIn;
