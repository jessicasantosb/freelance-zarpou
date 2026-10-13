import { LoadingScreen } from "@/components/shared/loading-screen";

export default function CheckoutLoading() {
  return (
    <LoadingScreen
      title="Iniciando Checkout Seguro..."
      subtitle="Ambiente protegido por criptografia SSL 256-bit e conformidade LGPD"
      theme="light"
      type="payment"
      fullScreen={true}
    />
  );
}
