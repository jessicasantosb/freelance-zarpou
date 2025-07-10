type TitleProps = {
  title: string;
  subtitle: string;
};

export function Title({ title, subtitle }: TitleProps) {
  return (
    <div className="w-full text-center">
      <h1 className="text-4xl">{title}</h1>
      <p className="text-lg text-muted-foreground">{subtitle}</p>
    </div>
  );
}
