import Image from "next/image";
import HomerunSheet from "./homerun_sheet_04_08_26"; // default export

const Button = ({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary"; }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex h-12 w-full items-center justify-center rounded-full px-5 transition-colors md:w-[158px] ${
      variant === "primary"
        ? "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
        : "border border-solid border-black/[.08] hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
    }`}
  >
    {children}
  </a>
);

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center justify-between w-full max-w-3xl py-32 px-6 sm:items-start sm:px-16 bg-white dark:bg-black">
        
        {/* Logo */}
        <div className="relative w-32 h-8">
          <Image
            className="dark:invert object-contain"
            src="/next.svg"
            alt="Next.js logo"
            fill
            priority
          />
        </div>

        {/* Text Section */}
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left mt-8">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the <code>page.tsx</code> file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a href="https://vercel.com/templates?framework=next.js" className="font-medium text-zinc-950 dark:text-zinc-50">Templates</a>{" "}
            or the{" "}
            <a href="https://nextjs.org/learn" className="font-medium text-zinc-950 dark:text-zinc-50">Learning</a>{" "}
            center.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 text-base font-medium mt-12 sm:flex-row">
          <Button href="https://vercel.com/new?...">
            <div className="relative w-4 h-4">
              <Image
                className="dark:invert object-contain"
                src="/vercel.svg"
                alt="Vercel logomark"
                fill
              />
            </div>
            <span className="ml-2">Deploy Now</span>
          </Button>

          <Button href="https://nextjs.org/docs?..." variant="secondary">
            Documentation
          </Button>
        </div>

        {/* HomerunSheet Component */}
        <div className="mt-12 w-full">
          <HomerunSheet />
        </div>
      </main>
    </div>
  );
}