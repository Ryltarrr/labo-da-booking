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
  const teacher = await prisma.teacher.findUnique({
    where: { email },
  });

  if (!teacher) {
    return res.status(403).json({ success: false });
  }
  const hash = await argon2.verify(teacher?.password, password);
  if (!hash) {
    return res.status(403).json({ success: false });
  }
  res.status(200).json(teacher);
};

export default authenticate;
