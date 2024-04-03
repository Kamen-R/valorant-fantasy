import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import Players from './PlayerStats'
import { cookies } from 'next/headers'

export default async function PlayerPage({ params }) {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase.from('Leagues').select('region_string').eq('lid', params.lid)
  const region_string = data[0].region_string
  
  return (
    <div>
      <Players region_string={region_string}/>
    </div>
  )
}
