import { Container } from "@/components/shared/container";

export function About() {
  return (
    <Container>
      <h1 className="pt-8 text-3xl md:text-5xl text-center text-primary font-bold">
        Sobre a Zarpou Viagens e Turismo
      </h1>
      <div className="pt-6 text-justify leading-8 md:leading-9 text-primary text-xl md:text-2xl [&>*]:pb-4">
        <p>
          Fundada em Belo Horizonte por Ulisses Borba, a Zarpou nasceu com um
          propósito claro: ser o seu ponto de apoio seguro, prático e confiável
          na hora de planejar a viagem dos seus sonhos.
        </p>
        <p>
          Nossa missão vai além de vender pacotes. Queremos conectar você a
          experiências reais, com tranquilidade, liberdade e suporte em todas as
          etapas.
        </p>
        <p>
          Ao longo dos anos, crescemos e evoluímos e hoje, contamos com a
          tecnologia da ŌNER, uma das plataformas de viagens mais modernas do
          mercado. Com ela, você mesmo pode personalizar e gerenciar sua viagem,
          com autonomia total e a confiança de um atendimento humano 24h por
          dia.
        </p>
        <p>
          Já ajudamos centenas de viajantes a viverem experiências
          inesquecíveis, e estamos prontos pra fazer o mesmo por você, seja qual
          for o destino.
        </p>
      </div>
    </Container>
  );
}
