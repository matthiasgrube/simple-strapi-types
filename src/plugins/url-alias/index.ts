import { Events, SchemasType } from '../../events';
import InterfaceManager from '../../program/InterfaceManager';
import { HookTypes } from '../PluginManager';
import { PluginRegister } from '../types';
import { UrlAliasGet } from './type';

const addUrlAliasToAllContentTypes: HookTypes['AfterReadSchema'] = (
    state: InterfaceManager,
    { apiSchemas }: SchemasType
) => {
    apiSchemas.forEach(({ name, schema }) => {
        const { attributes } = schema;
        attributes.url_path = {
            type: 'string',
            required: true,
        };
    });
};

const addUrlAliasGetType = (state: InterfaceManager) => {
    const urlAliasGet = new UrlAliasGet();
    state.addType(urlAliasGet.getStrapiName(), urlAliasGet);
};

const register: PluginRegister = () => {
    return {
        [Events.AfterReadSchema]: [
            {
                fn: addUrlAliasToAllContentTypes,
                priority: 10,
            },
        ],
        [Events.AfterReadSchemas]: [
            {
                fn: addUrlAliasGetType,
                priority: 10,
            },
        ],
    };
};

export default register;
