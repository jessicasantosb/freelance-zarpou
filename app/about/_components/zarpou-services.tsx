import { zarpouServices } from "@/data/zarpou-services";

export function ZarpouServices() {
  return (
    <div className="pb-12">
      <h1 className="pt-14 pb-4 text-2xl md:text-3xl font-bold">
        O que a Zarpou oferece
      </h1>

      {zarpouServices.map(({ title, description }) => (
        <div key={title} className="pb-4">
          <h3 className="text-lg font-bold tracking-wider text-primary">{title}</h3>
          <p className="leading-7">{description}</p>
        </div>
      ))}
    </div>
  );
}
