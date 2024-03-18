import Image from "next/image"
import Link from "next/link"
import Logo from './VFtemplogo.png'
import LogoutButton from './LogoutButton'
/* import LogoutButton from "./LogoutButton" */

export default function Navbar({ user }) {
  return (
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
      <Link href="/kickoff">Kickoff Player Stats</Link>
      <Link href="/kickoff-teams" className="mr-auto">Kickoff Team Stats</Link>
      {user && <span>Hello, {user.email}</span>}
      <LogoutButton />
    </nav>
  )
}

/* export default function Navbar({ user }) {
  return (
    <nav>
        <Image
            src={Logo}
            alt='VF Logo'
            width={70}
            quality={100}
            placeholder="blur"
        />
        <h1>Valorant Fantasy</h1>
        <Link href="/">Dashboard</Link>
        <Link href="/kickoff" className="mr-auto">Kickoff Statistics</Link>

        {user && <span>Hello, {user.email}</span>}
        <LogoutButton />
    </nav>
  )
}
 */