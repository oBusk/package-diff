import libnpmdiff, { Options } from "libnpmdiff";
import { cache } from "react";

interface ErrorETARGET {
    code: "ETARGET";
    type: "version";
    wanted: string;
    versions: string[];
    distTags: Record<string, string>;
    defaultTag: string;
}

interface Error404 {
    code: "E404";
    pkgid: string;
}

export interface DiffError {
    code: number;
    error: string;
}

async function uncachedDoDiff(
    specs: [string, string],
    options: Options,
): Promise<string> {
    console.log("Calling libnpmdiff with", { specs, options });
    try {
        const result = await libnpmdiff(specs, options);

        return result;
    } catch (e: any) {
        console.error(`[${specs[0]},${specs[1]}] Diff error:`, e);

        const isEtarget = (e: any): e is ErrorETARGET => e.code === "ETARGET";
        const isE404 = (e: any): e is Error404 => e.code === "E404";

        if (isEtarget(e)) {
            const code = 404;

            if (e.type === "version") {
                throw {
                    code,
                    error: `Could not find version ${e.wanted}.`,
                };
            }

            throw {
                code,
                error: `Could not find`,
            };
        }

        if (isE404(e)) {
            const code = 404;

            throw {
                code,
                error: `Could not find package that matches "${e.pkgid}"`,
            };
        }

        throw {
            code: 500,
            error: "Unknown error",
        };
    }
}

const doDiff = cache(uncachedDoDiff);

export default doDiff;
