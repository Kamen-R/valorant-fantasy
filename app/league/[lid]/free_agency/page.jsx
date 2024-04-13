import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AddButton from "./AddButton";
import FreeAgents from "./FreeAgents";

export default async function FreeAgencyPage({ params }) {
  const supabase = createServerComponentClient({ cookies })
  var { data: { user } } = await supabase.auth.getUser()  //might want to change other getSessions -> getUser it's more secure on the server side
  const user_id = user.id
  const lid = 'lid' + params.lid

  var { data:roster_count } = await supabase.from('Leagues').select('roster_count, region_string').eq('lid', params.lid)
  var { data } = await supabase.from('Teams').select().eq('lid', params.lid).eq('User UID', user_id)
  const roster = data

  //var { data, error } = await supabase.from('Rostered').select(`pid, ${lid}, Players (*)`).eq(`${lid}`, -1).order('Players (name)', { ascending: true })
  var { data, error } = await supabase.from('Players').select(`pid, name, position, team, region, avg_fpts, gp, Rostered!inner(pid, ${lid})`).eq(`Rostered.${lid}`, -1).or(roster_count[0].region_string).order('name', { ascending: true })
  //console.log(data)
  var renderedOutput = roster_count[0]["roster_count"].map(item =>
    <option key={roster[0][item]} value={roster[0][item]}>{roster[0][item]}</option>
    )
  
  return (
    <>
    <div style={{textAlign: 'center', padding: '10px'}}>
      <select name="add" id="add-player-select">
        <option key={0} value="">--Choose a player you want to add--</option>
        {data.map((player) => (
          <option key={player.pid} value={`${player.name}`}>{`${player.name}`}</option>
        ))}
      </select>
      <select name="drop" id="drop-player-select">
        <option value="">--Choose a player you want to drop--</option>
        {renderedOutput}
      </select>
    </div>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '10px'}}>
      <AddButton user_id={user_id} lid={lid} roster={roster}/>
    </div>
    <FreeAgents data={data}/>
    </>
  )
}
