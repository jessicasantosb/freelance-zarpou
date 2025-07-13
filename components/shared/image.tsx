"use client";

import Image from "next/image";
import { useState } from "react";

import { Skeleton } from "../ui/skeleton";

type CustomImageProps = {
  alt: string;
  src: string;
  rounded?: "rounded-xl" | "rounded-l-xl" | "rounded-t-xl";
};

export function CustomImage({ alt, src, rounded }: CustomImageProps) {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => setLoading(false);

  return (
    <>
      {loading ? (
        <Skeleton
          className={`h-full w-full flex items-center justify-center ${rounded}`}
        >
          <Image
            alt={alt}
            src={"/logo/logo-image-light.svg"}
            width={80}
            height={80}
            className="aspect-square object-cover opacity-70"
            onLoad={handleLoad}
          />
        </Skeleton>
      ) : (
        <Image
          alt={alt}
          src={src}
          fill
          sizes="auto"
          className={`absolute object-cover animate-in fade-in duration-700 ${rounded}`}
          onLoad={handleLoad}
          priority
        />
      )}
    </>
  );
}
