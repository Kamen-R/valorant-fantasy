// import { Suspense } from 'react';
// import Loading from "../loading";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import SwapButton from "./SwapButton";

// async function getPlayerPos(supabase, name) {
//   const { data, error } = await supabase.from('Players').select('position').eq('name', name)

//   return data[0].position
// }
//{getPlayerPos(supabase, data[0].duelist)}

export default async function Team({ params }) {
  const lid = params.lid
  const tid = params.tid

  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase.from('Teams').select().eq('lid', lid).eq('tid', tid)

    return (
      <>
        <select name="swap" id="player1-select">
          <option value="">--Choose a player you want to swap--</option>
          <option value="duelist">Duelist</option>
          <option value="controller">Controller</option>
        </select>
        <select name="swap" id="player2-select">
          <option value="">--Choose a player you want to swap--</option>
          <option value="duelist">Duelist</option>
          <option value="controller">Controller</option>
        </select>
        <SwapButton lid={lid} tid={tid}/>
        <>
          <div className="card my-5">
            <h3>Duelist</h3>
            <p id="duelist">{data[0].duelist}</p>
          </div>
          <div className="card my-5">
            <h3>Controller</h3>
            <p id="controller">{data[0].controller}</p>
          </div>
        </>
      </>
    );
}

// //<Suspense fallback={<Loading />}>
// <MyTeam />
// </Suspense>