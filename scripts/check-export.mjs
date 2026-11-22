import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { collectNestedSegmentPayloads } from './normalize-export-segments.mjs';

const manifest = JSON.parse(await readFile('.next/required-server-files.json', 'utf8'));
const base = manifest.config.basePath || '';
const routes = ['', 'empresa/', 'atuacao/', 'equipamentos/', 'clientes/', 'contato/'];

for (const route of routes) {
  const html = await readFile(`out/${route}index.html`, 'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${route} deve ter um h1`);
  assert.match(html, /lang="pt-BR"/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /name="description"/);
  assert.ok(html.includes(`href="${base}/favicon.ico`), `Favicon ausente em ${route || '/'}`);
  assert.ok(!/<form(?:\s|>)/i.test(html), `Formulário inesperado em ${route || '/'}`);
  assert.ok(!html.includes('mailto:'), `Link de email inesperado em ${route || '/'}`);
  assert.ok(!html.includes('tpi@tpigeometria.com.br'), `Email de contato inesperado em ${route || '/'}`);
  for (const target of routes) {
    assert.ok(html.includes(`href="${base}/${target}"`), `Link ausente ${route} -> ${target}`);
  }
  for (const match of html.matchAll(/(?:src|href)="([^"?#]+)[^"]*"/g)) {
    const url = match[1];
    if (!url.startsWith('/')) continue;
    assert.ok(url.startsWith(`${base}/`), `Asset fora do basePath: ${url}`);
    const local = url.slice(base.length);
    await access(`out${local}${local.endsWith('/') ? 'index.html' : ''}`);
  }
  const routeDirectory = resolve('out', route.replace(/\/$/, ''));
  for (const { source, destination } of await collectNestedSegmentPayloads(routeDirectory)) {
    await access(destination);
    assert.deepEqual(await readFile(destination), await readFile(source), `Payload sem contraparte flat: ${destination}`);
  }
}

await access('out/favicon.ico');
const contact = await readFile('out/contato/index.html', 'utf8');
assert.ok(contact.includes('id="contact-whatsapp-heading"'));
assert.ok(contact.includes('Fale pelo WhatsApp'));
for (const [name, number, label] of [['Darci', '5511975786427', '(11) 97578-6427'], ['Édson', '5511972773555', '(11) 97277-3555']]) {
  assert.ok(contact.includes(`href="https://wa.me/${number}" target="_blank" rel="noopener noreferrer"`), `WhatsApp seguro de ${name} ausente`);
  assert.ok(contact.includes(`<strong>${name}</strong>`), `Nome ${name} ausente`);
  assert.ok(contact.includes(`<span>${label}</span>`), `Número ${name} ausente`);
}
for (const uri of ['tel:+551140165452', 'tel:+5511975786427', 'tel:+5511972773555']) assert.ok(contact.includes(uri), `Telefone ausente: ${uri}`);
for (const text of ['Rua Felipe Cardoso de Campos, 412', 'Perus', '05207-090']) assert.ok(contact.includes(text), `Endereço incompleto: ${text}`);
assert.ok(!contact.includes('quote-form'));
assert.ok(!contact.toLowerCase().includes('formspree'));
await access('out/.nojekyll');
console.log(`Verificadas seis rotas, metadados, links, favicon, ausência de formulário/email, telefones, endereço, WhatsApp, payloads planos e .nojekyll (basePath: ${base || '/'}).`);