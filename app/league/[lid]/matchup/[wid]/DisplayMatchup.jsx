import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function DisplayMatchup(mid) {
  const supabase = createServerComponentClient({ cookies })
  var { data } = await supabase.from('Matchups').select().eq('mid', mid)
  
  const tid1 = data[0].tid1
  const tid2 = data[0].tid2

  var { data } = await supabase.from('Teams').select().eq('tid', tid1)
  
  const duelist = data[0].duelist
  const controller = data[0].controller
  const team1 = data[0].name

  var { data } = await supabase.from('Teams').select().eq('tid', tid2)
  const duelist2 = data[0].duelist
  const controller2 = data[0].controller
  const team2 = data[0].name

    return (
      <div>
        <div style={{width: 800 + 'px'}}>
            <div style={{width: 300 + 'px', float: "left"}}>
            <h2>{team1}</h2>
            <p>{duelist}</p>
            <p>{controller}</p>
            </div>
            <div style={{width: 300 + 'px', float: "right"}}>
            <h2>{team2}</h2>
            <p>{duelist2}</p>
            <p>{controller2}</p>
            </div>
        </div>
        <div style={{clear: "both"}}></div>
      </div>
    );
}