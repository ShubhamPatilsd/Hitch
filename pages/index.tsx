import axios from "axios";
import type { NextPage } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { SearchPeople } from "../components/SearchPeople";
import { Map } from "../components/Map";
import { Status } from "../components/Status";

const Home: NextPage = () => {
  const { data: session } = useSession();

  const [people, setPeople] = useState<any>([]);
  const [secondPeople, setSecondPeople] = useState<any>({
    type: "FeatureCollection",
    features: [],
  });
  const [location, setLocation] = useState<{ latitude: any; longitude: any }>({
    latitude: null,
    longitude: null,
  });

  const locationStuff = () => {
    if (session) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        await axios({
          url: "/api/updateLocation",
          method: "POST",
          data: {
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          },
        });

        const result = await axios({
          url: "/api/getPeople",
          method: "POST",
          data: {
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          },
        });

        const newPeople = result.data.people;

        let newArray = {
          type: "FeatureCollection",
          features: [],
        };

        newPeople.forEach((person) => {
          newArray.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                person.location.longitude,
                person.location.latitude,
              ],
            },
            properties: {
              title: person.name,
              description: person.name,
            },
          });
        });

        // if (people) {
        //   setPeople({
        //     features: [
        //       people.map((person) => {
        //         return {
        //           type: "Feature",
        //           geometry: {
        //             type: "Point",
        //             coordinates: [person.longitude, person.latitude],
        //           },
        //           properties: {
        //             title: person.name,
        //             description: person.name,
        //           },
        //         };
        //       }),
        //     ],
        //   });
        // }

        // setPeople(newArray);
        setPeople(result.data.people);
        setSecondPeople(newArray);
      });
    }
  };

  useEffect(() => {
    const handleWindowClose = async () => {
      await axios({ url: "/api/goOffline", method: "POST" });
    };

    try {
      locationStuff();
    } catch (err) {
      //
    }

    window.addEventListener("beforeunload", handleWindowClose);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, []);

  if (session) {
    return (
      <>
        {" "}
        <Navbar />
        <div className="space-y-4">
          <Status />
          <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-6">
            <SearchPeople people={people} />
            {/* Signed in as {session.user.email} <br />{" "} */}
            {/* <button onClick={() => signOut()}>Sign out</button> */}
            {location.latitude !== null && location.longitude !== null ? (
              <Map location={location} people={secondPeople} />
            ) : (
              <div className="w-[92vw] md:w-[78vw] h-[65vh] md:h-[65vh] animate-pulse rounded-lg bg-gray-100"></div>
            )}
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {" "}
      Not signed in <br /> <button onClick={() => signIn()}>
        Sign in
      </button>{" "}
    </>
  );
};

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: { destination: "/auth/signIn" },
    };
  }

  return { props: { session } };
}

export default Home;
