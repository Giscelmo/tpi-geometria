import type { Metadata } from "next";
import { PageIntro } from "@/components/shared";
import { WhatsAppLinks } from "@/components/whatsapp";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a TPI Geometria pelo WhatsApp ou telefone. Visite nosso endereço em Perus, São Paulo/SP.",
};

export default function Contato() {
  return (
    <>
      <PageIntro eyebrow="Contato" title="Vamos conversar sobre seu projeto.">
        <p>Fale com nossa equipe para esclarecer dúvidas e conhecer nossos serviços.</p>
      </PageIntro>
      <section className="container section contact-grid">
        <div>
          <section className="whatsapp contact-whatsapp" aria-labelledby="contact-whatsapp-heading">
            <h2 id="contact-whatsapp-heading">Fale pelo WhatsApp</h2>
            <WhatsAppLinks />
          </section>
          <article className="contact-card">
            <span className="eyebrow">Fale com a equipe</span>
            <h2>Telefones</h2>
            <ul className="phone-list">
              {contact.phones.map(phone => (
                <li key={phone.href}>
                  <a className="contact-link" href={phone.href}>{phone.name} · {phone.label} <span aria-hidden="true">↗</span></a>
                </li>
              ))}
            </ul>
          </article>
        </div>
        <div>
          <article className="address-card">
            <p className="eyebrow">São Paulo / SP</p>
            <h2>Nosso endereço</h2>
            <address>{contact.address}</address>
            <div className="address-decoration" aria-hidden="true">⊕</div>
          </article>
        </div>
      </section>
    </>
  );
}