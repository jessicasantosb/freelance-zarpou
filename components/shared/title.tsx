import { useInView } from "react-intersection-observer";
import * as motion from "motion/react-client";

import { fadeInTitleVariants } from "@/lib/animation-variants";

type TitleProps = {
  title: string;
  subtitle: string;
};

export function Title({ title, subtitle }: TitleProps) {
  const splittedTitle = title.split(" ");
  const [firstWord, ...rest] = splittedTitle;
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <div ref={ref}>
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeInTitleVariants}
        className="relative text-center"
      >
        <h1 className="text-2xl md:text-4xl font-bold">
          <span className="relative inline-block">
            {firstWord}
            <span className="h-2 w-24 absolute -bottom-1 -left-4 -z-10 rounded bg-primary" />
          </span>{" "}
          {rest.join(" ")}
        </h1>
        <p className="pt-2 text-md md:text-lg text-muted-foreground">
          {subtitle}
        </p>
      </motion.div>
    </div>
  );
}
