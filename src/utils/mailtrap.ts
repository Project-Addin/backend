import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.MAILTRAP_TOKEN ?? ""
const INBOX_ID = process.env.MAILTRAP_INBOX_ID ?? ""

const mailtrap = new MailtrapClient({
    token: TOKEN,
    testInboxId: Number.parseInt(INBOX_ID)
})

export default mailtrap