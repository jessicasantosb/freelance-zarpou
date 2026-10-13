type MenuItemsProps = {
  src: string;
  text: string;
  href: string;
};

export const menuItems: MenuItemsProps[] = [
  {
    src: "/home/passagem.jpg",
    text: "Passagem de avião",
    href: "/passagens",
  },
  {
    src: "/home/hospedagem.jpg",
    text: "Hospedagem",
    href: "/hospedagens",
  },
  {
    src: "/home/pacotes.jpg",
    text: "Pacote de viagem",
    href: "/pacotes",
  },
  {
    src: "/home/ingressos.jpg",
    text: "Ingressos & Passeios",
    href: "/contato",
  },
  {
    src: "/home/aluguel.jpg",
    text: "Aluguel de carros",
    href: "/contato",
  },
];
