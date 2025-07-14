import Image from "next/image";

export function Hero() {
  return (
    <div className="relative w-full h-[70svh]">
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-white h-full px-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Fale com a 
          <span className="font-extralight"> ZARPOU</span>
        </h1>

        <p className="text-xl md:text-2xl mt-6 max-w-2xl">
          nossa equipe está pronta para te ajudar de forma rápida e prática
        </p>
      </div>
      {/* Photo by Porapak Apichodilok: https://www.pexels.com/photo/gray-passport-on-brown-board-beside-red-plane-toy-346793/ */}

      <Image
        alt="city"
        src={"https://images.pexels.com/photos/346793/pexels-photo-346793.jpeg"}
        fill
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div className="absolute top-0 left-0 w-full h-full bg-primary/50 z-10" />
    </div>
  );
}
