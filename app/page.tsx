import { MapPin, Code2, GraduationCap, Award, Terminal, Database, Cloud, Network, Server } from "lucide-react";
import PortfolioHeader from "@/components/PortfolioHeader";
import ProfileLinks from "@/components/ProfileLinks";
import ScrollMotion from "@/components/ScrollMotion";
import ProfileTerminal from "@/components/ProfileTerminal";
import NetworkBackground from "@/components/NetworkBackground";
import content from "@/content/portfolio.json";

function SectionHeading({number, title, id}: {number: string; title: string; id: string}) {
  return <div className="section-heading" data-reveal><h2 id={id}><span>{number}.</span> {title}</h2><span className="section-rule"/></div>;
}
const skillIcons = [Code2, Terminal, Database, Cloud, Network];

export default function Home() {
  return <>
    <NetworkBackground/>
    <a className="skip-link" href="#main">Skip to content</a>
    <PortfolioHeader/>
    <ScrollMotion/>
    <main id="main">
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy" data-reveal>
          <p className="hero-greeting">&gt; Hello, I’m</p>
          <h1 id="hero-title"><span>Devesh Kumar</span> <br/>Sharma</h1>
          <p className="hero-summary">Building scalable<br/><strong>backend systems.</strong></p>
          <p className="hero-description">I’m a software engineer specializing in backend architecture, high-performance APIs, and cloud infrastructure. Turning complex challenges into reliable, scalable systems.</p>
          <p className="hero-location"><MapPin size={16} aria-hidden="true"/>Bengaluru, India</p>
          <div className="hero-actions"><a className="button button-primary" href="#projects">Explore work</a><a className="button button-secondary" href="#contact">Let’s connect</a></div>
          <ProfileLinks/>
        </div>
        <div className="terminal-wrap" data-reveal data-reveal-delay="120"><ProfileTerminal/></div>
      </section>

      <section id="about" className="section container" aria-labelledby="about-heading">
        <SectionHeading number="01" title="About" id="about-heading"/>
        <div className="about-layout">
          <div className="about-copy" data-reveal><h3>Engineering behind<br/><span>the experience.</span></h3><p>{content.about}</p>
            <aside className="recognition-card" aria-label="Professional recognition"><Award size={26} aria-hidden="true"/><div><p className="eyebrow">AWARDED WITH</p>{content.awards.map(award => <h4 key={award}>{award}</h4>)}</div></aside>
          </div>
          <figure className="infrastructure-visual" data-reveal data-reveal-delay="100"><img className="infrastructure-image" data-scroll-image src="/images/server-infrastructure.webp" alt="Editorial illustration of organized server racks with electric blue lighting" width="1400" height="933" loading="lazy" decoding="async"/><figcaption><span>BACKEND / INFRASTRUCTURE</span><strong>Built for scale.<br/>Designed for reliability.</strong></figcaption></figure>
        </div>
        <div className="metrics">
          <div data-reveal><strong>10K<span>+</span></strong><p>Concurrent requests</p><small>Microservices at Kotak811</small></div>
          <div data-reveal data-reveal-delay="60"><strong>99.9<span>%</span></strong><p>Service uptime</p><small>Event-driven systems</small></div>
          <div data-reveal data-reveal-delay="120"><strong>1M</strong><p>Transactions per second</p><small>Live migration service at Amazon</small></div>
          <div data-reveal data-reveal-delay="180"><strong>2.5<span>×</span></strong><p>Annual recurring revenue</p><small>Impact of three delivered features</small></div>
        </div>
      </section>

      <section id="experience" className="section container narrow-section" aria-labelledby="experience-heading">
        <SectionHeading number="02" title="Experience" id="experience-heading"/>
        <div className="experience-list">{content.experience.map((job, index) => <article className="experience-entry" data-reveal key={`${job.company}-${job.role}`}>
          <span className="timeline-point" aria-hidden="true"/>
          <div className="experience-card"><div className="experience-heading"><h3>{job.role}<span>@ {job.company}</span></h3><span className="experience-date">{job.date}</span></div>
            <p className="experience-index">EXPERIENCE / 0{index + 1}</p><ul>{job.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
          </div>
        </article>)}</div>
      </section>

      <section id="projects" className="section container" aria-labelledby="projects-heading">
        <SectionHeading number="03" title="Projects" id="projects-heading"/>
        <div className="project-grid">{content.projects.map((project, index) => <article className="project-card" data-reveal data-reveal-delay={index * 80} key={project.name}>
          <div className="project-top"><span className="project-icon"><Code2 size={26} aria-hidden="true"/></span><span>PROJECT / 0{index + 1}</span></div>
          <h3>{project.name}</h3>{project.bullets.map(bullet => <p key={bullet}>{bullet}</p>)}
          <div className="tags">{project.stack.map(technology => <span key={technology}>{technology}</span>)}</div>
        </article>)}</div>
      </section>

      <section id="community" className="section container" aria-labelledby="community-heading">
        <SectionHeading number="04" title="Giving back to the community" id="community-heading"/>
        <p className="section-intro" data-reveal>Useful tools for developers. A little play for everyone.</p>
        <div className="project-grid">
          <a className="community-card" data-reveal href="https://100devtools.pages.dev/" target="_blank" rel="noopener noreferrer"><div className="community-image-frame"><img data-scroll-image src="/images/developer-toolbox.webp" alt="Editorial illustration of a mechanical keyboard and electronic components" width="1000" height="563" loading="lazy" decoding="async"/></div><div className="community-card-body"><span className="eyebrow">DEVELOPER RESOURCES</span><h3>Developer Tool Box</h3><p>Tools for everyday development.</p><span className="community-link">Visit the developer toolbox</span></div><span className="sr-only"> (opens in a new tab)</span></a>
          <a className="community-card" data-reveal data-reveal-delay="80" href="https://shatranj.pages.dev/" target="_blank" rel="noopener noreferrer"><div className="community-image-frame"><img data-scroll-image src="/images/online-chess.webp" alt="Editorial illustration of graphite and ivory chess pieces on a chessboard" width="1000" height="563" loading="lazy" decoding="async"/></div><div className="community-card-body"><span className="eyebrow">STRATEGY & PLAY</span><h3>Online Chess</h3><p>Take a break and play a game of chess online.</p><span className="community-link">Play chess</span></div><span className="sr-only"> (opens in a new tab)</span></a>
          <article className="community-card mock-server-card" data-reveal aria-labelledby="mock-server-title">
            <div className="mock-server-preview" aria-hidden="true">
              <Server size={36}/><span className="eyebrow">MOCK API PLATFORM</span>
              <div className="mock-response"><div className="mock-response-bar"><span>GET /api/demo</span><span>200 OK</span></div><pre><code>{'{\n  "response": "your preset",\n  "match": {\n    "params": {},\n    "headers": {},\n    "body": {}\n  }\n}'}</code></pre></div>
              <span className="mock-preview-caption">Configure. Match. Respond.</span>
            </div>
            <div className="community-card-body">
              <span className="eyebrow">DEVELOPER INFRASTRUCTURE</span><h3 id="mock-server-title">Mock Server</h3>
              <p>A configurable mock API platform for testing integrations and developing against predictable responses.</p>
              <ul className="mock-server-features">
                <li><strong>Flexible responses.</strong> Projects, endpoints, and response presets with configurable responses based on parameters, headers, and request bodies.</li>
                <li><strong>Account access.</strong> Google SSO account creation, a user profile, and optional email/password login after setting a password.</li>
                <li><strong>Owner API keys.</strong> Sign-in protects mock creation; each owner’s unique UUID API key protects mock execution.</li>
                <li><strong>Security controls.</strong> Ownership checks, CSRF protection, secure sessions, rate limits, payload limits, and masked sensitive headers in logs.</li>
                <li><strong>Deployment.</strong> Cloudflare Pages deployment prepared and a healthy AWS backend launched with PostgreSQL, Redis, and Caddy HTTPS.</li>
              </ul>
              <p className="mock-server-status"><span aria-hidden="true"/>Frontend connectivity still needs verification.</p>
            </div>
          </article>
        </div>
      </section>

      <section id="skills" className="section container" aria-labelledby="skills-heading">
        <SectionHeading number="05" title="Tech stack" id="skills-heading"/>
        <div className="skills-grid">{content.skills.map((group, index) => { const Icon = skillIcons[index]; return <article className="skill-card" data-reveal data-reveal-delay={index % 3 * 60} key={group.name}><Icon size={23} aria-hidden="true"/><h3>{group.name}</h3><ul>{group.items.map(skill => <li key={skill}>{skill}</li>)}</ul></article>; })}</div>
      </section>

      <section id="education" className="section container narrow-section" aria-labelledby="education-heading">
        <SectionHeading number="06" title="Education" id="education-heading"/>
        <div className="education-card" data-reveal><GraduationCap size={31} aria-hidden="true"/><div><h3>{content.education.institution}</h3><p>{content.education.degree}</p></div><span>{content.education.date}</span></div>
      </section>

      <section id="contact" className="contact-section container" aria-labelledby="contact-heading">
        <div data-reveal><p className="eyebrow">07. WHAT’S NEXT?</p><h2 id="contact-heading">Let’s build something<br/><span>remarkable.</span></h2><p className="contact-description">Have a backend challenge, a product idea, or a systems problem worth solving? Let’s connect and build reliable software together.</p><a className="button button-contact" href={content.socials.linkedin} target="_blank" rel="noopener noreferrer">Say hello<span className="sr-only"> on LinkedIn (opens in a new tab)</span></a><ProfileLinks/></div>
      </section>
    </main>
    <footer className="container site-footer"><p>© {new Date().getFullYear()} Devesh Kumar Sharma</p><p>Backend engineering · Bengaluru, India</p><a href="#">Back to top</a></footer>
  </>;
}
