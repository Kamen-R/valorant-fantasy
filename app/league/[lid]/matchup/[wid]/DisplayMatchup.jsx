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
  var stats = {}
  var total = 0

  for (const position of team.roster_count) {
    var points = await getWeeklyPoints(supabase, wid, team[`${position}`])
    total += points
    stats[position] = points
  }

  stats['total'] = total

  return stats
}

async function getTeam(supabase, team_num, matchup_data, lid) {
  var { data, error } = await supabase.from('Leagues').select('roster_count').eq('lid', lid)
  var team = {roster_count: data[0].roster_count}

  if (error) {
    console.log(error)
  }
  
  data[0].roster_count.forEach(position => {
    team[position] = matchup_data[0]['team' + team_num + '_' + position]
  });


  return team
}


export default async function DisplayMatchup(mid, wid, lid) {
  const supabase = createServerComponentClient({ cookies })
  var { data } = await supabase.from('Matchups').select().eq('mid', mid)
  
  const tid1 = data[0].tid1
  const tid2 = data[0].tid2
  var team1 = await getTeam(supabase, 1, data, lid)
  var team2 = await getTeam(supabase, 2, data, lid)
  //console.log(team1, team2)

  var { data } = await supabase.from('Leagues').select('roster_spots').eq('lid', lid)
  const roster_spots = data[0].roster_spots

  var { data } = await supabase.from('Teams').select('name').eq('tid', tid1)
  var team1_name = data[0].name
  var { data } = await supabase.from('Teams').select('name').eq('tid', tid2)
  var team2_name = data[0].name

  var team1_stats = await getTeamPoints(supabase, team1, wid)
  var team2_stats = await getTeamPoints(supabase, team2, wid)
  //console.log(team1_stats, team2_stats)

  var renderedOutputTeam1 = team1.roster_count.map(item => 
    // <div style={{display: "block"}} class="team-1">
      <h4 key={'t1-' + item} class="team-1">{team1[item]} - {team1_stats[item]}</h4>
      /* <div style={{display: "inline"}}>
        <svg width={"20"} height={"10"}>
          <rect width={"20"} height={"10"} fill="red"/>
        </svg>
      </div> */
    //</div>
    )
  var renderedOutputTeam2 = team2.roster_count.map(item => 
    <h4 key={'t2-' + item} class="team-2">{team2_stats[item]} - {team2[item]}</h4>
    )
  
  var renderedOutputMiddle = team1.roster_count.map(item => 
    <h4 key={'middle-' + item} class="middle-info">{roster_spots[item]}</h4>
    )


    return (
      <div id="flex-container">
        <div id="team-left">
          <h2 id="team-name-left">{team1_name}</h2>
          {renderedOutputTeam1}
        </div>
        <div id="middle-matchup">
          <h2 id="score-left">{team1_stats.total}</h2>
          <h2 style={{display: "inline", padding: "10px"}}>-</h2>
          <h2 id="score-right">{team2_stats.total}</h2>
          {renderedOutputMiddle}
        </div>
        <div id="team-right">
          <h2 id="team-name-right">{team2_name}</h2>
          {renderedOutputTeam2}
        </div>
      </div>
  );
}

//<div style={{width: 800 + 'px'}}>
//<div style={{width: 300 + 'px', float: "left"}}>
//<h2>{team1_name} - {team1_stats.total}</h2>
//<div style={{clear: "both"}}></div>
