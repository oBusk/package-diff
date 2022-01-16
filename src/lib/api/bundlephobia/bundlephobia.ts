import TIMED_OUT, { resultOrTimedOut } from "../TimedOut";
import BundlephobiaResponse from "./BundlephobiaResponse";
import BundlephobiaResults from "./BundlephobiaResults";

async function getPackage(spec: string): Promise<BundlephobiaResponse | null> {
    const response = await fetch(
        `https://bundlephobia.com/api/size?package=${spec}`,
    );
    if (response.status === 200) {
        const json: BundlephobiaResponse = await response.json();
        return json;
    } else if (response.status === 403) {
        // The package is blacklisted or not supported
        return null;
    } else {
        throw new Error(
            `Error fetching ${spec}, status: ${response.status}, message: ${
                (await response.json())?.message
            }`,
        );
    }
}

async function getPackages(
    aSpec: string,
    bSpec: string,
): Promise<BundlephobiaResults | null> {
    try {
        const [a, b] = await Promise.all([
            getPackage(aSpec),
            getPackage(bSpec),
        ]);

        if (a && b) {
            return { a, b };
        }
    } catch (e) {
        console.error(e);
    }

    return null;
}

async function bundlephobia([aSpec, bSpec]: [string, string]): Promise<
    BundlephobiaResults | null | TIMED_OUT
> {
    return resultOrTimedOut(getPackages(aSpec, bSpec));
}

export default bundlephobia;
