import type { NextApiRequest, NextApiResponse } from "next";
// import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;

  if (username === "user" && password === "pass") {
    const token = "generated-token";

    // res.setHeader(
    //   "Set-Cookie",
    //   serialize("token", token, {
    //     httpOnly: true,
    //     path: "/",
    //   })
    // );

    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
}
