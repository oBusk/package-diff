import npa from "npm-package-arg";
import filterUntil from "^/lib/utils/filterUntil";
import type { ApiVersionsResponse } from "^/pages/_middleware";
import AUTOCOMPLETE_SIZE from "../autcompleteSize";
import AutocompleteSuggestion from "../AutocompleteSuggestion";
import AutocompleteSuggestionTypes from "../AutocompleteSuggestionTypes";

async function getAutocompleteVersions(
    query: string,
): Promise<AutocompleteSuggestion[]> {
    const { name, rawSpec } = npa(query);

    const response = await fetch(`/api/versions?spec=${name}`);
    const versions: ApiVersionsResponse = await response.json();

    return filterUntil(
        // We want to show the most recent versions rather than the oldest
        versions.reverse(),
        // Very simplistic matcher
        ({ version }) => version.startsWith(rawSpec),
        // Stops searching after finding X results
        AUTOCOMPLETE_SIZE,
    ).map(({ name, version }) => ({
        type: AutocompleteSuggestionTypes.Version,
        value: `${name}@${version}`,
        title: `${name}@${version}`,
        titleWithHighlight: `<em>${name}@${rawSpec}</em>${version.slice(
            rawSpec.length,
        )}`,
        packageName: name,
    }));
}

export default getAutocompleteVersions;
