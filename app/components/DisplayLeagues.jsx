import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import getUser from "./GetUser";

async function getLeagues() {
  const supabase = createServerComponentClient({ cookies })
  const userid = await getUser()
  const { data, error } = await supabase.from('Users').select('leagues').eq('user_uid', userid)

   if (error) {
     console.log(error.message)
   }

  return data
}

async function getLeagueName(lid) {
    const supabase = createServerComponentClient({ cookies })
    const { data } = await supabase.from('Leagues').select('name').eq('lid', lid)

    return data[0].name
}

export default async function DisplayLeagues() {
  const leagues = await getLeagues()
  var leagueNames = []
  
  if (leagues.length == 0) {
    return <></>
  }
  for (let i = 0; i < leagues[0].leagues.length; i++) {
    var name = await getLeagueName(leagues[0].leagues[i])
    leagueNames.push(name)
  }
    
  var renderedOutput = leagueNames.map(item => <div key={item} className="card my-5"> <h3>{item}</h3> </div>)

  return (
    <>
      {renderedOutput}
    </>
  )
}
