// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../util/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
// import { unstable_getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import authOptions from "../api/auth/[...nextauth]";
import { getDistance, convertDistance } from "geolib";
import { GeolibInputCoordinates } from "geolib/es/types";

type Data = {
  people: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body);
  const session = await getSession({ req });
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: { location: true },
  });

  const otherPeople = await prisma.user.findMany({
    include: { location: true, sessions: true },
  });

  console.log(req.body.location,"loc");

  const people = otherPeople.filter(
    (person) =>
      person && person.email !== session.user.email &&
      person.sessions.length > 0 && person.location &&
      convertDistance(
        Math.abs(getDistance(
          {
            latitude: req.body.location.latitude,
            longitude: req.body.location.longitude,
          },
          person.location
        )),
        "mi"
      ) <= 5
  );
  res.json({ people: people });
}
