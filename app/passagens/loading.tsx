import { LoadingScreen } from "@/components/shared/loading-screen";

export default function PassagensLoading() {
  return (
    <LoadingScreen
      title="Pesquisando Tarifas Aéreas..."
      subtitle="Conectando com companhias aéreas nacionais e internacionais com taxas inclusas"
      theme="light"
      type="flight"
      fullScreen={true}
    />
  );
}
