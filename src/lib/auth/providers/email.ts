import { generateId } from "@/lib/utils"
import { type EmailConfig } from "next-auth/providers/email"

export const Email = {
  id: "email",
  // https://zeptomail.zoho.com/
  name: "ZeptoMail",
  type: "email",
  maxAge: 5 * 60,
  async generateVerificationToken() {
    return generateId({
      type: "otp",
    })
  },
  async sendVerificationRequest({ identifier: email, url }) {
    const response = await fetch("https://api.zeptomail.com/v1.1/email", {
      method: "POST",
      headers: {
        Authorization: process.env.AUTH_EMAIL_SECRET!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: { address: "noreply@spacewall.me" },
        subject: "Sign in to SpaceWall",
        to: [
          {
            email_address: {
              address: email,
            },
          },
        ],
        htmlbody: `Please click here to authenticate - ${url}`,
      }),
    })

    if (!response.ok) {
      const { errors } = await response.json()
      throw new Error(JSON.stringify(errors))
    }
  },
} as EmailConfig
