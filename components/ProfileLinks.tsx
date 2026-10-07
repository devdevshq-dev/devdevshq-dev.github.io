import { GitFork, ContactRound } from "lucide-react";
import content from "@/content/portfolio.json";

export default function ProfileLinks() {
  return <div className="profile-links">
    <a href={content.socials.linkedin} target="_blank" rel="noopener noreferrer"><ContactRound size={17}/>LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>
    <a href={content.socials.github} target="_blank" rel="noopener noreferrer"><GitFork size={17}/>devesh475<span className="sr-only"> (opens in a new tab)</span></a>
    <a href={content.socials.secondGithub} target="_blank" rel="noopener noreferrer"><GitFork size={17}/>devdevshq-dev<span className="sr-only"> (opens in a new tab)</span></a>
  </div>;
}
