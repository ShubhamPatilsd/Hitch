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
  const session = await getSession({ req });
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
  if(user){
    await prisma.user.update({
      where:{
        id: user.id
      },
      data:{
        online: false
      }
    })
    res.json({ success: true });

  }else{
    res.json({ success: false, err:"User not there in db" });
  }

  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ success: false, err: err });
  //   }
}