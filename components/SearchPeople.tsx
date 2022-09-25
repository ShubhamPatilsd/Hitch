import axios from "axios";
import { useEffect, useState } from "react";
import { PeopleCard } from "./PeopleCard";

export const SearchPeople = ({ people }) => {
  return (
    <div className="mx-4 max-w-xs h-full space-y-2">
      <h2 className="text-3xl font-semibold">People near you</h2>
      <div className="space-y-2 overflow-y-auto">
        {people &&
          people.map((person, i) => {
            return (
              //   <div className="space-x-3 flex items-center">
              //     <h3 className="text-lg font-semibold">{person.name}</h3>
              //     <img src={person.image} className="w-12 h-12 rounded-full" />
              //   </div>
              <>
                <PeopleCard user={person} key={i} listLength={people.length} />
              </>
            );
          })}
      </div>
    </div>
  );
};
