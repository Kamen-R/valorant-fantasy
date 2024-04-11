"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

function checkGameTime(matches, player_info, player) {
  var currentdatetime = new Date(); 
  var gametime = new Date(matches[player_info[player].team].time)
  console.log(gametime, currentdatetime)

  if (gametime < currentdatetime) {
    return false // return false if game start time is before current time, so you cannot sub
  }
  if (gametime > currentdatetime) {
    return true // return true is game start time is after current time, so you can still sub
  }
}

export default function SwapButton({ lid, tid, matches, player_info, game_time}) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const updatePos = async () => {
    const player1 = document.getElementById("player1-select").value
    const player2 = document.getElementById("player2-select").value

    if (player1 == player2) {
        return null
    }

    const pos1 = document.getElementById(player1).getElementsByTagName('p')[0].id
    const pos2 = document.getElementById(player2).getElementsByTagName('p')[0].id
    //console.log(pos1, pos2)
    //console.log(game_time[pos1], game_time[pos2])

    if (game_time[pos1] != "None") {
      if (!checkGameTime(matches, player_info, pos1)) {
        document.getElementById('error-p').innerHTML = pos1 + '\'s game has already started! You cannot sub them out.'
        return null
      }
    }

    if (game_time[pos2] != "None") {
      if (!checkGameTime(matches, player_info, pos2)) {
        document.getElementById('error-p').innerHTML = pos2 + '\'s game has already started! You cannot sub them out.'
        return null
      }
    }

    const swap_pos1 = document.getElementById(player1).getElementsByTagName('p')[1].id.slice(0, -4)
    const swap_pos2 = document.getElementById(player2).getElementsByTagName('p')[1].id.slice(0, -4)

    var { error } = await supabase.from('Teams').update({[swap_pos1]: pos2, [swap_pos2]: pos1}).eq('lid', lid).eq('tid', tid)
    var swap_error = error
    console.log({ [swap_pos1]: pos2, [swap_pos2]: pos1})

    var { data } = await supabase.from('Leagues').select('current_week').eq('lid', lid)
    var current_week = data[0].current_week

    var { data } = await supabase.from('Matchups').select().eq('lid', lid).gte('week', current_week).or(`tid1.eq.${tid},tid2.eq.${tid}`)
    
     for (const matchup of data) {
       var mid = matchup.mid
       if (matchup.tid1 == tid) {
         var team_num = "team1_"
       } else {
         var team_num = "team2_"
       }
       var { error } = await supabase.from('Matchups').update({[team_num+swap_pos1]: pos2, [team_num+swap_pos2]: pos1}).eq('mid', mid)
    }

    if (swap_error) {
      console.log(swap_error)
    }
    if (!swap_error) {
      router.refresh()
    }
  }

  return (
    <>
    <button className="btn-primary" onClick={updatePos} style={{marginTop: 10 + "px"}}>Swap</button>
    <p id="error-p">Use button to swap players</p>
    </>
  )
}
