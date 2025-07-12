import { ContactButton } from "@/components/shared/contact-button";

export function Cta() {
  return (
    <section className="h-[40dvh] md:h-[60dvh] grid grid-cols-1 md:grid-cols-2 mt-12 mb-16 shadow-xl">
      {/* Vídeo de Micaela Alejandro: https://www.pexels.com/pt-br/video/praia-litoral-espuma-oceano-10758010/ */}
      <video
        src="/cta.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="hidden md:block w-full h-[60dvh] object-cover"
      />

      <div className="flex-1 p-4 flex flex-col items-center justify-center bg-[#1e5f98] text-white text-center">
        <h1 className="text-2xl md:text-4xl font-bold">
          Garanta um futuro cheio de possibilidades
        </h1>
        <p className="py-4 text-md md:text-lg">
          O futuro é promissor para quem se antecipa
        </p>
        <ContactButton>Vamos conversar</ContactButton>
      </div>
    </section>
  );
}
