"use client";

import Image from "next/image";
import * as motion from "motion/react-client";
import { useInView } from "react-intersection-observer";

import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { fromRightVariants, listVariants } from "@/lib/animation-variants";
import { menuItems } from "@/data/menu-items";

type MenuItemProps = {
  src: string;
  text: string;
};

export function Menu() {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <Container>
      <Title
        title="Tudo o que você precisa, em um só lugar"
        subtitle="Organize toda a sua viagem com praticidade e confiança"
      />
      <div className="pb-8 flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 lg:min-h-[60svh]">
        <ul
          ref={ref}
          className="pt-12 text-xl md:text-2xl text-left text-red-700 flex flex-col leading-14"
        >
          {menuItems.map((item, index) => (
            <motion.li
              key={index}
              custom={index}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={listVariants}
              transition={{ delay: index * 0.2 }}
              className="flex items-center gap-4 py-2"
            >
              <MenuItem src={item.src} text={item.text} />
            </motion.li>
          ))}
        </ul>

        <div className="hidden lg:flex flex-col">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fromRightVariants}
            className="relative size-[30rem] flex flex-col"
          >
            <Image
              alt="aircraft"
              src={"/Trip-pana.svg"}
              fill
              className="absolute object-cover"
            />
          </motion.div>

          <a
            href="https://storyset.com/travel"
            target="_blank"
            className="-mt-6 text-center text-sm text-muted-foreground italic"
          >
            ilustração por Storyset
          </a>
        </div>
      </div>
    </Container>
  );
}

const MenuItem = ({ src, text }: MenuItemProps) => {
  return (
    <>
      <div className="relative size-14 flex flex-col">
        <Image alt={text} src={src} fill className="absolute object-cover" />
      </div>
      <p className="text-black/80">{text}</p>
    </>
  );
};
