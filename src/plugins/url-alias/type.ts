import { File } from '../../file/File';

export class UrlAliasGet extends File {
    constructor() {
        const baseName = 'url-alias';
        super(baseName, 'plugins/url-alias', 'pascal');
    }

    getStrapiName() {
        return 'plugins::url-alias.get';
    }

    getFullName() {
        return 'UrlAliasGet';
    }

    getDependencies() {
        return [];
    }

    toString() {
        return `
            export type ${this.getFullName()}<ContentType extends { attributes: {} }> = ContentType & {
                attributes: {
                    contentType: string;
                },
            }
        `;
    }
}
