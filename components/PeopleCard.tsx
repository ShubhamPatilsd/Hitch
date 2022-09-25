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
        className={`flex flex-col-reverse xl:flex-row w-full justify-center space-x-3 items-center rounded-lg hover:bg-gray-100 transition ease-in-out p-4 `}
      >
        <div className="space-y-2">
          <div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="font-semibold text-sm text-gray-600">
              @{user.email.split("@")[0]}
            </p>
          </div>
          <p className="text-xs text-gray-500 font-semibold">
            {JSON.parse(user.status || '{ "travel": "", "location":"" }')
              .travel === "going"
              ? "Wants to go"
              : "Driving"}
            {" to "}
            {
              JSON.parse(user.status || '{ "travel": "", "location":"" }')
                .location
            }
          </p>
        </div>
        <div>
          <img src={user.image || ""} className="rounded-full w-16 h-16" />
          <div className="rounded-full h-4 w-4 bg-green-500 -translate-y-16 right-0 translate-x-12"></div>
        </div>
      </div>
      <div
        className={`${
          key + 1 === listLength ? "border-b" : ""
        } border-gray-200 h-1`}
      ></div>
    </div>
  );
};
