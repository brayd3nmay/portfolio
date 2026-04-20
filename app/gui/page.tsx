import Link from 'next/link'

function Icon({ src, alt }: { src: string; alt: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className="inline-block h-6 w-6 align-[-6px] mx-0.5" />
}

export default function GuiHome() {
  return (
    <div className="space-y-10">
      <section>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src="/ascii-animation.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full rounded-xl"
        />
      </section>

      <section>
        <h1 className="text-xl font-semibold">Hi, I'm Brayden May.</h1>
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
          <li className="flex gap-3 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/builders.png" alt="" className="h-10 w-10 object-contain mt-0.5 dark:invert" />
            <div>
              <div className="font-semibold">Builders</div>
              <p className="text-sm">President. Programming, mentorship, and fundraising for the next generation of founders.</p>
            </div>
          </li>
          <li className="flex gap-3 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/mango.png" alt="" className="h-10 w-10 object-contain mt-0.5 block dark:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/mango-dark.png" alt="" className="h-10 w-10 object-contain mt-0.5 hidden dark:block" loading="lazy" />
            <div>
              <div className="font-semibold">Mango</div>
              <p className="text-sm">Founder. Investor matching platform powered by AI agents. Finalist at OSU Buckeye Accelerator and ShowOH/IO.</p>
            </div>
          </li>
          <li className="flex gap-3 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/ohio-state.png" alt="" className="h-10 w-10 object-contain mt-0.5" />
            <div>
              <div className="font-semibold">Ohio State</div>
              <p className="text-sm">B.S. Computer Science and Engineering, Class of 2027.</p>
            </div>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-[var(--muted)] mb-3">Skills</h2>
        <ul className="text-sm space-y-2">
          <li>I design interfaces in Figma <Icon src="/icons/figma.svg" alt="Figma" /></li>
          <li>
            build frontends with React <Icon src="/icons/react.svg" alt="React" /> and Next.js <Icon src="/icons/next-js.svg" alt="Next.js" />
          </li>
          <li>
            write backends in Python <Icon src="/icons/python.svg" alt="Python" />, Java <Icon src="/icons/java.svg" alt="Java" />, TypeScript <Icon src="/icons/typescript.svg" alt="TypeScript" />, C/C++ <Icon src="/icons/c++.svg" alt="C/C++" />, and Ruby <Icon src="/icons/ruby.svg" alt="Ruby" />
          </li>
          <li>
            deploy on AWS <Icon src="/icons/aws.svg" alt="AWS" />, Vercel <Icon src="/icons/vercel.svg" alt="Vercel" />, and Cloudflare <Icon src="/icons/cloudflare.png" alt="Cloudflare" />
          </li>
          <li>
            containerize with Docker <Icon src="/icons/docker.svg" alt="Docker" /> and run it on Linux <Icon src="/icons/linux.png" alt="Linux" />
          </li>
          <li>
            build AI agents with LangGraph <Icon src="/icons/langchain.png" alt="LangGraph" />
          </li>
          <li>
            and ship everything through Git <Icon src="/icons/git.svg" alt="Git" /> and GitHub <Icon src="/icons/github.svg" alt="GitHub" />
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-[var(--muted)] mb-3">More</h2>
        <ul className="text-sm space-y-1">
          <li><Link href="/gui/writing" className="underline">Blog</Link></li>
          <li><Link href="/gui/reading" className="underline">Reading</Link></li>
        </ul>
      </section>
    </div>
  )
}
