import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

function getDate(time_string) {
    var date = new Date(time_string)

    return date.toLocaleString()
}

export default async function Transactions({ params }) {
    const supabase = createServerComponentClient({ cookies })
    var { data, error } = await supabase.from('Transactions').select('id, tid, player_add, player_drop, created_at').eq('lid', params.lid)
    const transactions = data

    var { data } = await supabase.from('Teams').select('tid, name').eq('lid', params.lid)
    var team_names = {}
    for (const team of data) {
        team_names[team.tid] = team.name
    }

    var renderedTable = transactions.map(item =>
        <tr key={item.id}>
          <td className="tg-0lax" >{team_names[item.tid]}</td>
          <td className="tg-0lax" >{item.player_add}</td>
          <td className="tg-0lax" >{item.player_drop}</td>
          <td className="tg-0lax" >{getDate(item.created_at)}</td>
        </tr>
        )
  
    return (
        <main>
        <h1 style={{textAlign: "center"}}>Transactions</h1>
        <table className="tg">
        <thead>
          <tr>
            <th className="tg-0lax">Team</th>
            <th className="tg-0lax">Player Added</th>
            <th className="tg-0lax">Player Dropped</th>
            <th className="tg-0lax">Time</th>
          </tr>
        </thead>
        <tbody>
          {renderedTable}
        </tbody>
        </table>
    </main>
  )
}
