type TitleProps = {
  title: string;
  subtitle: string;
};

export function Title({ title, subtitle }: TitleProps) {
  return (
    <div className="relative text-center">
      <h1 className="relative inline-block text-4xl">
        <span className="hidden md:block absolute -bottom-1 -left-4 -z-10 rounded h-2 w-24 bg-primary/50" />
        {title}
      </h1>
      <p className="pt-2 text-lg text-muted-foreground">{subtitle}</p>
    </div>
  );
}
