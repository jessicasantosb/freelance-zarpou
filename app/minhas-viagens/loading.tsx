import { LoadingScreen } from "@/components/shared/loading-screen";

export default function MinhasViagensLoading() {
  return (
    <LoadingScreen
      title="Acessando Área do Viajante..."
      subtitle="Buscando suas reservas, vouchers confirmados e histórico de viagens"
      theme="light"
      fullScreen={true}
    />
  );
}
