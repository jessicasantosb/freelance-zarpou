import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { stepInfoSchema } from "@/schemas/step-info";
import { useInfoStore } from "@/stores/info-store";
import { SetStepProps } from "@/types/checkout-steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";

export function StepInfo({ setStep }: SetStepProps) {
  const { info, setInfo } = useInfoStore((state) => state);

  const form = useForm<z.infer<typeof stepInfoSchema>>({
    resolver: zodResolver(stepInfoSchema),
    defaultValues: { ...info },
  });

  const onSubmit = (values: z.infer<typeof stepInfoSchema>) => {
    const date = new Date(values.date);

    const formattedDate = date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setInfo({
      ...values,
      date: formattedDate,
    });
    setStep("finish");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <FormField
            name="destiny"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destino de interesse</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder="Ex: Nordeste / Não sei ainda"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="date"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da viagem (aproximada)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="count"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de pessoas</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 2 adultos e 1 criança" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo do contato / Mensagem</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Quero saber mais sobre pacotes para o Nordeste com hotel all inclusive."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex justify-between gap-2">
          <Button
            type="button"
            variant={"link"}
            onClick={() => setStep("user")}
          >
            Voltar
          </Button>
          <Button type="submit" className="bg-secondary">
            Finalizar
          </Button>
        </div>
      </form>
    </Form>
  );
}
