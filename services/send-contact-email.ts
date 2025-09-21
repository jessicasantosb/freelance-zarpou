import emailjs from "@emailjs/browser";

import { Contact } from "@/schemas/contact";

export const sendContactEmail = (values: Contact) => {
  return emailjs.send(
    process.env.NEXT_PUBLIC_SERVICE_ID || "",
    process.env.NEXT_PUBLIC_TEMPLATE_ID || "",
    {
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message,
    },
    process.env.NEXT_PUBLIC_PUBLIC_KEY || ""
  );
};
