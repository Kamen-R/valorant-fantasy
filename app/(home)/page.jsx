import Link from "next/link";
import DisplayLeagues from "../components/DisplayLeagues";

export default function Home() {
  return (
    <main>
      <p>Welcome to Valorant Fantasy!</p>
      <h2>My Leagues</h2>
      <DisplayLeagues />
      <div>
        <h2>Information/Announcements</h2>
        <p>Currently, this website is still in beta and if you experience any problems please reach out.</p>
      </div>
    </main>
  )
}


/* <div className="flex justify-center my-8">
        <Link href="/kickoff">
          <button className="btn-primary">Kickoff Statistics</button>
        </Link>
      </div>
*/
