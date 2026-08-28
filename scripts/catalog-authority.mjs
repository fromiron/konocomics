import {
  bootstrapCatalogAuthority,
  CATALOG_CUTOVER_SOURCE_COMMIT,
  verifyCatalogAuthority,
  verifyCatalogCutover,
} from "./catalog/authority.ts";

function option(args, name) {
  const index = args.indexOf(name);
  if (index < 0 || args[index + 1] === undefined) throw new Error(`Missing ${name}`);
  return args[index + 1];
}

const [command, ...args] = process.argv.slice(2);

try {
  if (command === "bootstrap") {
    const fromGit = option(args, "--from-git");
    const output = option(args, "--output");
    const result = bootstrapCatalogAuthority(process.cwd(), fromGit, output);
    console.log(`Bootstrapped ${result.tables} Catalog authority tables at ${result.output}.`);
  } else if (command === "verify") {
    if (args.length !== 0) throw new Error("verify does not accept options");
    const result = verifyCatalogAuthority(process.cwd());
    console.log(
      `Catalog authority PASS: ${result.tables} tables, ${result.opaqueFiles} opaque files, source ${result.sourceManifestDigest}.`,
    );
  } else if (command === "verify-cutover") {
    const againstGit =
      args.length === 0 ? CATALOG_CUTOVER_SOURCE_COMMIT : option(args, "--against-git");
    const result = verifyCatalogCutover(process.cwd(), againstGit);
    console.log(
      `Catalog authority cutover PASS: ${result.tables} tables, ${result.opaqueFiles} opaque files, source ${result.sourceManifestDigest}.`,
    );
  } else {
    throw new Error(
      "Usage: node --import tsx scripts/catalog-authority.mjs bootstrap --from-git <commit> --output <path> | verify | verify-cutover [--against-git <commit>]",
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
