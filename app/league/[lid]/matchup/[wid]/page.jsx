//import { Suspense } from 'react';
//import Loading from "../../../../(home)/loading";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import DisplayMatchup from "./DisplayMatchup";
import Link from 'next/link';

async function getMatches(lid, wid) {
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from('Leagues').select('schedule').eq('lid', lid)
  
    if (error) {
        console.log(error.message)
    }
  
    return data[0]["schedule"][wid]
}

export default async function Matchup({ params }) {
  const lid = params.lid
  const wid = params.wid

  const match_list = await getMatches(lid, wid)

  var renderedOutput = match_list.map(item => DisplayMatchup(item, wid, lid))

    return (
      <>
        <div>
          <Link href={`/league/${lid}/matchup/2`}>Week 2</Link>
        </div>
        {renderedOutput}
      </>
    );
}

//<Suspense fallback={<Loading />}>