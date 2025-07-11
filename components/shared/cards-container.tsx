export function CardsContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex">
      <div className="flex-1 w-full py-8 flex gap-4 overflow-x-auto md:overflow-hidden">
        {children}
      </div>
    </div>
  );
}
