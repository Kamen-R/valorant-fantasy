import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from 'next/link';
import DisplayAllMatchups from "./DisplayAllMatchups";

// async function getMatches(lid, wid) {
//     const supabase = createServerComponentClient({ cookies })
//     const { data, error } = await supabase.from('Leagues').select('schedule').eq('lid', lid)
  
//     if (error) {
//         console.log(error.message)
//     }
  
//     return data[0]["schedule"][wid]
// }

async function getLeagueInfo(lid){
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase.from('Leagues').select('schedule, roster_spots, roster_count, team_ids').eq('lid', lid)

  if (error) {
    console.log(error.message)
  }

  return data[0]
}

export default async function Matchup({ params }) {
  const lid = params.lid
  const wid = params.wid

  const league_info = await getLeagueInfo(lid)
  //console.log(league_info)
  var renderedOutput = DisplayAllMatchups(league_info, lid, wid)

  var num_weeks = Object.keys(league_info.schedule)
  const curr_index = num_weeks.indexOf(wid)
  num_weeks.splice(curr_index, 1)

  var matchOutput = num_weeks.map(item=> 
    <Link key={`week-${item}`} className="week" href={`/league/${lid}/matchup/${item}`}>Week {item} </Link>
    )

    return (
      <>
        <div style={{textAlign: "center", paddingBottom: "20px"}}>
          {matchOutput}
        </div>
        {renderedOutput}
      </>
    );
}

//<Suspense fallback={<Loading />}>