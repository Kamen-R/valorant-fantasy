// import { Suspense } from 'react';
// import Loading from "../loading";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import SwapButton from "./SwapButton";
//import { FaEdit } from "react-icons/fa";

export default async function Team({ params }) {
  const lid = params.lid
  const tid = params.tid

  const supabase = createServerComponentClient({ cookies })
  var { data, error} = await supabase.from('Leagues').select(`roster_spots, roster_count`).eq('lid', lid)
  const roster_spots = data[0].roster_spots
  const roster_count = data[0].roster_count  
  var { data: { user } } = await supabase.auth.getUser()
  const email = user.email
  var subButton = true

  var { data, error } = await supabase.from('Teams').select().eq('lid', lid).eq('tid', tid)
  const team = data
  var roster_string = ''
  for (const item of roster_count) {
    roster_string += `name.eq.${team[0][item]},`
  }

  if (data[0].email == email) {
    subButton = true
  }
  else {
    subButton = false
  }
  //console.log(subButton)
  
  var { data } = await supabase.from('Players').select('name, position, team_code, fpts').or(roster_string.slice(0, -1))
  var player_info = {}
  for (const item of data) {
    player_info[item.name] = {position: item.position, team_code: item.team_code, fpts: item.fpts}
  }
  
  var renderedOutput = roster_count.map(item => 
    <div className="card my-5" key={item + '-card'} id={roster_spots[item]}>
      <h3 key={item + '-h3'} className="pos">{roster_spots[item]}</h3>
      <h3 className="fpts">{player_info[team[0][item]].fpts}</h3>
      <p key={item + '-p'} id={item}>{player_info[team[0][item]].team_code + ' ' + team[0][item] + ' - ' + player_info[team[0][item]].position}</p>
    </div>
  )
  if (!subButton) {
    return (
      <div className="flex flex-row gap-64 pl-56">
        <div>
          <h2>{team[0].name}</h2>
          <h3>{team[0].owner}</h3>
          {renderedOutput}
        </div>
      </div>
    );
  }

  var optionOutput = roster_count.map(item => 
    <option value={roster_spots.item} key={item}>{roster_spots[item]}</option>
  )

    return (
      <div className="flex flex-row gap-64 pl-56">
        <div>
          <h2>{team[0].name}</h2>
          <h3>{team[0].owner}</h3>
          {renderedOutput}
        </div>
        <div>
          <h4>Player 1</h4>
          <select name="swap" id="player1-select" key="p1-select">
            <option value="" key="blank1">--Choose a player you want to swap--</option>
            {optionOutput}
          </select>
          <h4>Player 2</h4>
          <select name="swap" id="player2-select" key="p2-select">
            <option value="" key="blank2">--Choose a player you want to swap--</option>
            {optionOutput}
          </select>
          <SwapButton lid={lid} tid={tid}/>
        </div>
      </div>
    );
}

// //<Suspense fallback={<Loading />}>
// <MyTeam />
// </Suspense>