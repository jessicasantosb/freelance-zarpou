import emailjs from "@emailjs/browser";

import { Contact } from "@/schemas/contact";

export const sendContactEmail = (values: Contact) => {
  return emailjs.send(
    process.env.NEXT_PUBLIC_SERVICE_ID || "",
    process.env.NEXT_PUBLIC_TEMPLATE_ID || "",
    {
      ...values,
    },
    process.env.NEXT_PUBLIC_PUBLIC_KEY || ""
  );
};
