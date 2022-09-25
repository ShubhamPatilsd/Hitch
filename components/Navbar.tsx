import { useSession, signIn, signOut } from "next-auth/react";

import { HiOutlineLogout } from "react-icons/hi";

export const Navbar = () => {
  const { data: session } = useSession();
  return (
    <div className="flex items-center p-4 justify-between ">
      <h1 className="text-2xl md:text-4xl font-black">Cheetah</h1>
      <div className="flex items-center space-x-4 hover:bg-gray-100 transition ease-in-out p-4 rounded-lg">
        <img
          src={session.user.image}
          className="rounded-full w-8 h-8 md:w-12 md:h-12"
        />

        <div>
          <p className="font-bold text-sm md:text-base text-black">
            {session.user.name}
          </p>
          <p className="font-semibold text-xs text-gray-600">
            @{session.user.email.split("@")[0]}
          </p>
        </div>

        <button
          onClick={() => {
            signOut();
          }}
        >
          <HiOutlineLogout size={25} />
        </button>
      </div>
    </div>
  );
};
