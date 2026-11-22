"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
const links = [["/", "Início"], ["/empresa/", "Empresa"], ["/atuacao/", "Atuação"], ["/equipamentos/", "Equipamentos"], ["/clientes/", "Clientes"], ["/contato/", "Contato"]];
const mobileQuery = "(max-width: 1050px)";
export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  function close(restoreFocus = false) {
    setOpen(false);
    if (restoreFocus) button.current?.focus();
  }
  useEffect(() => {
    const media = window.matchMedia(mobileQuery);
    let focusOrigin: HTMLElement | null = null;
    let frame = 0;
    const inNavigation = (target: EventTarget | null): target is HTMLElement =>
      target instanceof HTMLElement && (target === button.current || !!list.current?.contains(target));
    function rememberFocus(event: FocusEvent) {
      if (inNavigation(event.target)) focusOrigin = event.target;
      else if (event.target !== document.body || focusOrigin?.getClientRects().length) focusOrigin = null;
    }
    function releaseFocus(event: FocusEvent) {
      if (!inNavigation(event.target)) return;
      // CSS can blur a newly hidden control before resize runs. Retain that origin only.
      if (event.relatedTarget || event.target.getClientRects().length) focusOrigin = null;
    }
    function outsidePointer(event: PointerEvent) {
      if (!inNavigation(event.target)) focusOrigin = null;
    }
    function windowBlur() { focusOrigin = null; }
    function reset() {
      const active = document.activeElement;
      if (inNavigation(active)) focusOrigin = active;
      else if (active && active !== document.body && active !== document.documentElement) focusOrigin = null;
      const origin = focusOrigin;
      setOpen(false);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!origin || focusOrigin !== origin) return;
        const current = document.activeElement;
        if (current !== origin && current !== document.body && current !== document.documentElement) return;
        if (media.matches && list.current?.contains(origin)) button.current?.focus();
        else if (!media.matches && origin === button.current) {
          (list.current?.querySelector<HTMLElement>('[aria-current="page"]') ?? list.current?.querySelector("a"))?.focus();
        }
      });
    }
    if (inNavigation(document.activeElement)) focusOrigin = document.activeElement;
    document.addEventListener("focusin", rememberFocus);
    document.addEventListener("focusout", releaseFocus);
    document.addEventListener("pointerdown", outsidePointer);
    window.addEventListener("blur", windowBlur);
    window.addEventListener("resize", reset);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("focusin", rememberFocus);
      document.removeEventListener("focusout", releaseFocus);
      document.removeEventListener("pointerdown", outsidePointer);
      window.removeEventListener("blur", windowBlur);
      window.removeEventListener("resize", reset);
    };
  }, []);
  useEffect(() => {
    document.dispatchEvent(new CustomEvent("tpi:navigation", { detail: { open } }));
  }, [open]);
  useEffect(() => {
    if (!open) return;
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      button.current?.focus();
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  return <nav className="site-navigation" aria-label="Navegação principal" data-open={open}>
    <button ref={button} id="navigation-toggle" className="navigation-toggle" type="button" aria-expanded={open} aria-controls="navigation-links" onClick={() => setOpen(value => !value)}><span aria-hidden="true">☰</span> {open ? "Fechar menu" : "Abrir menu"}</button>
    <ul ref={list} id="navigation-links">{links.map(([href, label]) => <li key={href}><Link href={href} aria-current={pathname.replace(/\/$/, "") === href.replace(/\/$/, "") ? "page" : undefined} onClick={() => close(window.matchMedia(mobileQuery).matches)}>{label}</Link></li>)}</ul>
  </nav>;
}
