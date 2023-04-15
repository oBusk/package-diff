import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ViewType } from "react-diff-view";
import decodePartts from "^/lib/decodeParts";
import { DEFAULT_DIFF_FILES_GLOB } from "^/lib/default-diff-files";
import destination from "^/lib/destination";
import EXAMPLES from "^/lib/examples";
import parseSimplePackageSpec from "^/lib/parseSimplePackageSpec";
import { parseQuery, QueryParams } from "^/lib/query";
import specsToDiff from "^/lib/utils/specsToDiff";
import splitParts from "^/lib/utils/splitParts";
import BundlephobiaDiff from "./_page/BundlephobiaDiff";
import DiffIntro from "./_page/DiffIntro";
import NpmDiff from "./_page/NpmDiff/NpmDiff";
import PackagephobiaDiff from "./_page/PackagephobiaDiff";
import { DIFF_TYPE_PARAM_NAME } from "./_page/paramNames";
import SizeComparisonSkeleton from "./_page/SizeComparisonSkeleton";

export interface DiffPageProps {
    params: { parts: string | string[] };
    searchParams: QueryParams & { [DIFF_TYPE_PARAM_NAME]: ViewType };
}

export function generateMetadata({ params: { parts } }: DiffPageProps) {
    const specs = splitParts(decodePartts(parts));

    const [a, b] = specs.map((spec) => parseSimplePackageSpec(spec));

    return {
        title: `Comparing ${a.name}@${a.version}...${b.name}@${b.version}`,
        description: `A diff between the npm packages "${a.name}@${a.version}" and "${b.name}@${b.version}"`,
    };
}

// Revalidate every 24 hours https://beta.nextjs.org/docs/api-reference/segment-config#revalidate
export const revalidate = 86400;

// Force caching even when using dynamic functions https://beta.nextjs.org/docs/api-reference/segment-config#fetchcache
export const fetchCache = "only-cache";

// We need nodejs since we use Npm libs https://beta.nextjs.org/docs/api-reference/segment-config#runtime
export const runtime = "nodejs";

const DiffPage = async ({
    params: { parts },
    searchParams,
}: DiffPageProps): Promise<JSX.Element> => {
    const { diffFiles, ...optionsQuery } = searchParams;

    const specsOrVersions = splitParts(decodePartts(parts));
    const { redirect: redirectTarget, canonicalSpecs } = await destination(
        specsOrVersions,
    );

    if (redirectTarget !== false) {
        redirect(
            `/${specsToDiff(canonicalSpecs)}?${Object.entries(searchParams)
                .map(([key, value]) => `${key}=${value}`)
                .join("&")}`,
        );
    } else {
        const options = parseQuery({
            // If no diffFiles is passed, use the default.
            // This is done here, since we don't want a fall back in the API
            diffFiles: diffFiles ?? DEFAULT_DIFF_FILES_GLOB,
            ...optionsQuery,
        });

        const [a, b] = canonicalSpecs.map((spec) =>
            parseSimplePackageSpec(spec),
        );

        return (
            <Suspense fallback={<div>Loading...</div>}>
                <DiffIntro
                    alignSelf="stretch"
                    a={a}
                    b={b}
                    services={
                        <>
                            <Suspense fallback={<div>Loading...</div>}>
                                {/* @ts-expect-error Server Component */}
                                <BundlephobiaDiff
                                    a={a}
                                    b={b}
                                    specs={canonicalSpecs}
                                />
                            </Suspense>
                            <Suspense
                                fallback={
                                    <SizeComparisonSkeleton
                                        serviceName="packagephobia"
                                        sizeRowNames={["Publish", "Install"]}
                                    />
                                }
                            >
                                {/* @ts-expect-error Server Component */}
                                <PackagephobiaDiff
                                    a={a}
                                    b={b}
                                    specs={canonicalSpecs}
                                />
                            </Suspense>
                        </>
                    }
                    options={options}
                />
                <Suspense fallback={<div style={{ flex: "1" }} />}>
                    {/* @ts-expect-error Server Component */}
                    <NpmDiff
                        a={a}
                        b={b}
                        specs={canonicalSpecs}
                        options={options}
                    />
                </Suspense>
            </Suspense>
        );
    }
};

export default DiffPage;
