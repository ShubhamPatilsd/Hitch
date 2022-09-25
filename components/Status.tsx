import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const Status = () => {
  const { data: session } = useSession();

  const [travelStatus, setTravelStatus] = useState<any>("driving");
  const [locationStatus, setLocationStatus] = useState<any>("");

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    axios({ url: "/api/getStatus", method: "GET" }).then((value) => {
      let status = value.data.status;
      console.log(status);
      status && status.travel ? setTravelStatus(status?.travel) : "";
      status && status.location ? setLocationStatus(status?.location) : "";
      //   setLocationStatus(status?.location);
    });
  }, []);

  const updateStatus = async () => {
    // const theStatus = ;
    console.log(
      JSON.stringify({
        travel: travelStatus,
        location: locationStatus,
      })
    );
    await axios({
      url: "/api/updateStatus",
      method: "POST",
      data: {
        status: JSON.stringify({
          travel: travelStatus,
          location: locationStatus,
        }),
      },
    });

    setUpdate(false);
  };

  return (
    <div className="px-4 space-x-4 flex items-center">
      <div className="flex space-x-2 items-center">
        <p className="font-bold text-lg">Status: </p>
        <div>
          I{" "}
          <select
            onChange={(e) => {
              setUpdate(true);
              setTravelStatus(e.target.value);
            }}
            value={travelStatus}
            className="rounded-lg border-2 border-black bg-white text-sm px-2"
          >
            <option value="driving">am driving</option>
            <option value="going">want to go</option>
          </select>
          {" to "}
          <input
            onChange={(e) => {
              setUpdate(true);
              setLocationStatus(e.target.value);
            }}
            value={locationStatus}
            className="rounded-lg border-2 border-black px-2 text-sm"
          />
        </div>
      </div>
      {update ? (
        <button
          onClick={() => {
            try {
              updateStatus();
              toast.success("Updated Status", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            } catch (err) {
              toast.error("Couldn't update status", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          }}
          className="px-4 bg-black rounded-lg text-white"
        >
          Update
        </button>
      ) : (
        ""
      )}
    </div>
  );
};
