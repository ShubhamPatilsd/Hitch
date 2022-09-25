import axios from "axios";
import { useEffect, useState } from "react";
import { PeopleCard } from "./PeopleCard";

export const SearchPeople = ({ people }) => {
  return (
    <div className="mx-4 h-full space-y-2">
      <h2 className="text-xl md:text-3xl font-semibold">People near you</h2>
      <div className="space-y-2 overflow-y-auto">
        {people && people.length > 0 ? (
          people.map((person, i) => {
            return (
              //   <div className="space-x-3 flex items-center">
              //     <h3 className="text-lg font-semibold">{person.name}</h3>
              //     <img src={person.image} className="w-12 h-12 rounded-full" />
              //   </div>
              <>
                <a href={`mailto:${person.email}`}>
                  <PeopleCard
                    user={person}
                    key={i}
                    listLength={people.length}
                  />
                </a>
              </>
            );
          })
        ) : (
          <p className="text-xs text-center text-gray-600">
            Nobody wants to ride right now :(
          </p>
        )}
      </div>
    </div>
  );
};
