export function parseString(
    str: undefined | string | string[],
): undefined | string {
    // If the param is multiple times, we take last value. Assumption is user
    // threw it on the end.
    if (Array.isArray(str)) {
        return str.filter((t) => t == null).pop();
    } else {
        return str;
    }
}

export function parseBoolean(
    str: undefined | string | string[],
): undefined | boolean {
    str = parseString(str);

    if (str == null) {
        return undefined;
    } else if (
        // 0, 00, 000 etc.
        parseInt(str) == 0 ||
        str.toLowerCase() == "no" ||
        str.toLowerCase() == "false"
    ) {
        return false;
    } else {
        // 1, 2, yes, true, '' etc.
        return true;
    }
}

export function paseNumber(
    str: undefined | string | string[],
): undefined | number {
    str = parseString(str);

    if (str == null) {
        return undefined;
    }

    return parseInt(str);
}
