import packument from "^/lib/api/npm/packument";
import Version from "./Version";

async function getAllVersions(spec: string): Promise<Version[]> {
    const result = await packument(spec);

    return Object.values(result.versions).map(({ name, version }) => ({
        name,
        version,
    }));
}

export default getAllVersions;
