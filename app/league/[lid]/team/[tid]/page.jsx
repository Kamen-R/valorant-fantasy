// import { Suspense } from 'react';
// import Loading from "../loading";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Team({ params }) {
  const lid = params.lid
  const tid = params.tid
  
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase.from('Teams').select().eq('lid', lid).eq('tid', tid)

    return (
      <>
        {data.map((team) => (
          <>
            <div className="card my-5">{team.duelist}</div>
            <div className="card my-5">{team.controller}</div>
          </>
        ))}
      </>
    );
}

// //<Suspense fallback={<Loading />}>
// <MyTeam />
// </Suspense>