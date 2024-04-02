import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function LeagueHome({ params }) {
    const lid = params.lid

    const supabase = createServerComponentClient({ cookies })
    var { data, error } = await supabase.from('Leagues').select('league_format, division1_name, division2_name').eq('lid', lid)
    const league_info = data

    if (league_info[0].league_format == "divisions") {
        var { data, error } = await supabase.from('Standings').select().eq('lid', lid).eq('division', 1)
        var division_1 = data.sort((a, b) => b.wins - a.wins || b.total_points - a.total_points)
        
        var { data, error } = await supabase.from('Standings').select().eq('lid', lid).eq('division', 2)
        var division_2 = data.sort((a, b) => b.wins - a.wins || b.total_points - a.total_points)

        var table_data = []
        for (let i = 0; i < division_1.length; i++) {
            // need if statement for ties
            var team1_record = division_1[i].wins + "-" + division_1[i].losses
            var team2_record = division_2[i].wins + "-" + division_2[i].losses

            table_data.push({team1_name: division_1[i].team_name, team2_name: division_2[i].team_name, team1_wins: team1_record,
                team2_wins: team2_record, team1_points: division_1[i].total_points, team2_points: division_2[i].total_points,
                team1_tid: division_1[i].tid, team2_tid: division_2[i].tid})
        }
        //console.log(table_data)

        var renderedTable = table_data.map(item => 
            <tr key={`${item.team1_name}-${item.team2_name}`}>
              <td className="tg-0lax" key={`${item.team1_name}`}>
                <Link href={`/league/${lid}/team/${item.team1_tid}`}>{item.team1_name}</Link>
              </td>
              <td className="tg-0lax" key={`${item.team1_wins}`}>{item.team1_wins}</td>
              <td className="tg-0lax" key={`points-${item.team1_name}-${item.team1_points}`}>{item.team1_points}</td>
              <td className="tg-0lax" key={`${item.team2_name}`}>
                <Link href={`/league/${lid}/team/${item.team2_tid}`}>{item.team2_name}</Link>
              </td>
              <td className="tg-0lax" key={`${item.team2_wins}`}>{item.team2_wins}</td>
              <td className="tg-0lax" key={`points-${item.team2_name}-${item.team2_points}`}>{item.team2_points}</td>
            </tr>
        )
    }

    return (
        <main>
            <h1 style={{textAlign: "center"}}>Standings</h1>
            <table className="tg">
            <thead>
              <tr>
                <th className="tg-baqh" colSpan={"3"}>{league_info[0].division1_name}</th>
                <th className="tg-baqh" colSpan={"3"}>{league_info[0].division2_name}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="tg-0lax" key={'team1_name'}>Team</td>
                <td className="tg-0lax" key={'team1_wins'}>W-L</td>
                <td className="tg-0lax" key={'team1_points'}>Total Points</td>
                <td className="tg-0lax" key={'team2_name'}>Team</td>
                <td className="tg-0lax" key={'team2_wins'}>W-L</td>
                <td className="tg-0lax" key={'team2_points'}>Total Points</td>
              </tr>
              {renderedTable}
            </tbody>
            </table>
        </main>
    )
}