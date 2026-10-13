import { LoadingScreen } from "@/components/shared/loading-screen";

export default function DestinosLoading() {
  return (
    <LoadingScreen
      title="Carregando Lugares Imperdíveis..."
      subtitle="Buscando as melhores cidades e pacotes de viagem da Zarpou"
      type="package"
      fullScreen={true}
    />
  );
}
