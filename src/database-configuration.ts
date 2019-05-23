// this stuff exists to coerce typescript

function requireVar(value: string | undefined): string {
    if (value === undefined) {
        throw new Error("var lookup failed");
    }

    return value;
}

export const DATABASE: string = requireVar(process.env.VUE_APP_DATABASE_URL);
export const USERNAME: string = requireVar(process.env.VUE_APP_DATABASE_USERNAME);
export const PASSWORD: string = requireVar(process.env.VUE_APP_DATABASE_PASSWORD);
