"use client";

export default function Error() {
  return (
    <main className="h-[100dvh] px-2 pt-32 pb-0 md:pb-14 flex flex-col items-center justify-center text-center">
      <h1 className="flex text-[5rem] md:text-[7rem] text-primary font-bold">
        Ah não!
      </h1>
      <p className="pb-2 text-3xl -mt-4">Algum erro ocorreu!</p>
    </main>
  );
}
