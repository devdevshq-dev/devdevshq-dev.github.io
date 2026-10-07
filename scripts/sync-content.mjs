import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const project = new URL("../", import.meta.url);
const upstream = new URL("../details.md", project);
const local = new URL("content/details.md", project);
const source = existsSync(upstream) ? upstream : local;
const original = readFileSync(source, "utf8");
const clean = original.replace(/\[cite:\s*\d+\]/g, "");
const text = value => value.replace(/\*+/g, "").trim();
const section = name => {
  const match = clean.match(new RegExp(`^## ${name}\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m"));
  if (!match) throw new Error(`Missing ${name} section in details.md`);
  return match[1].trim();
};
const experience = [];
let company = "";
for (const line of section("Professional Experience").split("\n")) {
  if (line.startsWith("### ")) company = line.slice(4).trim();
  else if (line.startsWith("**")) {
    const [role, date] = line.split("|").map(text);
    experience.push({ company, role, date, bullets: [] });
  } else if (line.startsWith("* ")) experience.at(-1).bullets.push(text(line.slice(2)));
}
const projects = [];
const awards = section("Awards").split("\n").filter(line => line.startsWith("* ")).map(line => text(line.slice(2)));
for (const line of section("Projects").split("\n")) {
  if (line.startsWith("**")) {
    const [name, stack] = line.split("|").map(text);
    projects.push({ name, stack: stack.split(", "), bullets: [] });
  } else if (line.startsWith("* ")) projects.at(-1).bullets.push(text(line.slice(2)));
}
const skills = section("Technical Skills").split("\n").filter(line => line.startsWith("* ")).map(line => {
  const cleaned = text(line.slice(2));
  const colon = cleaned.indexOf(":");
  return { name: cleaned.slice(0, colon), items: cleaned.slice(colon + 1).trim().split(/,\s*(?![^()]*\))/) };
});
const educationLines = section("Education").split("\n").filter(Boolean);
const [institution, date] = educationLines[0].split("|").map(text);
const linkedin = clean.match(/\[LinkedIn\]\((.*?)\)/)?.[1];
const github = clean.match(/\[GitHub\]\((.*?)\)/)?.[1];
const secondGithub = clean.match(/\[GitHub \(devdevshq-dev\)\]\((.*?)\)/)?.[1];
const direct = url => url?.includes("google.com/search?q=") ? decodeURIComponent(url.split("?q=")[1]) : url;
if (!linkedin || !github || !secondGithub || !experience.length || projects.length !== 2 || skills.length !== 5) throw new Error("Portfolio content is incomplete");
const portfolio = { about: section("About Me"), socials: { linkedin: direct(linkedin), github: direct(github), secondGithub: direct(secondGithub) }, experience, awards, projects, skills, education: { institution, date, degree: text(educationLines[1]) } };
writeFileSync(new URL("content/portfolio.json", project), JSON.stringify(portfolio, null, 2) + "\n");
if (source !== local) writeFileSync(local, original);
console.log(`Synced portfolio content from ${fileURLToPath(source)}`);
