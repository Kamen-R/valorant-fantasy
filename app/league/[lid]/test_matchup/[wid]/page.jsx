import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import BarChart from "./BarChart"

export default async function Matchup({ params }) {
  const lid = params.lid
  const wid = params.wid
  const supabase = createServerComponentClient({ cookies })

  const { data } = await supabase.from('Games').select().or('gid', 'gid.eq.27,gid.eq.56,gid.eq.74')

    return (
      <BarChart data={data}/>
    );
}

//<Suspense fallback={<Loading />}>