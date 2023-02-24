import parser from "gitdiff-parser";
import type { Options } from "libnpmdiff";
import type { FileData } from "react-diff-view";
import adjustDiff from "^/lib/adjustDiff";
import doDiff from "^/lib/diff";
import SimplePackageSpec from "^/lib/SimplePackageSpec";
import countChanges from "^/lib/utils/countChanges";
import NoDiff from "./NoDiff";
import NpmDiffClient from "./NpmDiff.client";

export interface NpmDiffProps {
    a: SimplePackageSpec;
    b: SimplePackageSpec;
    specs: [string, string];
    options: Options;
}

const NpmDiff = async ({ a, b, specs, options }: NpmDiffProps) => {
    const diff = await doDiff(specs, options);

    let files: FileData[] = [];
    if (diff == null) {
        throw new Error("diff is null");
    } else if (diff == "") {
        return <NoDiff a={a} b={b} />;
    } else {
        const adjustedDiff = adjustDiff(diff);
        if (adjustedDiff) {
            files = parser.parse(adjustedDiff);
        }
    }

    const changes = files.map((file) => countChanges(file.hunks));
    const additions = changes
        .map(({ additions }) => additions)
        .reduce((a, b) => a + b, 0);
    const deletions = changes
        .map(({ deletions }) => deletions)
        .reduce((a, b) => a + b, 0);

    return (
        <NpmDiffClient
            a={a}
            b={b}
            files={files}
            additions={additions}
            deletions={deletions}
        />
    );
};

export default NpmDiff;
