import Link from "next/link";

import { workDetailStrings } from "@/lib/strings";

export default function WorkDetailNotFound() {
  return (
    <main className="work-detail-not-found">
      <h1>{workDetailStrings.notFound.title}</h1>
      <p>{workDetailStrings.notFound.description}</p>
      <Link className="interactive-press" href="/recommendations">
        {workDetailStrings.notFound.recommendations}
      </Link>
    </main>
  );
}
