import { LoadingScreen } from "@/components/shared/loading-screen";

export default function PacotesLoading() {
  return (
    <LoadingScreen
      title="Carregando Pacotes Promocionais..."
      subtitle="Combinando voos e hospedagens com até 25% de economia em 12x sem juros"
      theme="light"
      type="package"
      fullScreen={true}
    />
  );
}
