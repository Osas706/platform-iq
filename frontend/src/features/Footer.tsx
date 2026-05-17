import {  MailIcon } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-black">Platform IQ</p>
          <p className="text-xs text-black/70 max-w-[300px] md:max-w-md mt-1">
            Collaborate live, solve problems together, and master technical interviews in real time.
            Built for seamless pair programming and interactive coding sessions.
          </p>

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
            <FaGithub className="size-6" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-black transition-colors"
          >
            <FaLinkedin className="size-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
