import { LoadingScreen } from "@/components/shared/loading-screen";

export default function PromocoesLoading() {
  return (
    <LoadingScreen
      title="Carregando Ofertas & Promoções..."
      subtitle="Buscando os melhores descontos e tarifas exclusivas da Zarpou"
      type="package"
      fullScreen={true}
    />
  );
}
