import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { normalizeExportSegments } from "../scripts/normalize-export-segments.mjs";

async function fixture(t) {
  const temp = await mkdtemp(join(tmpdir(), "tpi-export-segments-"));
  const out = join(temp, "out");
  await mkdir(out);
  t.after(() => rm(temp, { recursive: true, force: true }));
  return out;
}

test("normaliza payloads aninhados na rota e em rota aninhada, preserva bytes e é idempotente", async t => {
  const out = await fixture(t);
  const rootFlat = join(out, "__next.__PAGE__.txt");
  const contactSource = join(out, "contato", "__next.contato", "__PAGE__.txt");
  const contactFlat = join(out, "contato", "__next.contato.__PAGE__.txt");
  const nestedSource = join(out, "setor", "medicao", "__next.setor", "medicao", "__PAGE__.txt");
  const nestedFlat = join(out, "setor", "medicao", "__next.setor.medicao.__PAGE__.txt");
  const rootBytes = Buffer.from([0, 65, 255, 13, 10]);
  const contactBytes = Buffer.from("payload contato\n", "utf8");
  const nestedBytes = Buffer.from("payload rota aninhada\n", "utf8");

  await mkdir(join(out, "contato", "__next.contato"), { recursive: true });
  await mkdir(join(out, "setor", "medicao", "__next.setor", "medicao"), { recursive: true });
  await writeFile(rootFlat, rootBytes);
  await writeFile(contactSource, contactBytes);
  await writeFile(nestedSource, nestedBytes);

  assert.equal(await normalizeExportSegments(out, ["", "contato", "setor/medicao"]), 2);
  assert.deepEqual(await readFile(rootFlat), rootBytes, "payload já plano de Linux permanece intacto");
  assert.deepEqual(await readFile(contactFlat), contactBytes);
  assert.deepEqual(await readFile(nestedFlat), nestedBytes);
  assert.deepEqual(await readFile(contactSource), contactBytes, "arquivo original é preservado");
  assert.deepEqual(await readFile(nestedSource), nestedBytes, "origem aninhada é preservada");
  assert.equal(await normalizeExportSegments(out, ["", "contato", "setor/medicao"]), 0);
});

test("falha em colisão de conteúdo e preserva origem e destino", async t => {
  const out = await fixture(t);
  const source = join(out, "contato", "__next.contato", "__PAGE__.txt");
  const destination = join(out, "contato", "__next.contato.__PAGE__.txt");
  await mkdir(join(out, "contato", "__next.contato"), { recursive: true });
  await writeFile(source, "origem");
  await writeFile(destination, "destino diferente");

  await assert.rejects(normalizeExportSegments(out, ["contato"]), /Colisão/);
  assert.equal(await readFile(source, "utf8"), "origem");
  assert.equal(await readFile(destination, "utf8"), "destino diferente");
});

test("rejeita uma rota que escape de out/", async t => {
  const out = await fixture(t);
  await assert.rejects(normalizeExportSegments(out, ["../fora"]), /fora da exportação out/);
});