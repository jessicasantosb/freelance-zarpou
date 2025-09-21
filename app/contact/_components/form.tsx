"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Container } from "@/components/shared/container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Contact } from "@/schemas/contact";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { sendContactEmail } from "@/services/send-contact-email";

export function ContactForm() {
  const form = useForm<Contact>();

  const onSubmit = async (values: Contact) => {
    try {
      await sendContactEmail(values);
      toast.success("Mensagem enviada com sucesso!");
      form.reset();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao enviar a mensagem. Tente novamente.");
    }
  };

  return (
    <Container>
      <div className="p-6 border border-primary rounded-md text-primary">
        <h3 className="text-3xl md:text-4xl font-bold">Entre em contato</h3>
        <p className="pt-2 pb-6 text-lg md:text-xl text-muted-foreground">
          Preencha o formulário abaixo e entraremos em contato o mais breve
          possível.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col md:flex-row gap-6 [&>*]:w-full">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Nome</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder="Digite seu nome"
                        {...field}
                        className="h-10"
                      />
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
                    <FormLabel>Celular</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite seu número de celular"
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu email"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="message"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Mensagem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite sua mensagem"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="h-10 text-lg">Enviar mensagem</Button>
          </form>
        </Form>
      </div>
    </Container>
  );
}
