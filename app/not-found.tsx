import Link from "next/link";
export default function NotFound() { return <section className="container section"><p className="eyebrow">Página não encontrada</p><h1>Vamos voltar ao início?</h1><p>O endereço solicitado não está disponível.</p><Link className="button" href="/">Ir para o início</Link></section>; }
