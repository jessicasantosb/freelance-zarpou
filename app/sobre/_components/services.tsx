import { Container } from "@/components/shared/container";
import { services } from "@/data/services";
import Image from "next/image";

export function Services() {
  return (
    <Container>
      <h1 className="py-12 text-3xl md:text-5xl text-center text-primary font-bold">
        O que nós oferecemos
      </h1>

      {services.map(({ title, description, src }) => (
        <div
          key={title}
          className="mb-8 md:mb-14 relative w-full h-64 rounded-md select-none"
        >
          <Image
            alt=""
            src={src}
            fill
            className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-primary/50 z-10 rounded-md" />

          <div className="z-50 absolute bottom-0 left-0 p-4 md:p-8 text-white">
            <h3 className="pb-2 text-2xl md:text-4xl font-bold tracking-wide md:tracking-wider">
              {title}
            </h3>
            <p className="text-sm md:text-2xl">{description}</p>
          </div>
        </div>
      ))}
    </Container>
  );
}
