import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export default async function getUser() {
    const supabase = createServerComponentClient({ cookies })
    const { data } = await supabase.auth.getSession()
    const userid = data.session.user.id

    return userid
}