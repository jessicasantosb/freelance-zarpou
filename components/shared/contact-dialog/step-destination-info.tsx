import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

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
import { stepInfoSchema } from "@/schemas/step-destination-info";
import { useInfoStore } from "@/stores/info-store";
import { SetStepProps } from "@/types/checkout-steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { formateDate } from "@/lib/formateDate";
import { generateJumpedDataLink } from "@/lib/generate-jumped-link";

export function StepDestinationInfo({ setStep }: SetStepProps) {
  const { client, destinationInfo, setDestinationInfo } = useInfoStore(
    (state) => state
  );

  const link = generateJumpedDataLink({ client });

  const form = useForm<z.infer<typeof stepInfoSchema>>({
    resolver: zodResolver(stepInfoSchema),
    defaultValues: { ...destinationInfo },
  });

  const onSubmit = (values: z.infer<typeof stepInfoSchema>) => {
    const startDate = new Date(values.startDate);
    const endDate = new Date(values.endDate);

    const formattedStartDate = formateDate(startDate);
    const formattedEndDate = formateDate(endDate);

    setDestinationInfo({
      ...values,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
    setStep("travelInfo");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="destination"
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
        <div className="my-4 grid grid-cols-2 gap-2">
          <FormField
            name="startDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Início da viagem (aproximada)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="endDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fim da viagem (aproximado)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="numberOfAdults"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de adultos</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 2 adultos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="numberOfChildren"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de crianças</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 1 criança de 8 anos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="travelType"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de viagem</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: lazer, negócios, aventura, etc."
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
          <div>
            <Button type="button" variant={"link"}>
              <Link href={link} target="_blank" className="size-full">
                Pular
              </Link>
            </Button>

            <Button type="submit" className="bg-secondary">
              Próximo
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
