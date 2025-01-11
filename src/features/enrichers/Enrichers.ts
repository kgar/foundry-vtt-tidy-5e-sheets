export class Enrichers {
    static reference(uuid: string, text: string) {
        return `@UUID[${uuid}]{${text}}`;
    }
}