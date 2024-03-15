"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

function getPositionNyName(roster, name) {
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
        var {data} = await supabase.from('Teams').select('tid').eq('email', email)
        const tid = data[0].tid
        const player_add = document.getElementById("add-player-select").value
        const player_drop = document.getElementById("drop-player-select").value
        var pid_add = -1
        var pid_drop = -1
        console.log(player_add, player_drop, tid)
        
        var { data } = await supabase.from('Players').select('pid, name').or(`name.eq.${player_add},name.eq.${player_drop}`)
        if (data[0].name == player_add) {
            pid_add = data[0].pid
            pid_drop = data[1].pid
        } else {
            pid_add = data[1].pid
            pid_drop = data[0].pid
        }

        const position = getPositionNyName(roster[0], player_drop)

        //console.log(pid_add, pid_drop, position)

        var { error } = await supabase.from('Rostered').update({ [lid]: tid}).eq('pid', pid_add)
        var { error } = await supabase.from('Rostered').update({ [lid]: -1}).eq('pid', pid_drop)
        var { error } = await supabase.from('Teams').update({ [position] : player_add}).eq('email', email)

        router.push(`/league/${lid.slice(-1)}/team/${tid}`)
    }

    return (
        <button className="btn-primary" onClick={addPlayer}>Add Player from Free Agency</button>
    )
} 