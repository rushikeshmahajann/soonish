import { FaGithub, FaStar } from "react-icons/fa6";
import { REPO } from "@/lib/socials";

/**
 * Star count for the repo, fetched on the server and cached for an hour, so
 * the pages stay static and GitHub's unauthenticated limit (60/hour) is never
 * close. Any failure — rate limit, network, repo renamed — resolves to null
 * and the button simply drops the count.
 */
async function getStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO.slug}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const { stargazers_count } = (await res.json()) as { stargazers_count?: number };
    return typeof stargazers_count === "number" ? stargazers_count : null;
  } catch {
    return null;
  }
}

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/**
 * The GitHub link, widened into a star button: icon, "Star", then the live
 * count behind a hairline divider. Same frosted surface as the other nav pills.
 * The star picks up the accent on hover.
 */
export async function GitHubStar() {
  const stars = await getStars();
  const label = stars === null ? "Star soonish on GitHub" : `Star soonish on GitHub, ${stars} ${stars === 1 ? "star" : "stars"}`;

  return (
    <a
      href={REPO.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="group flex h-7 items-center gap-1.5 rounded-full bg-black/80 pr-3 pl-2.5 text-sm text-white/90 backdrop-blur-xl transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/40"
    >
      <FaGithub size={14} aria-hidden="true" />
      <span aria-hidden="true">Star</span>
      {stars !== null && (
        <span aria-hidden="true" className="flex items-center gap-1 border-l border-white/15 pl-1.5 tabular-nums">
          <FaStar
            size={11}
            className="text-white/50 transition-colors group-hover:text-(--brand)"
          />
          {compact.format(stars)}
        </span>
      )}
    </a>
  );
}
