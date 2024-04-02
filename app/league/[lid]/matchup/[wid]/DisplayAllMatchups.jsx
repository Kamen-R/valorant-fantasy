import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

async function getTeamNames(supabase, team_string) {
    var { data } = await supabase.from('Teams').select('tid, name, owner').or(team_string)

    var team_names = {}
    for (const item of data) {
        team_names[item.tid] = {name: item.name, owner: item.owner}
    }

    return team_names
  }

async function getGameData(supabase, wid) {
    var { data } = await supabase.from('Games').select().eq('week', wid)

    var point_dict = {}
    for (const game of data) {
        point_dict[game.name] = game.fpts
    }

    var { data } = await supabase.from('Players').select('name, team_code')

    var player_dict = {}
    for (const player of data) {
        if (!(player.name in point_dict)) {
            point_dict[player.name] = 0
        }
        player_dict[player.name] = player.team_code
    }

    //console.log(point_dict, player_dict)

    return {
        points: point_dict,
        players: player_dict
    }
}

function renderMatch(league_info, matchup, team_names, points, players){

    var renderedOutputTeam1 = league_info.roster_count.map(item => 
        <h4 key={'t1-' + item} className="team-1">{players[matchup[`team1_${item}`]] + ' ' + matchup[`team1_${item}`] + ' - ' + points[matchup[`team1_${item}`]]}</h4>
        )
    
      var renderedOutputTeam2 = league_info.roster_count.map(item => 
        <h4 key={'t2-' + item} className="team-2">{points[matchup[`team2_${item}`]] + ' - ' + players[matchup[`team2_${item}`]] + ' ' + matchup[`team2_${item}`]}</h4>
        )
      
      var renderedOutputMiddle = league_info.roster_count.map(item => 
        <h4 key={'middle-' + item} className="middle-info">{league_info.roster_spots[item]}</h4>
        )

    return (
        <div id="flex-container" style={{paddingBottom: "10px"}}>
          <div id="team-left">
            <h2 id="team-name-left">{team_names[matchup.tid1].name}</h2>
            {renderedOutputTeam1}
          </div>
          <div id="middle-matchup">
            <h2 id="score-left">{matchup.score1}</h2>
            <h2 style={{display: "inline", padding: "10px"}}>-</h2>
            <h2 id="score-right">{matchup.score2}</h2>
            {renderedOutputMiddle}
          </div>
          <div id="team-right">
            <h2 id="team-name-right">{team_names[matchup.tid2].name}</h2>
            {renderedOutputTeam2}
          </div>
        </div>
    );
}

export default async function DisplayAllMatchups(league_info, lid, wid) {
    const match_list = league_info['schedule'][wid]
    var match_string = ""
    for (const match of match_list) {
        match_string += `mid.eq.${match},`
    }

    const supabase = createServerComponentClient({ cookies })
    const { data:matchup_data } = await supabase.from('Matchups').select().or(match_string.slice(0, -1))
    //console.log(matchup_data)

    var team_string = ""
    for (const team of league_info['team_ids']) {
        team_string += `tid.eq.${team},`
    }

    const team_names = await getTeamNames(supabase, team_string.slice(0, -1))
    //console.log(team_names)

    const { points, players } = await getGameData(supabase, wid)
    //console.log(players, points)

    var renderedOutput = matchup_data.map(item => 
        renderMatch(league_info, item, team_names, points, players)
        )

    return renderedOutput;
}