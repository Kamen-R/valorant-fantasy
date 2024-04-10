"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

function getPositionByName(roster, name) {
    for (let prop in roster) {
        if (roster[prop] === name) {
            return prop;
        }
    }
}

export default function AddButton({ email, lid, roster }) {
    const supabase = createClientComponentClient()
    const router = useRouter()
    router.refresh()

    const addPlayer = async () => {
        var { data } = await supabase.from('Leagues').select('weekly_matchup').eq('lid', lid.slice(-1))
        var current_week = data[0].weekly_matchup

        
        const player_add = document.getElementById("add-player-select").value
        const player_drop = document.getElementById("drop-player-select").value
        var { data } = await supabase.from('Games').select().eq('week', current_week).or(`name.eq.${player_add},name.eq.${player_drop}`)

        if (data.length !== 0) {
            var error_msg = `${data[0].name} has already played this week. You cannot add/drop them!`
            document.getElementById("error-msg").innerText = error_msg
            return null
        }

        var {data} = await supabase.from('Teams').select('tid').eq('email', email)
        const tid = data[0].tid
        //const player_add = document.getElementById("add-player-select").value
        //const player_drop = document.getElementById("drop-player-select").value
        var pid_add = 0
        var pid_drop = 0
        console.log(player_add, player_drop, tid)
        
        var { data } = await supabase.from('Players').select('pid, name').or(`name.eq.${player_add},name.eq.${player_drop}`)
        if (data[0].name == player_add) {
            pid_add = data[0].pid
            pid_drop = data[1].pid
        } else {
            pid_add = data[1].pid
            pid_drop = data[0].pid
        }

        const position = getPositionByName(roster[0], player_drop)

        //console.log(pid_add, pid_drop, position)

        var { error } = await supabase.from('Rostered').update({ [lid]: tid}).eq('pid', pid_add)
        var { error } = await supabase.from('Rostered').update({ [lid]: -1}).eq('pid', pid_drop)
        var { error } = await supabase.from('Teams').update({ [position] : player_add}).eq('tid', tid)

        //console.log(current_week)
        var { data } = await supabase.from('Matchups').select().eq('lid', lid.slice(-1)).gte('week', current_week).or(`tid1.eq.${tid},tid2.eq.${tid}`)
        //console.log(data)

        for (const matchup of data) {
            var mid = matchup.mid
            if (matchup.tid1 == tid) {
                var team_num = "team1_"
            } else {
                var team_num = "team2_"
            }
            var { error } = await supabase.from('Matchups').update({[team_num+position]: player_add}).eq('mid', mid)
        }

        var { error } = await supabase.from('Transactions').insert({type: 'add', add: pid_add, drop: pid_drop, lid: lid.slice(-1), tid: tid, player_add: player_add, player_drop: player_drop})

        router.push(`/league/${lid.slice(-1)}/team/${tid}`)
    }

    return (
        <>
        <p id="error-msg"></p>
        <button className="btn-primary" onClick={addPlayer}>Add Player from Free Agency</button>
        </>
    )
} 