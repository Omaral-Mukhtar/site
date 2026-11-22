import DigitalTwin from "./DigitalTwin";

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Omar Mokhtar home">
          <span className="brand-mark">OM</span>
          <span className="brand-name">Omar Mokhtar</span>
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#journey">Journey</a>
          <a href="#work">Work</a>
          <a className="nav-cta" href="mailto:omarlabague@gmail.com">Let&apos;s talk <span>↗</span></a>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse" /> Available for opportunities</div>
          <h1>Building systems.<br /><em>Engineering impact.</em></h1>
          <p className="hero-lede">
            Software engineer specializing in backend development and cloud infrastructure,
            turning complex ideas into reliable, scalable solutions.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore my work <span>↗</span></a>
            <a className="button button-ghost" href="/Profile.pdf" target="_blank" rel="noreferrer">View profile <span>↗</span></a>
          </div>
        </div>

        <div className="hero-visual" aria-label="Backend and cloud engineering diagram">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="core">
            <div className="core-grid" />
            <span>OM</span>
          </div>
          <div className="node node-api"><span className="node-dot" /><div><small>SYSTEM</small><strong>API</strong></div></div>
          <div className="node node-cloud"><span className="node-dot" /><div><small>INFRA</small><strong>AWS</strong></div></div>
          <div className="node node-devops"><span className="node-dot" /><div><small>PIPELINE</small><strong>DevOps</strong></div></div>
          <div className="data-card">
            <span className="status-dot" /> ALL SYSTEMS OPERATIONAL
          </div>
        </div>
      </section>

      <section className="ticker" aria-label="Core specialties">
        <div className="ticker-track">
          {["Backend Engineering", "Cloud Architecture", "AWS", "Docker Swarm", "DevOps", "Java"].map((item) => (
            <span key={item}>{item}<b>✦</b></span>
          ))}
        </div>
      </section>

      <section className="about shell" id="about">
        <div className="section-kicker"><span>01</span> ABOUT ME</div>
        <div className="about-grid">
          <h2>Engineering is not just<br />what I do. <em>It&apos;s how I think.</em></h2>
          <div className="about-copy">
            <p>I&apos;m Omar Mokhtar, a Computer Science student and software engineer based in Alexandria, Egypt. I build where backend logic, cloud infrastructure, and dependable systems meet.</p>
            <p>My approach combines hands-on technical depth with curiosity—learning continuously, collaborating closely, and turning ambitious ideas into practical products.</p>
            <a className="text-link" href="https://www.linkedin.com/in/omar-mokhtar-543600331" target="_blank" rel="noreferrer">Connect on LinkedIn <span>↗</span></a>
          </div>
        </div>
        <div className="stats">
          <article><strong>4+</strong><span>Technical disciplines</span></article>
          <article><strong>2027</strong><span>Computer Science degree</span></article>
          <article><strong>Alexandria</strong><span>Egypt · Open to remote</span></article>
        </div>
      </section>

      <section className="journey" id="journey">
        <div className="shell">
          <div className="section-kicker light"><span>02</span> CAREER JOURNEY</div>
          <div className="journey-heading">
            <h2>Where experience<br /><em>meets ambition.</em></h2>
            <p>A focused progression across cloud, DevOps, backend engineering, and community leadership.</p>
          </div>
          <div className="timeline">
            <article className="timeline-item">
              <time><span>2026</span> AUG — SEP</time>
              <div className="timeline-marker" />
              <div className="timeline-content">
                <p className="role">AWS Cloud Architecture Trainee</p>
                <h3>National Telecommunication Institute</h3>
                <p>Architected scalable, multi-tier AWS cloud infrastructure using serverless computing and automated deployment pipelines.</p>
                <div className="tags"><span>AWS</span><span>Cloud Architecture</span><span>IaaS</span></div>
              </div>
            </article>
            <article className="timeline-item">
              <time><span>2026</span> JUL — AUG</time>
              <div className="timeline-marker" />
              <div className="timeline-content">
                <p className="role">DevOps Intern</p>
                <h3>Bibliotheca Alexandrina</h3>
                <p>Executed stack deployments and cluster management, transitioning multi-container setups into Docker Swarm for high availability.</p>
                <div className="tags"><span>Docker Swarm</span><span>Deployment</span><span>Clustering</span></div>
              </div>
            </article>
            <article className="timeline-item">
              <time><span>2025 — 2026</span> JUL — APR</time>
              <div className="timeline-marker" />
              <div className="timeline-content">
                <p className="role">Java Trainee</p>
                <h3>Information Technology Institute</h3>
                <p>Advanced through the Yellow and Orange Java belts, strengthening software engineering fundamentals and applied problem-solving.</p>
                <div className="tags"><span>Java</span><span>Software Engineering</span></div>
              </div>
            </article>
            <article className="timeline-item">
              <time><span>2025 — 2026</span> MAR — MAR</time>
              <div className="timeline-marker" />
              <div className="timeline-content">
                <p className="role">Game Development</p>
                <h3>IEEE AIU Student Branch</h3>
                <p>Contributed to the student branch community through game development, technical learning, and collaborative project delivery.</p>
                <div className="tags"><span>Game Development</span><span>Community</span></div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="work shell" id="work">
        <div className="section-kicker"><span>03</span> SELECTED WORK</div>
        <div className="work-heading">
          <h2>Built for now.<br /><em>Designed for what&apos;s next.</em></h2>
          <p>Portfolio projects are being prepared.<br />A closer look at my process and systems is coming soon.</p>
        </div>
        <div className="project-card">
          <div className="project-visual">
            <div className="window-bar"><i /><i /><i /><span>portfolio / coming-soon</span></div>
            <div className="code-lines">
              <span><b>01</b> <i>const</i> future = <em>&quot;being built&quot;</em>;</span>
              <span><b>02</b> <i>await</i> nextMilestone();</span>
              <span><b>03</b> <i>return</i> impact;</span>
            </div>
          </div>
          <div className="project-copy">
            <span className="coming-label">IN PROGRESS</span>
            <h3>Project portfolio</h3>
            <p>Case studies across backend systems, cloud infrastructure, and DevOps will live here.</p>
            <a className="text-link" href="mailto:omarlabague@gmail.com?subject=Portfolio%20request">Request project details <span>↗</span></a>
          </div>
        </div>
      </section>

      <section className="contact shell">
        <div>
          <div className="section-kicker light"><span>04</span> START A CONVERSATION</div>
          <h2>Have a challenge?<br /><em>Let&apos;s engineer it.</em></h2>
        </div>
        <a className="contact-button" href="mailto:omarlabague@gmail.com">
          <span>Get in touch</span><b>↗</b>
        </a>
      </section>

      <footer className="footer shell">
        <a className="brand" href="#top"><span className="brand-mark">OM</span><span className="brand-name">Omar Mokhtar</span></a>
        <p>© 2026 Omar Mokhtar</p>
        <div><a href="https://www.linkedin.com/in/omar-mokhtar-543600331" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="mailto:omarlabague@gmail.com">Email ↗</a></div>
      </footer>
      <DigitalTwin />
    </main>
  );
}
