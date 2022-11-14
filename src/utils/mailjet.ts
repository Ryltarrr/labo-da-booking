import Mailjet from "node-mailjet";
import { env } from "../env/server.mjs";

export const mailjet = new Mailjet({
  apiKey: env.MAILJET_API_KEY,
  apiSecret: env.MAILJET_API_SECRET,
});
