import { constants } from "node:fs";
import { copyFile, readFile, readdir, realpath } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const routes = ["", "empresa", "atuacao", "equipamentos", "clientes", "contato", "_not-found"];

function isWithin(root, candidate) {
  const rel = relative(root, candidate);
  return rel === "" || (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`));
}

export async function collectNestedSegmentPayloads(routeDirectory) {
  const routeRoot = await realpath(routeDirectory);
  const payloads = [];

  async function walk(directory, segments) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (segments.length === 0 && !entry.name.startsWith("__next.")) continue;
        await walk(resolve(directory, entry.name), [...segments, entry.name]);
        continue;
      }
      if (!entry.isFile() || segments.length === 0 || !entry.name.endsWith(".txt")) continue;

      const source = resolve(directory, entry.name);
      const flatName = [...segments, entry.name].join(".");
      const destination = resolve(routeRoot, flatName);
      if (!isWithin(routeRoot, destination)) {
        throw new Error(`Destino de payload fora da pasta da rota: ${destination}`);
      }
      payloads.push({ source, destination });
    }
  }

  await walk(routeRoot, []);
  return payloads;
}

async function copyUnlessIdentical(source, destination) {
  const sourceBytes = await readFile(source);
  let destinationBytes;
  try {
    destinationBytes = await readFile(destination);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  if (destinationBytes) {
    if (!sourceBytes.equals(destinationBytes)) {
      throw new Error(`Colisão: o destino já existe com conteúdo diferente: ${destination}`);
    }
    return false;
  }

  try {
    await copyFile(source, destination, constants.COPYFILE_EXCL);
    return true;
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    const racedBytes = await readFile(destination);
    if (!sourceBytes.equals(racedBytes)) {
      throw new Error(`Colisão: o destino já existe com conteúdo diferente: ${destination}`);
    }
    return false;
  }
}

export async function normalizeExportSegments(outDirectory, routePaths = routes) {
  const outRoot = await realpath(outDirectory);
  let copied = 0;

  for (const routePath of routePaths) {
    const routeCandidate = resolve(outRoot, routePath);
    if (!isWithin(outRoot, routeCandidate)) {
      throw new Error(`Rota fora da exportação out/: ${routePath}`);
    }

    let routeRoot;
    try {
      routeRoot = await realpath(routeCandidate);
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    if (!isWithin(outRoot, routeRoot)) {
      throw new Error(`Pasta da rota resolve para fora de out/: ${routePath}`);
    }

    for (const { source, destination } of await collectNestedSegmentPayloads(routeRoot)) {
      if (!isWithin(outRoot, destination)) {
        throw new Error(`Destino de payload fora de out/: ${destination}`);
      }
      if (await copyUnlessIdentical(source, destination)) copied++;
    }
  }

  return copied;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const outDirectory = resolve(process.cwd(), "out");
  const copied = await normalizeExportSegments(outDirectory);
  console.log(`Normalização pós-build concluída: ${copied} payload(s) copiado(s); originais preservados.`);
}