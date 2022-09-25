import { Session } from "next-auth";

export const PeopleCard = ({
  user,
  key,
  listLength,
}: {
  user: any;
  key: number;
  listLength: number;
}) => {
  return (
    <div>
      <div
        className={`flex justify-center space-x-3 items-center rounded-lg hover:bg-gray-100 p-4 `}
      >
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="font-semibold text-xs text-gray-600">
            @{user.email.split("@")[0]}
          </p>
        </div>
        <img src={user.image || ""} className="rounded-full w-16 h-16" />
      </div>
      <div
        className={`${
          key + 1 === listLength ? "border-b" : ""
        } border-gray-200 h-1`}
      ></div>
    </div>
  );
};
