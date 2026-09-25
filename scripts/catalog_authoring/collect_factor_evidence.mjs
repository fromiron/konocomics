import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { lookup } from "node:dns";
import {
  appendFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import http from "node:http";
import https from "node:https";
import { BlockList, isIP } from "node:net";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { z } from "zod";
import {
  validateResearchRow,
  validateExhaustionRecord,
} from "./validate_factor_collection_batch.mjs";

const root = resolve(
  import.meta.dirname,
  "../../data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902",
);
const iso = () => new Date().toISOString();
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = (value) => JSON.stringify(value) + "\n";
const sessionSchema = z
  .object({ workId: z.string().trim().min(1), startedAt: z.iso.datetime() })
  .strict();
const captureSchema = z
  .object({
    kind: z.enum(["http-body", "browser-text", "search-snippet", "document-text"]),
    url: z.string().url(),
    resolvedUrl: z.string().url(),
    observedAt: z.union([z.iso.datetime({ offset: true }), z.iso.date()]).nullable(),
    status: z.number().int().min(100).max(599).nullable(),
    complete: z.boolean().nullable(),
    contentType: z.string().nullable(),
    contentEncoding: z.string().nullable(),
    error: z.string().nullable(),
  })
  .strict();

function inside(parent, path) {
  const part = relative(parent, path);
  return part && !isAbsolute(part) && part !== ".." && !part.startsWith(".." + sep);
}

function privatePath(directory, name) {
  directory = resolve(directory);
  assert(
    ["planning", "batches", "jobs"].some((area) => inside(join(root, area), directory)),
    "Use an assigned directory under planning, batches or jobs",
  );
  const path = resolve(directory, name);
  assert(inside(directory, path), "Path must stay inside the assigned directory");
  for (let current = path; current !== dirname(root); current = dirname(current)) {
    if (existsSync(current))
      assert(!lstatSync(current).isSymbolicLink(), `Linked path: ${current}`);
  }
  return path;
}

function session(directory) {
  assert(
    !existsSync(privatePath(directory, "research.jsonl")),
    "Completed research is immutable; use a new assignment directory",
  );
  return sessionSchema.parse(
    JSON.parse(readFileSync(privatePath(directory, "collection-session.json"), "utf8")),
  );
}

function event(directory, value) {
  const recorded = { at: iso(), ...value };
  appendFileSync(privatePath(directory, "collection-events.jsonl"), json(recorded));
  return recorded;
}

export function recordProgress(directory, phase, note = "") {
  session(directory);
  z.enum(["access-started", "access-changed", "reading-finished", "writing-started"]).parse(phase);
  z.string().parse(note);
  return event(directory, { kind: "collection-progress", phase, note });
}

export function startCollection(directory, workId) {
  const value = sessionSchema.parse({ workId, startedAt: iso() });
  const path = privatePath(directory, "collection-session.json");
  mkdirSync(dirname(path), { recursive: true });
  assert(!existsSync(privatePath(directory, "research.jsonl")), "Completed research is immutable");
  writeFileSync(path, json(value), { flag: "wx" });
  return value;
}

// Record already obtained material. This function never downloads or infers a read audit.
export function recordCapture(directory, input, body = null) {
  session(directory);
  const value = captureSchema.parse({
    resolvedUrl: input.url,
    observedAt: null,
    status: null,
    complete: null,
    contentType: null,
    contentEncoding: null,
    error: null,
    ...input,
  });
  publicUrl(value.url);
  publicUrl(value.resolvedUrl);
  assert(
    body === null ||
      Buffer.isBuffer(body) ||
      body instanceof Uint8Array ||
      (value.kind !== "http-body" && typeof body === "string"),
    "HTTP captures require original bytes; text captures accept strings",
  );
  const bytes = body === null ? null : Buffer.from(body);
  const name = `capture-${randomUUID()}`;
  const rawPath = bytes === null ? null : `${name}.body`;
  if (rawPath) writeFileSync(privatePath(directory, rawPath), bytes, { flag: "wx" });
  const capture = {
    ...value,
    recordedAt: iso(),
    rawPath,
    bytes: bytes?.length ?? null,
    sha256: bytes === null ? null : sha256(bytes),
  };
  const receiptPath = `${name}.json`;
  writeFileSync(privatePath(directory, receiptPath), json(capture), { flag: "wx" });
  let publisherReceiptPath = null;
  if (
    value.kind === "http-body" &&
    value.status === 200 &&
    value.complete &&
    z.iso.datetime({ offset: true }).safeParse(value.observedAt).success &&
    bytes !== null &&
    bytes.length > 0 &&
    new URL(value.url).protocol === "https:" &&
    new URL(value.resolvedUrl).protocol === "https:"
  ) {
    publisherReceiptPath = `${name}.publisher-receipt.json`;
    writeFileSync(
      privatePath(directory, publisherReceiptPath),
      json({
        url: value.url,
        resolvedUrl: value.resolvedUrl,
        fetchedAt: value.observedAt,
        status: 200,
        sha256: capture.sha256,
        bytes: capture.bytes,
      }),
      { flag: "wx" },
    );
  }
  event(directory, { kind: "capture-recorded", receiptPath });
  return { ...capture, receiptPath, publisherReceiptPath };
}

// Preserve one complete tool return, including multi-source searches, without model transcription.
// Request timing is not the origin server's fetch time; this is never a publisher receipt.
export function recordWebResponse(directory, request, response, timing = {}) {
  session(directory);
  z.record(z.string(), z.json()).parse(request);
  z.json().parse(response);
  const times = z
    .object({
      startedAt: z.iso.datetime({ offset: true }).nullable().default(null),
      finishedAt: z.iso.datetime({ offset: true }).nullable().default(null),
    })
    .strict()
    .parse(timing);
  const bytes = Buffer.from(typeof response === "string" ? response : JSON.stringify(response));
  const name = `web-response-${randomUUID()}`,
    rawPath = `${name}.body`,
    receiptPath = `${name}.json`;
  const receipt = {
    kind: "web-tool-response",
    tool: "web.run",
    request,
    ...times,
    recordedAt: iso(),
    encoding: typeof response === "string" ? "utf8-text" : "json",
    rawPath,
    bytes: bytes.length,
    sha256: sha256(bytes),
  };
  writeFileSync(privatePath(directory, rawPath), bytes, { flag: "wx" });
  writeFileSync(privatePath(directory, receiptPath), json(receipt), { flag: "wx" });
  event(directory, { kind: "web-response-recorded", receiptPath });
  return { ...receipt, receiptPath };
}

// This adapter runs in functions.exec, where tools and the per-session store are available.
// Only this local code is evaluated; remote text is passed as JSON data to the recorder.
export function webCollectorCode(directory) {
  directory = resolve(directory);
  session(directory);
  const record = `var webRecorder = await import(${JSON.stringify(import.meta.url)}); nodeRepl.write(webRecorder.recordWebResponse(${JSON.stringify(directory)},`;
  return `(async (request) => {
    const key = ${JSON.stringify("pending-collection-web:" + directory)};
    let pending = load(key);
    if (request !== undefined) {
      if (pending) throw new Error('Save the pending response before another request; call this function without arguments to retry storage.');
      const startedAt = new Date().toISOString();
      const response = await tools.web__run(request);
      pending = { request, response, timing: { startedAt, finishedAt: new Date().toISOString() } };
      store(key, pending);
    }
    if (!pending) throw new Error('No pending web response');
    const saved = await tools.mcp__node_repl__js({code: ${JSON.stringify(record)} +
      JSON.stringify(pending.request) + ',' + JSON.stringify(pending.response) + ',' + JSON.stringify(pending.timing) + '));',
      title: 'Save original web response'});
    if (saved.isError) { text(saved); throw new Error('Web response storage failed; the original response remains pending.'); }
    store(key, null);
    text(saved);
    text(pending.response);
  })`;
}

const privateAddresses = new BlockList();
for (const [address, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["224.0.0.0", 3],
])
  privateAddresses.addSubnet(address, prefix, "ipv4");
for (const [address, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
])
  privateAddresses.addSubnet(address, prefix, "ipv6");
function publicAddress(address) {
  return !privateAddresses.check(address, isIP(address) === 6 ? "ipv6" : "ipv4");
}

function publicUrl(input) {
  const url = new URL(input);
  const host = url.hostname.replace(/^\[|\]$/gu, "");
  assert(
    ["http:", "https:"].includes(url.protocol) && !url.username && !url.password,
    "Only public unauthenticated HTTP(S) URLs",
  );
  assert(!url.port || ["80", "443"].includes(url.port), "Use standard public HTTP(S) ports");
  assert(
    isIP(host)
      ? publicAddress(host)
      : host.includes(".") && !/(?:^|\.)(?:localhost|local|internal)\.?$/iu.test(host),
    "Private/local URL is not a collection source",
  );
  return url;
}

function publicLookup(hostname, options, callback) {
  lookup(hostname, options, (error, result, family) => {
    if (error) return callback(error);
    const addresses = Array.isArray(result) ? result.map((item) => item.address) : [result];
    if (!addresses.every(publicAddress))
      return callback(new Error("Private DNS address is not a collection source"));
    callback(null, result, family);
  });
}

// Native requests keep received bytes unchanged, including non-UTF-8 bodies.
function requestBody(url, { signal, timeoutMs, maxBytes }) {
  return new Promise((done) => {
    const startedAt = iso();
    const started = performance.now();
    let response,
      completed = false,
      length = 0;
    const chunks = [];
    const finish = (error = null) => {
      if (completed) return;
      completed = true;
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      done({
        startedAt,
        observedAt: response ? observedAt : null,
        elapsedMs: performance.now() - started,
        status: response?.statusCode ?? null,
        contentType: response?.headers["content-type"] ?? null,
        contentEncoding: response?.headers["content-encoding"] ?? null,
        location: response?.headers.location ?? null,
        retryAfter: response?.headers["retry-after"] ?? null,
        complete: error === null,
        error,
        body: response ? Buffer.concat(chunks) : null,
      });
    };
    let observedAt = null;
    const req = (url.protocol === "https:" ? https : http).get(
      url,
      {
        lookup: publicLookup,
        headers: {
          "User-Agent": "konocomics-catalog-collection/1.0",
          "Accept-Encoding": "identity",
        },
      },
      (res) => {
        response = res;
        observedAt = iso();
        res.on("data", (chunk) => {
          const available = maxBytes - length;
          chunks.push(chunk.subarray(0, Math.max(0, available)));
          length += chunk.length;
          if (length > maxBytes) {
            finish("body size limit exceeded");
            res.destroy();
            req.destroy();
          }
        });
        res.on("end", () => finish());
        res.on("error", (error) => finish(error.message));
        res.on("aborted", () => finish("response aborted"));
      },
    );
    const abort = () => req.destroy(new Error("collection request cancelled"));
    const timer = setTimeout(() => req.destroy(new Error("collection request timeout")), timeoutMs);
    req.on("error", (error) => finish(error.message));
    signal?.addEventListener("abort", abort, { once: true });
    if (signal?.aborted) abort();
  });
}

function retryAt(value) {
  if (!value) return 0;
  if (/^\d+$/u.test(value)) return Date.now() + Number(value) * 1000;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}

export async function fetchSelectedSources(
  directory,
  urls,
  { signal, timeoutMs = 15000, maxBytes = 8 * 1024 * 1024 } = {},
) {
  session(directory);
  z.array(z.string()).parse(urls);
  z.number().int().min(1).max(120000).parse(timeoutMs);
  z.number()
    .int()
    .min(1)
    .max(64 * 1024 * 1024)
    .parse(maxBytes);
  urls.forEach(publicUrl);
  const pending = [...new Set(urls)];
  const results = new Map(),
    active = new Set(),
    busy = new Set(),
    locks = new Map(),
    cooldown = new Map(),
    errors = [];
  async function withHost(host, fn) {
    const prior = locks.get(host);
    let release;
    const lock = new Promise((resolveLock) => {
      release = resolveLock;
    });
    locks.set(host, lock);
    await prior;
    try {
      return await fn();
    } finally {
      release();
      if (locks.get(host) === lock) locks.delete(host);
    }
  }
  async function acquire(original) {
    const attempts = [];
    let current = original,
      retries = 0;
    for (let hop = 0; hop < 8; hop += 1) {
      let url;
      try {
        url = publicUrl(current);
      } catch (error) {
        event(directory, { kind: "request-rejected", requestUrl: current, error: error.message });
        return { url: original, error: error.message, attempts };
      }
      const result = await withHost(url.host, async () => {
        if (signal?.aborted) return { deferred: "cancelled", retryAt: null };
        if ((cooldown.get(url.host) ?? 0) > Date.now())
          return {
            deferred: "host Retry-After",
            retryAt: new Date(cooldown.get(url.host)).toISOString(),
          };
        const response = await requestBody(url, { signal, timeoutMs, maxBytes });
        const capture = recordCapture(
          directory,
          {
            kind: "http-body",
            url: original,
            resolvedUrl: current,
            observedAt: response.observedAt,
            status: response.status,
            complete: response.complete,
            contentType: response.contentType,
            contentEncoding: response.contentEncoding,
            error: response.error,
          },
          response.body,
        );
        const nextTime = retryAt(response.retryAfter);
        if (nextTime > Date.now()) cooldown.set(url.host, nextTime);
        event(directory, {
          kind: "http-request",
          requestUrl: current,
          startedAt: response.startedAt,
          elapsedMs: response.elapsedMs,
          receiptPath: capture.receiptPath,
          status: response.status,
          error: response.error,
          retryAt: nextTime > Date.now() ? new Date(nextTime).toISOString() : null,
        });
        attempts.push(capture.receiptPath);
        return { ...capture, location: response.location, nextTime };
      });
      if (result.deferred) return { url: original, ...result, attempts };
      const redirect = [301, 302, 303, 307, 308].includes(result.status) && result.location;
      const retry =
        result.status === null ||
        result.status === 429 ||
        [500, 502, 503, 504].includes(result.status);
      if (result.nextTime - Date.now() > 1000)
        return { ...result, retryAt: new Date(result.nextTime).toISOString(), attempts };
      if (redirect) {
        if (result.nextTime > Date.now())
          await delay(result.nextTime - Date.now(), undefined, { signal });
        current = new URL(result.location, current).href;
      } else if (retry && retries++ < 1 && !signal?.aborted) {
        await delay(Math.max(250, result.nextTime - Date.now()), undefined, { signal });
      } else return { ...result, attempts };
    }
    return { url: original, error: "redirect/request limit reached", attempts };
  }
  // ponytail: limits are per invocation; use disjoint host assignments if workers overload a host.
  while (pending.length || active.size) {
    const index = pending.findIndex((url) => !busy.has(new URL(url).host));
    if (active.size < 2 && index !== -1) {
      const original = pending.splice(index, 1)[0],
        host = new URL(original).host;
      busy.add(host);
      const job = acquire(original)
        .then(
          (result) => results.set(original, result),
          (error) => {
            // Storage failures must fail the call; already written bodies remain recoverable.
            results.set(original, { url: original, error: error.message });
            errors.push(error);
          },
        )
        .finally(() => {
          active.delete(job);
          busy.delete(host);
        });
      active.add(job);
    } else await Promise.race(active);
  }
  if (errors.length)
    throw new AggregateError(
      errors,
      "Collection failed; existing raw captures and drafts were retained",
    );
  return urls.map((url) => results.get(url));
}

export function writeResearchSnapshot(directory, draft) {
  const started = session(directory);
  try {
    assert(
      !existsSync(privatePath(directory, "COLLECTION-HANDOFF.json")),
      "Partial handoff exists; preserve it and use a new collection revision",
    );
    assert(
      draft && typeof draft === "object" && !Array.isArray(draft),
      "Draft must be an agent-authored object",
    );
    assert(
      draft.workId === undefined || draft.workId === started.workId,
      "Draft/session work identity mismatch",
    );
    assert(draft.elapsedSeconds === undefined, "Elapsed time is measured from startCollection");
    const { narrativeToneExhaustion, ...observations } = draft;
    const measuredSeconds = (Date.now() - Date.parse(started.startedAt)) / 1000;
    const elapsedSeconds = measuredSeconds >= 0 ? measuredSeconds : null;
    if (elapsedSeconds === null)
      event(directory, { kind: "clock-moved-backwards", elapsedSeconds: null });
    const row = {
      schemaVersion: "factor-evidence-collector-v1",
      workId: started.workId,
      candidateOnly: true,
      reviewedByHuman: false,
      grokUsed: false,
      paidSourceUsed: false,
      remainingGaps: [],
      retryCondition: "",
      notes: "",
      ...observations,
      sources: Array.isArray(draft.sources)
        ? draft.sources.map((source) => ({ independentFrom: [], claimCandidates: [], ...source }))
        : draft.sources,
      elapsedSeconds,
    };
    validateResearchRow(row, new Set(), true);
    const bytes = Buffer.from(json(row));
    const path = privatePath(directory, "research.jsonl");
    let handoffSha256;
    // The optional sidecar is an agent's actual record, never generated exhaustion.
    // Write it first: a partial write cannot leave completed research without it.
    if (narrativeToneExhaustion !== undefined) {
      validateExhaustionRecord(narrativeToneExhaustion, row);
      const handoff = json({
        schemaVersion: "factor-collection-handoff-v1",
        researchSha256: sha256(bytes),
        narrativeToneExhaustion,
      });
      writeFileSync(privatePath(directory, "COLLECTION-HANDOFF.json"), handoff, { flag: "wx" });
      handoffSha256 = sha256(Buffer.from(handoff));
    }
    writeFileSync(path, bytes, { flag: "wx" });
    const receipt = {
      path,
      sha256: sha256(bytes),
      workId: row.workId,
      elapsedSeconds,
      semanticReviewRequired: true,
      sharedStorageRequired: true,
      ...(handoffSha256 ? { handoffSha256 } : {}),
    };
    event(directory, { kind: "research-written", ...receipt });
    return receipt;
  } catch (error) {
    event(directory, { kind: "write-failed", error: error.message });
    throw error;
  }
}

async function main() {
  const [command, directory, ...args] = process.argv.slice(2);
  assert(
    directory,
    "Usage: collect_factor_evidence.mjs start <assigned-dir> <workId> | fetch <assigned-dir> <URL...> | progress <assigned-dir> <phase> [note] | write <assigned-dir> <draft.mjs>",
  );
  if (command === "start") {
    assert.equal(args.length, 1);
    return startCollection(directory, args[0]);
  }
  if (command === "fetch") return fetchSelectedSources(directory, args);
  if (command === "progress") {
    assert(args.length === 1 || args.length === 2);
    return recordProgress(directory, ...args);
  }
  if (command === "write") {
    assert.equal(args.length, 1);
    session(directory);
    const draftPath = privatePath(directory, args[0]);
    assert(
      draftPath.endsWith(".mjs"),
      "Use an agent-authored ES module object, not handwritten JSON",
    );
    let draft;
    try {
      draft = (await import(pathToFileURL(draftPath).href)).default;
    } catch (error) {
      event(directory, { kind: "draft-load-failed", error: error.message });
      throw error;
    }
    return writeResearchSnapshot(directory, draft);
  }
  throw new Error(`Unknown command: ${command}`);
}

if (
  typeof process !== "undefined" &&
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().then(
    (result) => console.log(JSON.stringify(result)),
    (error) => {
      console.error(error);
      process.exitCode = 1;
    },
  );
}
