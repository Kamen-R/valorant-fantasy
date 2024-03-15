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

    const name1 = document.getElementById(player1)
    const name2 = document.getElementById(player2)
    
    console.log(player1, player2, name1.innerHTML, name2.innerHTML)
    const { error } = await supabase.from('Teams').update({ [player1]: name2.innerHTML, [player2]: name1.innerHTML}).eq('lid', lid).eq('tid', tid)
    console.log({ [player1]: name1.innerHTML, [player2]: name2.innerHTML})

    if (error) {
      console.log(error)
    }
    if (!error) {
      console.log(error)
      router.refresh()
    }
  }

  return (
    <button className="btn-primary" onClick={updatePos}>Swap</button>
  )
}
