import { CERTAINLY_REQUIRED_KEY } from '../constants';
import { RelationNames } from '../file/File';

export default class Attributes {
    Attrs: Record<string, Record<string, any>>;
    private RelationNames: RelationNames = {};

    constructor(
        attr: Record<string, Record<string, any>>,
        relationNames: RelationNames
    ) {
        this.Attrs = attr;
        this.RelationNames = relationNames;
    }

    isAttributePopulatable(attr: any): boolean {
        // If it is a component / relation / dynamiczone it is always optional due to population
        switch (attr.type) {
            case 'nested':
                // we need to check equality since it could be undefined
                return attr.nullable === true;
            case 'media': // media is also always populatable
            case 'component':
            case 'dynamiczone':
            case 'relation':
                return true;
            default:
                break;
        }

        return false;
    }

    hasPopulatableAttributes() {
        for (const attrName in this.Attrs) {
            const attr = this.Attrs[attrName];
            if (this.isAttributePopulatable(attr)) {
                return true;
            }
        }
        return false;
    }

    getDependencies() {
        const dependencies = new Set<string>();
        for (const attrName in this.Attrs) {
            const attr = this.Attrs[attrName];
            switch (attr.type) {
                case 'nested':
                    const attrs = new Attributes(
                        attr.fields,
                        this.RelationNames
                    );
                    const deps = attrs.getDependencies();
                    deps.forEach((dep) => dependencies.add(dep));
                    break;
                case 'relation':
                    dependencies.add(attr.target);
                    break;
                case 'component':
                    dependencies.add(attr.component);
                    break;
                case 'media':
                    dependencies.add('builtins::Media');
                    break;
                case 'dynamiczone':
                    const componentDeps = attr.components ?? [];
                    componentDeps.forEach((dep) => dependencies.add(dep));
                    break;
                default:
            }
        }

        if (this.hasPopulatableAttributes()) {
            dependencies.add('builtins::ExtractNested');
            dependencies.add('builtins::ExtractFlat');
            dependencies.add('builtins::RequiredBy');
        }

        return Array.from(dependencies);
    }

    attributeToString(attrName: string, attr: any) {
        const isOptional = this.isAttributePopulatable(attr);
        const optionalString = isOptional ? '?' : '';
        const orNull = ' | null';
        const requiredString = attr?.[CERTAINLY_REQUIRED_KEY] === true ? '' : orNull;
        let str = `    ${attrName}${optionalString}: `;
        let isArray = false;
        switch (attr.type) {
            case 'nested':
                const nullableString = attr?.nullable ?? false ? ' | null' : '';
                const newAttrs = new Attributes(
                    attr.fields,
                    this.RelationNames
                );
                str += newAttrs.toString() + nullableString;
                break;
            case 'relation':
                const apiName = attr.target;
                const dependencyName =
                    this.RelationNames[apiName]?.name ?? 'any';
                const relationMultipleString = attr.relation.endsWith('ToMany')
                    ? '[]'
                    : orNull;
                str += '{ data: ';
                str += dependencyName;
                str += relationMultipleString;
                str += '; }';
                break;
            case 'component':
                const componentName = attr.component;
                const relationNameObj = this.RelationNames[componentName];
                const dependencyComponentName: string = relationNameObj.name;
                isArray = false;
                str += dependencyComponentName;
                if (attr.repeatable) {
                    str += '[]';
                } else {
                    str += requiredString;
                }
                break;
            case 'media':
                const mediaMultipleString = attr.multiple
                    ? '[]'
                    : requiredString;
                str += '{ data: ';
                str += this.RelationNames['builtins::Media'].name;
                str += mediaMultipleString;
                str += '; }';
                break;
            case 'password':
                return null;
            case 'enumeration':
                const enums = attr.enum.map((en: string) => `"${en}"`);
                enums.push('null');
                const typeString = enums.join(' | ');
                str += typeString;
                break;
            case 'dynamiczone':
                const relations = attr.components.map(
                    (componentName: string) => {
                        return this.RelationNames[componentName].name;
                    }
                );
                const relationsString = relations.join(' | ');
                str += `Array<${relationsString}>`;
                break;
            case 'string':
            case 'text':
            case 'richtext':
            case 'email':
            case 'uid':
                str += 'string';
                str += requiredString;
                break;
            case 'integer':
            case 'biginteger':
            case 'decimal':
            case 'float':
                str += 'number';
                str += requiredString;
                break;
            case 'date':
            case 'datetime':
            case 'time':
                str += 'string';
                str += requiredString;
                break;
            case 'boolean':
                str += attr.type;
                str += requiredString;
                break;
            case 'json':
            default:
                str += 'any';
                break;
        }
        const isArrayString = isArray ? '[]' : '';
        str += `${isArrayString};`;
        return str;
    }

    toFieldsString(): string {
        const strings = [];
        for (const attrName in this.Attrs) {
            const attr = this.Attrs[attrName];
            const attrString = this.attributeToString(attrName, attr);
            if (attrString === null) {
                continue;
            }
            strings.push(attrString);
        }
        return strings.map((s) => `${s}\n`).join('');
    }

    toString(): string {
        const strings = ['{'];
        strings.push(this.toFieldsString());
        strings.push('}');
        return strings.join('\n');
    }
}
