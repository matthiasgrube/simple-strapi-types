import { caseType } from '../utils/casing';
import Attributes from '../attributes/Attributes';
import { pascalCase } from 'change-case';
import { File } from '../file/File';

export default class Interface extends File {
    private NamePrefix = '';
    protected Attributes: any;

    constructor(
        baseName: string,
        attributes: any,
        relativeDirectoryPath: string,
        fileCaseType: caseType = 'pascal',
        prefix = ''
    ) {
        super(baseName, relativeDirectoryPath, fileCaseType);
        this.updateStrapiName();
        this.NamePrefix = prefix;
        this.Attributes = attributes;

        if (!attributes) {
            console.warn(`Warning: attributes for ${this.getStrapiName()} is empty!`);
        }
    }

    protected updateStrapiName() {
        this.StrapiName = `api::${this.BaseName}.${this.BaseName}`;
    }

    getStrapiName() {
        return this.StrapiName;
    }

    getDependencies() {
        return this.getAttributes().getDependencies();
    }

    getFullName() {
        const pascalName = pascalCase(this.BaseName);
        return `${this.NamePrefix}${pascalName}`;
    }

    hasPopulatableAttributes() {
        return this.getAttributes().hasPopulatableAttributes();
    }

    getAttributes(): Attributes {
        return new Attributes(this.Attributes, this.RelationNames);
    }

    attributesToString() {
        const attrs = this.getAttributes();
        return attrs.toString();
    }

    getInerfaceString() {
        const strArr = [`export interface ${this.getFullName()}`];
        strArr.push(' {\n');
        strArr.push(this.getInterfaceFieldsString());
        strArr.push('}');

        return strArr.join('');
    }

    getInterfaceFieldsString() {
        const strArr = [];
        strArr.push('id: number;\n');
        strArr.push('attributes: ');
        strArr.push(`${this.attributesToString()}`);
        strArr.push('\n');

        return strArr.join('');
    }

    toString() {
        const strings = [this.getTsImports(), this.getInerfaceString()];
        return strings.join('\n');
    }
}
