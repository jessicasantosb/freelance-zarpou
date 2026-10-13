import { LoadingScreen } from "@/components/shared/loading-screen";

export default function HospedagensLoading() {
  return (
    <LoadingScreen
      title="Buscando Hotéis e Resorts..."
      subtitle="Filtrando acomodações exclusivas, cancelamento grátis e café da manhã incluso"
      theme="light"
      type="hotel"
      fullScreen={true}
    />
  );
}
