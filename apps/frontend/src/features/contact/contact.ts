/** Professional contact details supplied in the resume. */
export const CONTACT = {
  email: "david.antonio.olmos.r@gmail.com",
  whatsapp: "525573978196",
};

export function emailLink(subject: string, body: string) {
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
export function whatsappLink(message: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
