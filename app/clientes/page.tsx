import type { Metadata } from "next";
import { ContactCTA, PageIntro } from "@/components/shared";
import { clients } from "@/lib/content";
export const metadata: Metadata = { title: "Clientes", description: "Empresas citadas no histórico de atendimento da TPI Geometria, conforme seu material de referência." };
export default function Clientes() { return <><PageIntro eyebrow="Clientes" title="Histórias de atendimento."><p>Conheça algumas empresas citadas no histórico de serviços prestados pela equipe da TPI Geometria.</p></PageIntro><section className="container section"><h2 className="client-heading">Empresas mencionadas no material da TPI</h2><p className="source-note">Os nomes abaixo são referências históricas de atendimento e não indicam contratos ou vínculos atuais.</p><ul className="client-grid">{clients.map((name, index) => <li key={name}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong></li>)}</ul></section><ContactCTA /></>; }
