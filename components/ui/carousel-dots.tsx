interface CarouselDots<T> {
  items: T[];
  selectedIndex: number;
  scrollTo: (index: number) => void;
}
export function CarouselDots<T>({
  items,
  selectedIndex,
  scrollTo,
}: CarouselDots<T>) {
  return (
    <div className="flex justify-center mt-4 gap-2">
      {items.map((_, index) => (
        <button
          key={index}
          className={`w-3 h-3 rounded-full transition-colors ${
            index === selectedIndex ? "bg-primary" : "bg-primary/20"
          }`}
          onClick={() => scrollTo(index)}
        />
      ))}
    </div>
  );
}
