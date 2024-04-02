import Link from "next/link";
import DisplayLeagues from "../components/DisplayLeagues";

export default function Home() {
  return (
    <main>
      <p>Welcome to Valorant Fantasy!</p>
      <div style={{paddingTop: "10px", paddingBottom: "10px"}}>
        <h2>Information/Announcements</h2>
        <p>Currently, this website is still in beta and if you experience any problems please reach out.</p>
      </div>
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
