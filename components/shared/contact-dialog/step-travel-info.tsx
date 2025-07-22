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
import { stepInfoSchema } from "@/schemas/step-travel-info";
import { useInfoStore } from "@/stores/info-store";
import { SetStepProps } from "@/types/checkout-steps";
import { zodResolver } from "@hookform/resolvers/zod";

export function StepTravelInfo({ setStep }: SetStepProps) {
  const { travelInfo, setTravelInfo } = useInfoStore((state) => state);

  const form = useForm<z.infer<typeof stepInfoSchema>>({
    resolver: zodResolver(stepInfoSchema),
    defaultValues: { ...travelInfo },
  });

  const onSubmit = (values: z.infer<typeof stepInfoSchema>) => {    
    setTravelInfo(values)
    setStep("finish");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col max-h-96 overflow-y-scroll gap-4">
          <FormField
            name="accommodationPreference"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferências de acomodação</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder="Ex: hotel, pousada, apartamento, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="roomType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de quarto</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: individual, duplo, família, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="mealPlan"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regime de alimentação desejado</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: café da manhã, meia pensão, pensão completa, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="transportation"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transporte</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: aéreo, terrestre, marítimo"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="internalTransportation"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transporte interno desejado</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: aluguel de carro, transporte público, transfers"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="estimatedBudget"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Orçamento estimado para a viagem (por pessoa):
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="dietaryRestrictions"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restrições alimentares</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: alergias, restrições, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="otherSpecialNeeds"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outras necessidades especiais</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: acessibilidade, acompanhamento, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="additionalInfo"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Informações adicionais</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: aniversário, lua de mel, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-4 flex justify-between gap-2">
          <Button
            type="button"
            variant={"link"}
            onClick={() => setStep("destinationInfo")}
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
