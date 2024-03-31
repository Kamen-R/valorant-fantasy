import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import AddButton from "./AddButton"
import Players from './PlayerStats'

export default async function FreeAgency({ params }) {
  const supabase = createServerComponentClient({ cookies })
  var { data: { user } } = await supabase.auth.getUser()  //might want to change other getSessions -> getUser it's more secure on the server side
  const email = user.email
  const lid = 'lid' + params.lid

  var { data } = await supabase.from('Teams').select('name, player1, player2').eq('lid', params.lid).eq('email', email)
  const roster = data
  //console.log(roster)

  var { data, error } = await supabase.from('Rostered').select(`pid, ${lid}, Players ( name, team, region, position )`).eq(`${lid}`, -1).order('Players (name)', { ascending: true })
  //var { data, error } = await supabase.from('Players').select(`name, team, region, position, Rostered ( ${lid} )`).eq(`Rostered (${lid})`, -1)//.order('name', { ascending: true })
  //console.log(data)
  
  return (
    <div>
      <select name="add" id="add-player-select">
        <option key={0} value="">--Choose a player you want to add--</option>
        {data.map((player) => (
          <option key={player.pid} value={`${player.Players.name}`}>{`${player.Players.name}`}</option>
        ))}
      </select>
      <select name="drop" id="drop-player-select">
        <option value="">--Choose a player you want to drop--</option>
        <option value={roster[0].player1}>{roster[0].player1}</option>
        <option value={roster[0].player2}>{roster[0].player2}</option>
      </select>
      <div>
        <AddButton email={email} lid={lid} roster={roster}/>
      </div>
      <div>
        <Players />
      </div>
    </div>
  )
}
