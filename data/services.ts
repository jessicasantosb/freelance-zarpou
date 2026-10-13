type ServicesProps = {
  src: string;
  title: string;
  description: string;
};

export const services: ServicesProps[] = [
  {
    src: "/about/do-seu-jeito.png",
    title: "Viagens do seu jeito",
    description:
      "Você escolhe o destino e o estilo da sua viagem. Nossos consultores especialistas cuidam de cada detalhe com roteiros personalizados.",
  },
  {
    src: "/about/plataforma.png",
    title: "Plataforma confiável e segura",
    description:
      "Planeje e reserve hotéis e passagens aéreas online com confirmação imediata, transparência total e dados protegidos pela LGPD.",
  },
  {
    src: "/about/atendimento.png",
    title: "Atendimento humano, 24h por dia",
    description:
      "Antes, durante e depois do embarque. Sempre que precisar de assistência em qualquer lugar do mundo, nossa equipe estará a postos.",
  },
  {
    src: "/about/transparencia.png",
    title: "Transparência e preço justo",
    description:
      "Sem taxas ocultas ou surpresas. Negociamos tarifas especiais com fornecedores globais para oferecer parcelamento em até 12x sem juros.",
  },
];
