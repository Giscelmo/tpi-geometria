import type { Metadata } from "next";
import { Header, Footer } from "@/components/shared";
import { WhatsAppWidget } from "@/components/whatsapp";
import "./globals.css";
export const metadata: Metadata = { title: { default: "TPI Geometria | Alinhamento industrial", template: "%s | TPI Geometria" }, description: "Serviços de geometria, alinhamento óptico e nivelamento industrial. Conheça a TPI Geometria e converse com nossa equipe." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header /><main id="conteudo" tabIndex={-1}>{children}</main><Footer /><WhatsAppWidget /></body></html>; }
