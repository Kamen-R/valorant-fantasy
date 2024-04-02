"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function SwapButton({ lid, tid }) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const updatePos = async () => {
    const player1 = document.getElementById("player1-select").value
    const player2 = document.getElementById("player2-select").value

    if (player1 == player2) {
        return null
    }

    const pos1 = document.getElementById(player1).getElementsByTagName('p')[0]
    const pos2 = document.getElementById(player2).getElementsByTagName('p')[0]
    console.log(pos1.innerHTML.split(' ')[1], pos2.innerHTML.split(' ')[1])
    
    var { error } = await supabase.from('Teams').update({[pos1.id]: pos2.innerHTML.split(' ')[1], [pos2.id]: pos1.innerHTML.split(' ')[1]}).eq('lid', lid).eq('tid', tid)
    var swap_error = error
    console.log({ [pos1.id]: pos2.innerHTML, [pos2.id]: pos1.innerHTML})

    var { data } = await supabase.from('Leagues').select('current_week').eq('lid', lid)
    var current_week = data[0].current_week

    var { data } = await supabase.from('Matchups').select().eq('lid', lid).gte('week', current_week).or(`tid1.eq.${tid},tid2.eq.${tid}`)
    console.log(data)
    
     for (const matchup of data) {
       var mid = matchup.mid
       if (matchup.tid1 == tid) {
         var team_num = "team1_"
       } else {
         var team_num = "team2_"
       }
       var { error } = await supabase.from('Matchups').update({[team_num+pos1.id]: pos2.innerHTML.split(' ')[1], [team_num+pos2.id]: pos1.innerHTML.split(' ')[1]}).eq('mid', mid)
    }

    if (swap_error) {
      console.log(swap_error)
    }
    if (!swap_error) {
      router.refresh()
    }
  }

  return (
    <button className="btn-primary" onClick={updatePos} style={{marginTop: 10 + "px"}}>Swap</button>
  )
}
