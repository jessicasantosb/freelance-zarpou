import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href={"/"}>
      <div className="relative size-24">
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

export function InlineLogoLight() {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <div className="relative size-12">
        <Image
          alt="logo"
          src={"/logo/logo-image-dark.svg"}
          fill
          className="absolute object-cover"
        />
      </div>
      <div className="relative h-6 w-20">
        <Image
          alt="logo"
          src={"/logo/logo-name-dark.svg"}
          fill
          className="absolute object-cover"
        />
      </div>
    </Link>
  );
}

export function InlineLogo() {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <div className="relative size-12">
        <Image
          alt="logo"
          src={"/logo/logo-image-light.svg"}
          fill
          className="absolute object-cover"
        />
      </div>
      <div className="relative h-6 w-20">
        <Image
          alt="logo"
          src={"/logo/logo-name-light.svg"}
          fill
          className="absolute object-cover"
        />
      </div>
    </Link>
  );
}
