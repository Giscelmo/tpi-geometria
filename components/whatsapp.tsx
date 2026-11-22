"use client";
import { useEffect, useRef, useState } from "react";
import { contact } from "@/lib/content";
export function WhatsAppLinks() {
  return <ul className="whatsapp-links">{contact.whatsapp.map(person => <li key={person.name}><a href={person.whatsappHref} target="_blank" rel="noopener noreferrer"><strong>{person.name}</strong><span>{person.label}</span><span className="visually-hidden">Abre em nova guia</span></a></li>)}</ul>;
}
export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function outside(event: Event) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    function navigation(event: Event) {
      if ((event as CustomEvent<{ open: boolean }>).detail.open) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
        button.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    document.addEventListener("keydown", escape);
    document.addEventListener("tpi:navigation", navigation);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      document.removeEventListener("keydown", escape);
      document.removeEventListener("tpi:navigation", navigation);
    };
  }, [open]);
  return <div className="whatsapp-widget" ref={root}>
    <button id="whatsapp-toggle" className="button whatsapp-toggle" type="button" ref={button} aria-expanded={open} aria-controls="whatsapp-options" onClick={() => setOpen(value => !value)}>{open ? "Fechar WhatsApp" : "WhatsApp"}<span aria-hidden="true">{open ? "×" : "↗"}</span></button>
    <section id="whatsapp-options" className="whatsapp-options" aria-labelledby="whatsapp-heading" hidden={!open}><h2 id="whatsapp-heading">Com quem deseja falar?</h2><WhatsAppLinks /></section>
  </div>;
}
