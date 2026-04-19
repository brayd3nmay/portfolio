import Link from 'next/link'

export default function GuiHome() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-xl font-semibold">Hi, I'm Brayden.</h1>
        <p className="mt-2 text-[var(--muted)]">
          I'm building at the intersection of technology, design, and business.
        </p>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-[var(--muted)] mb-3">About</h2>
        <p className="text-sm">
          CS &amp; Engineering student at Ohio State, Class of 2027. I work on ambitious projects at the intersection of technology, design, and business.
        </p>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-[var(--muted)] mb-3">Work</h2>
        <ul className="space-y-4">
          <li><div className="font-semibold">Builders</div><p className="text-sm">President. Programming, mentorship, and fundraising for the next generation of founders.</p></li>
          <li><div className="font-semibold">Mango</div><p className="text-sm">Founder. Investor matching platform powered by AI agents. Finalist, OSU Buckeye Accelerator.</p></li>
          <li><div className="font-semibold">Ohio State</div><p className="text-sm">B.S. Computer Science and Engineering, Class of 2027.</p></li>
        </ul>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-[var(--muted)] mb-3">Skills</h2>
        <ul className="text-sm space-y-1">
          <li>Design interfaces in Figma</li>
          <li>Build frontends with React and Next.js</li>
          <li>Write backends in Python, Java, TypeScript, C/C++, and Ruby</li>
          <li>Deploy on AWS, Vercel, and Cloudflare</li>
          <li>Containerize with Docker and run on Linux</li>
          <li>Build AI agents with LangGraph</li>
          <li>Ship everything through Git and GitHub</li>
        </ul>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-[var(--muted)] mb-3">More</h2>
        <ul className="text-sm space-y-1">
          <li><Link href="/gui/writing" className="underline">Writing</Link></li>
          <li><Link href="/gui/reading" className="underline">Reading</Link></li>
        </ul>
      </section>
    </div>
  )
}
