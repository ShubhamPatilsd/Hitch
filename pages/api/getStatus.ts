// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../util/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
// import { unstable_getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import authOptions from "./auth/[...nextauth]";
import { getDistance, convertDistance } from "geolib";
import { GeolibInputCoordinates } from "geolib/es/types";

type Data = {
  success: boolean;
  err?: any;
  status?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //   try {
  const session = await getSession({ req });
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (user) {
    res.json({ success: true, status: JSON.parse(user.status) });
  } else {
    res.json({ success: false, err: "User not there" });
  }

  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ success: false, err: err });
  //   }
}
