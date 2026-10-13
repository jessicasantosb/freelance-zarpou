import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

type CustomLinkProps = {
  link: string;
  text: string;
};

export function CustomLink({ link, text }: CustomLinkProps) {
  return (
    <Button asChild className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-medium">
      <Link href={link} className="px-4 py-2 flex items-center justify-center gap-2">
        {text}
        <ArrowRight className="size-4 text-secondary" />
      </Link>
    </Button>
  );
}
