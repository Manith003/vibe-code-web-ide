import SignInFormClient from "@/features/auth/components/SignInFormClient";
import Image from "next/image";

const SignInPage = () => {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center">
      <Image src={"/logo.svg"} alt="Logo" width={150} height={150} />
      <SignInFormClient />
    </div>
  );
};

export default SignInPage;
