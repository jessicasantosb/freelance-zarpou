import { LoadingScreen } from "@/components/shared/loading-screen";

export default function HotelDetailLoading() {
  return (
    <LoadingScreen
      title="Carregando Detalhes da Hospedagem..."
      subtitle="Buscando acomodações, fotos e condições exclusivas na Zarpou"
      type="hotel"
      fullScreen={true}
    />
  );
}
