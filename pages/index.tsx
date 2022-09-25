import axios from "axios";
import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
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

        console.log(location);

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

        console.log(newPeople);

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
        console.log(newArray, "new");
        setSecondPeople(newArray);
      });
    }
  };

  useEffect(() => {
    // const id = setInterval(() => {
    if (session) {
      locationStuff();
    }
    // }, 1000);
    // return () => clearInterval(id);
  }, [session]);

  if (session) {
    return (
      <>
        {" "}
        <Navbar />
        <div className="space-y-4">
          <Status />
          <div className="flex flex-col md:flex-row space-x-4">
            <SearchPeople people={people} />
            {/* Signed in as {session.user.email} <br />{" "} */}
            {/* <button onClick={() => signOut()}>Sign out</button> */}
            {location.latitude !== null && location.longitude !== null ? (
              <Map location={location} people={secondPeople} />
            ) : (
              <div className="w-[92vw] md:w-[70vw] h-[65vh] md:h-[65vh] animate-pulse rounded-lg bg-gray-100"></div>
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

export default Home;
