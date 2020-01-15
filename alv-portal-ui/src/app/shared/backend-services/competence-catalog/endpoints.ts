export const KK_EDITOR_ENDPOINT = '/competencecatalogservice-editor' as const;
export const KK_PUBLIC_ENDPOINT = '/competencecatalogservice-public' as const;
export type KkEndpoint = typeof KK_EDITOR_ENDPOINT | typeof KK_PUBLIC_ENDPOINT ;
