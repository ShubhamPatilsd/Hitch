// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../util/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
// import { unstable_getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import authOptions from "../api/auth/[...nextauth]";
import { getDistance, convertDistance } from "geolib";
import { GeolibInputCoordinates } from "geolib/es/types";

type Data = {
  success: boolean;
  err?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //   try {
  const { location } = req.body;
  const session = await getSession({ req });
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: { location: true },
  });

  if (!user.location) {
    await prisma.location.create({
      data: {
        userId: user.id,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
  } else {
    await prisma.location.update({
      where: { userId: user.id },
      data: { latitude: location.latitude, longitude: location.longitude },
    });
  }

  res.json({ success: true });

  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ success: false, err: err });
  //   }
}