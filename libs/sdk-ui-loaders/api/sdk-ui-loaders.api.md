## API Report File for "@gooddata/sdk-ui-loaders"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { DashboardContext } from '@gooddata/sdk-ui-dashboard';
import { IAnalyticalBackend } from '@gooddata/sdk-backend-spi';
import { IClientWorkspaceIdentifiers } from '@gooddata/sdk-ui';
import { IDashboardBaseProps } from '@gooddata/sdk-ui-dashboard';
import { IDashboardEngine } from '@gooddata/sdk-ui-dashboard';
import { IDashboardPluginContract_V1 } from '@gooddata/sdk-ui-dashboard';
import { IDashboardProps } from '@gooddata/sdk-ui-dashboard';
import { IErrorProps } from '@gooddata/sdk-ui';
import { ILoadingProps } from '@gooddata/sdk-ui';
import { ObjRef } from '@gooddata/sdk-model';
import { default as React_2 } from 'react';
import { UseCancelablePromiseState } from '@gooddata/sdk-ui';

// @alpha (undocumented)
export type AdaptiveLoadOptions = {
    moduleFederationIntegration: ModuleFederationIntegration;
};

// @alpha (undocumented)
export class DashboardLoader implements IDashboardLoader {
    // (undocumented)
    static adaptive(options: AdaptiveLoadOptions): DashboardLoader;
    // (undocumented)
    forDashboard: (dashboardRef: ObjRef) => this;
    // (undocumented)
    fromClientWorkspace: (clientWorkspace: IClientWorkspaceIdentifiers) => this;
    // (undocumented)
    fromWorkspace: (workspace: string) => this;
    // (undocumented)
    load: () => Promise<DashboardLoadResult>;
    // (undocumented)
    onBackend: (backend: IAnalyticalBackend) => this;
    // (undocumented)
    static staticOnly(): DashboardLoader;
    // (undocumented)
    withBaseProps: (props: IDashboardBasePropsForLoader) => this;
    // (undocumented)
    withEmbeddedPlugins: (...plugins: IEmbeddedPlugin[]) => this;
    // (undocumented)
    withFilterContext: (filterContextRef: ObjRef) => this;
}

// @alpha
export type DashboardLoadResult = {
    ctx: DashboardContext;
    engine: IDashboardEngine;
    DashboardComponent: React_2.ComponentType<IDashboardProps>;
    props: IDashboardProps;
    plugins: IDashboardPluginContract_V1[];
};

// @alpha (undocumented)
export type DashboardLoadStatus = UseCancelablePromiseState<DashboardLoadResult, any>;

// @alpha
export const DashboardStub: React_2.FC<IDashboardStubProps>;

// @alpha
export interface IDashboardBasePropsForLoader extends Omit<IDashboardBaseProps, "dashboard"> {
    dashboard: ObjRef;
}

// @alpha (undocumented)
export interface IDashboardLoader {
    forDashboard(dashboardRef: ObjRef): IDashboardLoader;
    fromClientWorkspace(clientWorkspace: IClientWorkspaceIdentifiers): IDashboardLoader;
    fromWorkspace(workspace: string): IDashboardLoader;
    load(): Promise<DashboardLoadResult>;
    onBackend(backend: IAnalyticalBackend): IDashboardLoader;
    withBaseProps(props: IDashboardBaseProps): IDashboardLoader;
    withEmbeddedPlugins(...plugins: IEmbeddedPlugin[]): IDashboardLoader;
    withFilterContext(filterContextRef: ObjRef): IDashboardLoader;
}

// @alpha
export interface IDashboardLoadOptions extends IDashboardBasePropsForLoader {
    adaptiveLoadOptions?: AdaptiveLoadOptions;
    clientWorkspace?: IClientWorkspaceIdentifiers;
    extraPlugins?: IEmbeddedPlugin | IEmbeddedPlugin[];
    loadingMode?: "adaptive" | "staticOnly";
}

// @alpha (undocumented)
export interface IDashboardStubProps extends IDashboardLoadOptions {
    ErrorComponent?: React_2.ComponentType<IErrorProps>;
    LoadingComponent?: React_2.ComponentType<ILoadingProps>;
}

// @alpha
export interface IEmbeddedPlugin {
    factory: () => IDashboardPluginContract_V1;
    parameters?: string;
}

// @alpha
export type ModuleFederationIntegration = {
    __webpack_init_sharing__: (scope: string) => Promise<void>;
    __webpack_share_scopes__: any;
};

// @alpha
export function useDashboardLoader(options: IDashboardLoadOptions): DashboardLoadStatus;

// (No @packageDocumentation comment for this package)

```
