import Link from "next/link";
import { Button } from "../ui/button";

type CustomLinkProps = {
  link: string;
  text: string;
};

export function CustomLink({ link, text }: CustomLinkProps) {
  return (
    <Button className="p-0">
      <Link href={link} className="px-4 py-2 h-full rounded-md">
        {text}
      </Link>
    </Button>
  );
}
