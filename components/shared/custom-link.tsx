import Link from "next/link";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";

type CustomLinkProps = {
  link: string;
  text: string;
};

export function CustomLink({ link, text }: CustomLinkProps) {
  return (
    <Button className="p-0">
      <Link href={link} target="_blank" className="px-4 py-2 h-full rounded-md flex items-center gap-2">
        {text}
        <ExternalLink />
      </Link>
    </Button>
  );
}
