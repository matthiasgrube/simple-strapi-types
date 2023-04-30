import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path/posix';
import { readDirFiltered } from '../utils';

export async function readSchema(schemaPath: string) {
    try {
        const schemaData = await readFile(schemaPath);
        return JSON.parse(schemaData.toString());
    } catch (e) {
        return null;
    }
}

export async function getApiFolders(strapiSrcRoot: string) {
    const path = join(strapiSrcRoot, 'api');
    return readDirFiltered(path);
}

export async function getComponentCategoryFolders(strapiSrcRoot: string) {
    const path = join(strapiSrcRoot, 'components');
    // If there exists no components, just fallback to an empty array.
    if (!existsSync(path)) {
        return [];
    }
    return readDirFiltered(path);
}

export async function getComponentSchemas(strapiSrcRoot: string) {
    const categories = await getComponentCategoryFolders(strapiSrcRoot);
    const nestedSchemasPromises = categories.map(async (category: string) => {
        const schemaFilesPath = join(strapiSrcRoot, 'components', category);
        const schemaFiles = await readDirFiltered(schemaFilesPath);
        const schemaNamesWithAttributesPromises = schemaFiles.map(async (file: string) => {
            const schemaPath = join(schemaFilesPath, file);
            const schema = await readSchema(schemaPath);
            const name = file.split('.')[0];
            return { name, schema };
        });
        const schemaNamesWithAttributes = await Promise.all(schemaNamesWithAttributesPromises);
        return { category, schemas: schemaNamesWithAttributes };
    });
    return Promise.all(nestedSchemasPromises);
}

export async function getApiSchemas(strapiSrcRoot: string) {
    const apiFolders = await getApiFolders(strapiSrcRoot);
    const schemasWithAttributesPromises = apiFolders.map(async (folder: string) => {
        const schemaPath = join(strapiSrcRoot, 'api', folder, 'content-types', folder, 'schema.json');
        const schema = await readSchema(schemaPath);
        return { name: folder, schema };
    });
    const schemasWithAttributes = await Promise.all(schemasWithAttributesPromises);
    const userPath = join(strapiSrcRoot, 'extensions', 'users-permissions', 'content-types', 'user', 'schema.json');
    const userSchema = await readSchema(userPath);

    return [...schemasWithAttributes, {
        name: 'user',
        schema: userSchema
    }];
}