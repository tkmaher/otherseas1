import { sendEmail } from "@/functions/contact";
import { useActionState } from "react";

export default function ContactForm() {
    const [state, formAction, isPending] = useActionState(
        async (prevState: any, formData: FormData) => {
          return await sendEmail(formData);
        },
        null
    );
    
    return (
        <form className="contact-form" action={formAction}>
            <input type="text" name="name" id="name" required placeholder="name"/>

            <input type="email" name="email" id="email" required  placeholder="email"/>

            <input name="message" id="message"required placeholder="message"/>

            <button type="submit">Send</button>
        </form>
    )
}