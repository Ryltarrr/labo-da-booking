import { type NextApiRequest, type NextApiResponse } from "next";
import argon2 from "argon2";

import { prisma } from "../../server/db/client";

type ResponseBody = {
  csrfToken: string;
  email: string;
  password: string;
};

const authenticate = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body as ResponseBody;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(403).json({ success: false });
  }
  const hash = await argon2.verify(user?.password, password);
  if (!hash) {
    return res.status(403).json({ success: false });
  }
  res.status(200).json(user);
};

export default authenticate;
