import Link from "next/link";
import { home } from "@/data/home";

export function HomeHeader() {
  return (
    <header className="page-header">
      <div className="greeting">
        <p className="date">{home.date}</p>
        <h1>{home.greeting}</h1>
        <p className="summary">{home.summary}</p>
      </div>
      <Link className="button-primary" href="/prescribe">
        New prescription
      </Link>
    </header>
  );
}
