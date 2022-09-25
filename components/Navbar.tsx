import { useSession, signIn, signOut } from "next-auth/react";

export const Navbar = () => {
  const { data: session } = useSession();
  return (
    <div className="flex items-center p-4 justify-between ">
      .
      <div className="flex items-center space-x-2">
        <div>
          <p className="font-bold text-s text-black">{session.user.name}</p>
          <p className="font-semibold text-xs text-gray-600">
            @{session.user.email.split("@")[0]}
          </p>
        </div>
        <img src={session.user.image} className="rounded-full w-12 h-12" />
      </div>
    </div>
  );
};
