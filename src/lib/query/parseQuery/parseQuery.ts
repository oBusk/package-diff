import DiffOptions from "^/lib/DiffOptions";
import QueryParams from "../QueryParams";
import parseBoolean from "./parseBoolean";
import parseNumber from "./parseNumber";
import parseString from "./parseString";
import trimUndefined from "./trimUndefined";

function parseQuery({
    diffFiles,
    diffNameOnly,
    diffUnified,
    diffIgnoreAllSpace,
    diffNoPrefix,
    diffSrcPrefix,
    diffDstPrefix,
    diffText,
}: QueryParams): DiffOptions {
    return trimUndefined({
        diffFiles: typeof diffFiles === "string" ? [diffFiles] : diffFiles,
        diffNameOnly: parseBoolean(diffNameOnly),
        diffUnified: parseNumber(diffUnified),
        diffIgnoreAllSpace: parseBoolean(diffIgnoreAllSpace),
        diffNoPrefix: parseBoolean(diffNoPrefix),
        diffSrcPrefix: parseString(diffSrcPrefix),
        diffDstPrefix: parseString(diffDstPrefix),
        diffText: parseBoolean(diffText),
    });
}

export default parseQuery;
