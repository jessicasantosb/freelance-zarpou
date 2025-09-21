"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { stepUserSchema } from "@/schemas/step-user";
import { useInfoStore } from "@/stores/info-store";
import { SetStepProps } from "@/types/checkout-steps";
import { formatCellphone } from "@/lib/format-cellphone";

export function StepUser({ setStep }: SetStepProps) {
  const { client, setClient } = useInfoStore((state) => state);

  const form = useForm<z.infer<typeof stepUserSchema>>({
    resolver: zodResolver(stepUserSchema),
    defaultValues: { 
      ...client,
      phone: client.phone || ""
    },
  });

  const onSubmit = ({ name, email, phone }: z.infer<typeof stepUserSchema>) => {
    setClient({ name, email, phone });
    setStep("destinationInfo");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Nome</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="Digite seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Digite seu email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="phone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Telefone de contato</FormLabel>
              <FormControl>
                <Input
                  placeholder="(00) 00000-0000"
                  value={formatCellphone(String(field.value ?? ""))}
                  maxLength={15}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    field.onChange(rawValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant={"outline"}>
          Próximo
        </Button>
      </form>
    </Form>
  );
}