import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <div className="mx-auto w-fit mt-10">
        <SignUp />
      </div>
    </>
  );
}
