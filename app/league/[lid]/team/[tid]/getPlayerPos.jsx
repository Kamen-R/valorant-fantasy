export default async function getPlayerPos(supabase, name) {
  const { data, error } = await supabase.from('Players').select('position').eq('name', name)

  return data[0]
}

