import NextAuth from "next-auth"
import { authOptions } from "../../../lib/auth" // ปรับ path ตามโปรเจกต์คุณ

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }