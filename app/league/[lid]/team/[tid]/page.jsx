// import { Suspense } from 'react';
// import Loading from "../loading";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import SwapButton from "./SwapButton";
//import { FaEdit } from "react-icons/fa";

async function getPlayerInfo(supabase, name) {
   const { data, error } = await supabase.from('Players').select('position, team').eq('name', name)

   return data[0].team + ' ' + name + ' - ' + data[0].position
}

async function getPlayerAvg(supabase, name) {
  const { data, error } = await supabase.from('Players').select('fpts').eq('name', name)

  return data[0].fpts + ' pts'
}
//{getPlayerPos(supabase, data[0].duelist)}

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
  if (data[0].email == email) {
    subButton = true
  }
  else {
    subButton = false
  }

  var renderedOutput = roster_count.map(item => 
    <div className="card my-5" key={item + '-card'} id={roster_spots[item]}>
      <h3 key={item + '-h3'} class="pos">{roster_spots[item]}</h3>
      <h3 class="fpts">{getPlayerAvg(supabase, data[0][item])}</h3>
      <p key={item + '-p'} id={item}>{getPlayerInfo(supabase, data[0][item])}</p>
    </div>
  ) //getPlayerInfo(supabase, data[0][item]
  if (!subButton) {
    return (
      <div class="flex flex-row gap-64 pl-56">
        <div>
          <h2>{data[0].name}</h2>
          <h3>{data[0].owner}</h3>
          {renderedOutput}
        </div>
      </div>
    );
  }

  var optionOutput = roster_count.map(item => 
    <option value={roster_spots.item} key={item}>{roster_spots[item]}</option>
  )

    return (
      <div class="flex flex-row gap-64 pl-56">
        <div>
          <h2>{data[0].name}</h2>
          <h3>{data[0].owner}</h3>
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