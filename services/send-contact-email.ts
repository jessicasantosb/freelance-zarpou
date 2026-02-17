import { Contact } from "@/schemas/contact";

export const sendContactEmail = async (values: Contact) => {
  console.log(values);
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error("Falha ao enviar e-mail");
  }

  return response.json();
};
