import React, { useEffect } from "react";
import { AiOutlineGoogle } from "react-icons/ai";
import { signIn, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn({ session }) {
  const router = useRouter();
  const { data: sessionLocal } = useSession();
  useEffect(() => {
    if (sessionLocal) {
      router.push("/");
    } else {
      console.log("hi");
    }
  }, [sessionLocal, session]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="space-y-5 border-8 rounded-lg border-black p-6 max-w-2xl">
        <h1 className="text-6xl font-bold">Sign In</h1>
        <p className="max-w-xl">
          Whether you're looking to drive or need to go somewhere, Cheetah's got
          your back.
        </p>
        <button
          onClick={() => {
            signIn("google");
          }}
          className="flex space-x-3 items-center rounded-lg border-2 border-black px-4 py-2 hover:text-white hover:bg-black transition ease-in-out duration-300"
        >
          <AiOutlineGoogle size={30} />
          <p className="font-semibold">Sign in with Google</p>
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return { props: { session } };
}
