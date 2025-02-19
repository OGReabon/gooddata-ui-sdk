// (C) 2021 GoodData Corporation

import {
    IAttributeDisplayFormMetadataObject,
    IDashboardObjectIdentity,
    IFilterContextDefinition,
} from "@gooddata/sdk-backend-spi";

/**
 * @alpha
 */
export interface FilterContextState {
    /**
     * Filter context definition contains the actual filters to use. Filter context definition is present
     */
    filterContextDefinition?: IFilterContextDefinition;

    /**
     * Filter context identity is available for persisted filter contexts. This property may be undefined in
     * two circumstances:
     *
     * -  a new, yet unsaved dashboard; the filter context is saved together with the dashboard and after the
     *    save the identity will be known and added
     * -  export of an existing, saved dashboard; during the export the dashboard receives a temporary
     *    filter context that represents values of filters at the time the export was initiated - which may
     *    be different from what is saved in the filter context itself. that temporary context is not
     *    persistent and lives only for that particular export operation.
     */
    filterContextIdentity?: IDashboardObjectIdentity;

    /**
     * Display form metadata objects for all attribute filters in the `filterContextDefinition`
     */
    attributeFilterDisplayForms?: IAttributeDisplayFormMetadataObject[];
}

export const filterContextInitialState: FilterContextState = {
    filterContextDefinition: undefined,
    filterContextIdentity: undefined,
    attributeFilterDisplayForms: undefined,
};
