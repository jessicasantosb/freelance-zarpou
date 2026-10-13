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
import { StepDestinationSchema } from "@/schemas/step-destination-info";
import { useInfoStore } from "@/stores/info-store";
import { SetStepProps } from "@/types/checkout-steps";
import { zodResolver } from "@hookform/resolvers/zod";
import { formateDate } from "@/lib/formateDate";

export function StepDestinationInfo({ setStep }: SetStepProps) {
  const { destinationInfo, setDestinationInfo } = useInfoStore(
    (state) => state
  );

  const form = useForm<z.infer<typeof StepDestinationSchema>>({
    resolver: zodResolver(StepDestinationSchema),
    defaultValues: { ...destinationInfo },
  });

  const onSubmit = (values: z.infer<typeof StepDestinationSchema>) => {
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
              <FormLabel required>Destino de interesse</FormLabel>
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
                <FormLabel required>Início da viagem (aproximada)</FormLabel>
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
                <FormLabel required>Fim da viagem (aproximado)</FormLabel>
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
                <FormLabel required>Número de adultos</FormLabel>
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
              <FormLabel required>Tipo de viagem</FormLabel>
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

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep("user")}
            className="h-11 px-5 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
          >
            ← Voltar
          </Button>

          <Button
            type="submit"
            className="h-11 px-6 rounded-xl bg-primary hover:bg-[#084574] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>Avançar para Preferências</span>
            <span className="text-secondary font-bold">→</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
