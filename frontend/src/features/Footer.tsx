import {  MailIcon } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-black">Platform IQ</p>
          <a
            href="mailto:hello@platformiq.com"
            className="mt-1 inline-flex items-center gap-2 text-sm text-black/70 hover:text-black transition-colors"
          >
            <MailIcon className="size-4" />
            hello@platformiq.com
          </a>
        </div>

        <div className="flex items-center gap-4 text-sm text-black/70">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-black transition-colors"
          >
            {/* <Github className="size-4" /> */}
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-black transition-colors"
          >
            {/* <Linkedin className="size-4" /> */}
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
