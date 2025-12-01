import SignInFormClient from "@/features/auth/components/SignInFormClient";

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* <Image src={"/logo3.svg"} alt="Logo" width={350} height={150} /> */}
      <h1 className="text-white font-sans text-2xl pb-9">WEB.CODE IDE</h1>
      <SignInFormClient />
    </div>
  );
};

export default SignInPage;
