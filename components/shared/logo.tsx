import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function Logo({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Link href={"/"}>
      <div className={cn("relative size-24", className)} {...props}>
        <Image
          alt="logo"
          src={"/logo/logo.svg"}
          fill
          className="absolute object-cover"
        />
      </div>
    </Link>
  );
}

export function InlineLogoLight({
  className,
  imageClassName = "size-12",
  nameClassName = "h-7 w-24",
}: {
  className?: string;
  imageClassName?: string;
  nameClassName?: string;
} = {}) {
  return (
    <Link href={"/"} className={cn("flex items-center gap-2.5", className)}>
      <div className={cn("relative shrink-0", imageClassName)}>
        <Image
          alt="Zarpou"
          src={"/logo/logo-image-dark.svg"}
          fill
          className="absolute object-contain"
        />
      </div>
      <div className={cn("relative shrink-0", nameClassName)}>
        <Image
          alt="Zarpou Viagens e Turismo"
          src={"/logo/logo-name-dark.svg"}
          fill
          className="absolute object-contain"
        />
      </div>
    </Link>
  );
}

export function InlineLogo({
  className,
  imageClassName = "size-12",
  nameClassName = "h-7 w-24",
}: {
  className?: string;
  imageClassName?: string;
  nameClassName?: string;
} = {}) {
  return (
    <Link href={"/"} className={cn("flex items-center gap-2.5", className)}>
      <div className={cn("relative shrink-0", imageClassName)}>
        <Image
          alt="Zarpou"
          src={"/logo/logo-image-light.svg"}
          fill
          className="absolute object-contain"
        />
      </div>
      <div className={cn("relative shrink-0", nameClassName)}>
        <Image
          alt="Zarpou Viagens e Turismo"
          src={"/logo/logo-name-light.svg"}
          fill
          className="absolute object-contain"
        />
      </div>
    </Link>
  );
}
