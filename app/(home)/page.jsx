import Link from "next/link";
import DisplayLeagues from "../components/DisplayLeagues";

export default function Home() {
  return (
    <main>
      <p>Welcome to Valorant Fantasy!</p>
      <h2>My Leagues</h2>
      <DisplayLeagues />
    </main>
  )
}


/* <div className="flex justify-center my-8">
        <Link href="/kickoff">
          <button className="btn-primary">Kickoff Statistics</button>
        </Link>
      </div>
*/
