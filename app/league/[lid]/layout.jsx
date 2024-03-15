import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "../../components/LogoutButton";
import Image from "next/image"
import Logo from '../../components/VFtemplogo.png'

async function getTeamID(lid, uid) {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase.from('Teams').select('tid').eq('lid', lid).eq('User UID', uid)
  
  return data
}

export default async function LeagueLayout({ children, params }) {
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase.auth.getSession()
  const lid = params.lid
  const tid = await getTeamID(lid, data.session.user.id)
  
  if (tid.length == 0) {
    redirect('/')
  }

  if (!data.session) {
    redirect('/login')
  }

  return (
    <>
      <nav>
        <a href="/">
          <Image
            src={Logo}
            alt='VF Logo'
            width={70}
            quality={100}
            placeholder="blur"
          />
        </a>
        <h1>Valorant Fantasy</h1>
        <Link href={`/league/${lid}/team/${tid[0].tid}`}>My Team</Link>
        <Link href={`/league/${lid}/matchup/1`}>Matchup</Link>
        <Link href={`/league/${lid}/players`} className="mr-auto">Players</Link>
        {data.session.user && <span>{data.session.user.email}</span>}
        <LogoutButton />
      </nav>
      {children}
    </>
  )
}
