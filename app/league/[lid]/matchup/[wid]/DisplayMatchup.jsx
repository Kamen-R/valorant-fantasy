import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

async function getWeeklyPoints(supabase, wid, player) {
  var { data } = await supabase.from('Games').select().eq('week', wid).eq('name', player)
  var num = 0

  if (data.length > 1) {
    num = (data[0].fpts + data[1].fpts) / 2
  } else if (data.length == 1) {
    num = data[0].fpts
  }

  return num
}

async function getTeamPoints(supabase, team, wid) {
    return {
        [team.duelist]: await getWeeklyPoints(supabase, wid, team.duelist),
        [team.controller]: await getWeeklyPoints(supabase, wid, team.controller)
    }
}

async function getTeam(supabase, tid) {
  var { data, error } = await supabase.from('Teams').select().eq('tid', tid)

  if (error) {
    console.log(error)
  }
  return {name: data[0].name, duelist: data[0].duelist, controller: data[0].controller}
}


export default async function DisplayMatchup(mid, wid) {
  const supabase = createServerComponentClient({ cookies })
  var { data } = await supabase.from('Matchups').select().eq('mid', mid)
  
  const tid1 = data[0].tid1
  const tid2 = data[0].tid2
  var team1 = await getTeam(supabase, tid1)
  var team2 = await getTeam(supabase, tid2)

  //console.log(team1, team2)
  var team1_stats = await getTeamPoints(supabase, team1, wid)
  var team2_stats = await getTeamPoints(supabase, team2, wid)
  const team1_total = team1_stats[team1.duelist] + team1_stats[team1.controller]
  const team2_total = team2_stats[team2.duelist] + team2_stats[team2.controller]
  //console.log(team1_stats, team2_stats)

    return (
      <div>
        <div style={{width: 800 + 'px'}}>
            <div style={{width: 300 + 'px', float: "left"}}>
            <h2>{team1.name} - {team1_total}</h2>
            <p>{team1.duelist} - {team1_stats[team1.duelist]}</p>
            <p>{team1.controller} - {team1_stats[team1.controller]}</p>
            </div>
            <div style={{width: 300 + 'px', float: "right"}}>
            <h2>{team2.name} - {team2_total}</h2>
            <p>{team2.duelist} - {team2_stats[team2.duelist]}</p>
            <p>{team2.controller} - {team2_stats[team2.controller]}</p>
            </div>
        </div>
        <div style={{clear: "both"}}></div>
      </div>
    );
}