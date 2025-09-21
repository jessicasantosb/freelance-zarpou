type CardsContainerProps = {
  children: React.ReactNode;
  mdOverflowVisible?: boolean;
};

export function CardsContainer({
  children,
  mdOverflowVisible,
}: CardsContainerProps) {
  return (
    <div
      data-slot="cards-container"
      className={`w-full py-8 px-2 flex gap-4 overflow-auto overflow-y-hidden ${
        mdOverflowVisible && "md:overflow-visible"
      }`}
    >
      {children}
    </div>
  );
}
