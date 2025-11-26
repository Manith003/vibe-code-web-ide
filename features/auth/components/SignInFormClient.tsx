import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chrome, Github } from "lucide-react";

async function handleGoogleSignIn(){
    "use server";
    await signIn("google");
}

async function handleGitHubSignIn(){
    "use server";
    await signIn("github");
}

const SignInFormClient = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign In
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Choose one of the following sign-in methods
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form action={handleGoogleSignIn}>
          <Button variant="outline" className="w-full">
            <Chrome className="mr-2 h-4 w-4" />
            <span>Sign in with Google</span>
          </Button>
        </form>
        <form action={handleGitHubSignIn}>
          <Button variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            <span>Sign in with GitHub</span>
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignInFormClient;
