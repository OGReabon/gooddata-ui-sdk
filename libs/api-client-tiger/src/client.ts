// (C) 2019-2021 GoodData Corporation
import { tigerExecutionClientFactory } from "./execution";
import { tigerExecutionResultClientFactory } from "./executionResult";
import {
    LabelElementsConfiguration,
    LabelElementsConfigurationParameters,
    LabelElementsBaseApi,
    LabelElementsRequestArgs,
    tigerLabelElementsClientFactory,
} from "./labelElements";
import {
    MetadataConfiguration,
    MetadataConfigurationParameters,
    MetadataBaseApi,
    MetadataRequestArgs,
    tigerWorkspaceObjectsClientFactory,
} from "./workspaceObjects";
import { tigerValidObjectsClientFactory } from "./validObjects";
import { tigerOrganizationObjectsClientFactory } from "./organizationObjects";
import { setAxiosAuthorizationToken } from "./axios";
import { AxiosInstance } from "axios";
import { tigerLayoutClientFactory } from "./layout";
import { tigerAfmExplainClientFactory } from "./explain";

export {
    tigerWorkspaceObjectsClientFactory,
    tigerExecutionClientFactory,
    tigerExecutionResultClientFactory,
    tigerLabelElementsClientFactory,
    tigerValidObjectsClientFactory,
    tigerOrganizationObjectsClientFactory,
    tigerLayoutClientFactory,
    tigerAfmExplainClientFactory,
    MetadataConfiguration,
    MetadataConfigurationParameters,
    MetadataBaseApi,
    MetadataRequestArgs,
    LabelElementsConfiguration,
    LabelElementsConfigurationParameters,
    LabelElementsBaseApi,
    LabelElementsRequestArgs,
};

export interface ITigerClient {
    axios: AxiosInstance;
    workspaceObjects: ReturnType<typeof tigerWorkspaceObjectsClientFactory>;
    execution: ReturnType<typeof tigerExecutionClientFactory>;
    executionResult: ReturnType<typeof tigerExecutionResultClientFactory>;
    labelElements: ReturnType<typeof tigerLabelElementsClientFactory>;
    validObjects: ReturnType<typeof tigerValidObjectsClientFactory>;
    organizationObjects: ReturnType<typeof tigerOrganizationObjectsClientFactory>;
    explain: ReturnType<typeof tigerAfmExplainClientFactory>;
    declarativeLayout: ReturnType<typeof tigerLayoutClientFactory>;

    /**
     * Updates tiger client to send the provided API TOKEN in `Authorization` header of all
     * requests.
     *
     * @remarks This is a convenience method that ultimately calls {@link setAxiosAuthorizationToken}.
     * @param token - token to set, if undefined, it will reset
     */
    setApiToken: (token: string | undefined) => void;
}

/**
 * Tiger execution client
 *
 */
export const tigerClientFactory = (axios: AxiosInstance): ITigerClient => {
    const execution = tigerExecutionClientFactory(axios);
    const executionResult = tigerExecutionResultClientFactory(axios);
    const labelElements = tigerLabelElementsClientFactory(axios);
    const workspaceObjects = tigerWorkspaceObjectsClientFactory(axios);
    const validObjects = tigerValidObjectsClientFactory(axios);
    const organizationObjects = tigerOrganizationObjectsClientFactory(axios);
    const declarativeLayout = tigerLayoutClientFactory(axios);
    const explain = tigerAfmExplainClientFactory(axios);

    return {
        axios,
        execution,
        executionResult,
        labelElements,
        workspaceObjects,
        validObjects,
        organizationObjects,
        declarativeLayout,
        explain,
        setApiToken: (token: string | undefined): void => {
            setAxiosAuthorizationToken(axios, token);
        },
    };
};
