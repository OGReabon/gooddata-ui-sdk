// (C) 2021 GoodData Corporation
import { AnyAction, Dispatch, EntityState } from "@reduxjs/toolkit";
import { IInsight } from "@gooddata/sdk-model";
import { LoadingState } from "./loading/loadingState";
import { SavingState } from "./saving/savingState";
import { FilterContextState } from "./filterContext/filterContextState";
import { LayoutState } from "./layout/layoutState";
import { ConfigState } from "./config/configState";
import { DateFilterConfigState } from "./dateFilterConfig/dateFilterConfigState";
import { PermissionsState } from "./permissions/permissionsState";
import { IListedDashboard, IWidgetAlert } from "@gooddata/sdk-backend-spi";
import { CatalogState } from "./catalog/catalogState";
import { UserState } from "./user/userState";
import { DrillState } from "./drill/drillState";
import { DashboardMetaState } from "./meta/metaState";
import { BackendCapabilitiesState } from "./backendCapabilities/backendCapabilitiesState";
import { IDrillTargets } from "./drillTargets/drillTargetsTypes";
import { IExecutionResultEnvelope } from "./executionResults/types";
import { UiState } from "./ui/uiState";

/*
 * This explicit typing is unfortunate but cannot find better way. Normally the typings get inferred from store,
 * however since this code creates store dynamically such thing is not possible.
 *
 * Beware.. even if we get the inference working through the use of some throw-away internal, the
 * api-extractor will have problems if just the inferred types gets exported unless the value
 * from which it is inferred is exported as well.
 */

/**
 * @alpha
 */
export type DashboardState = {
    loading: LoadingState;
    saving: SavingState;
    backendCapabilities: BackendCapabilitiesState;
    config: ConfigState;
    permissions: PermissionsState;
    filterContext: FilterContextState;
    layout: LayoutState;
    dateFilterConfig: DateFilterConfigState;
    catalog: CatalogState;
    user: UserState;
    meta: DashboardMetaState;
    drill: DrillState;
    // Entities
    insights: EntityState<IInsight>;
    alerts: EntityState<IWidgetAlert>;
    drillTargets: EntityState<IDrillTargets>;
    listedDashboards: EntityState<IListedDashboard>;

    /**
     * Ui state controllable from the outside.
     */
    ui: UiState;

    /**
     * Part of state where execution results of the individual widgets are stored.
     */
    executionResults: EntityState<IExecutionResultEnvelope>;

    /**
     * Part of state where the different dashboard component queries may cache their results.
     *
     * @internal
     */
    _queryCache: {
        [queryName: string]: any;
    };
};

/**
 * @alpha
 */
export type DashboardDispatch = Dispatch<AnyAction>;

/**
 * Function that selects part of the Dashboard state.
 *
 * @alpha
 */
export type DashboardSelector<TResult> = (state: DashboardState) => TResult;
/**
 * Type of a callback that evaluates a selector function against the Dashboard state
 *
 * @alpha
 */
export type DashboardSelectorEvaluator = <TResult>(selector: DashboardSelector<TResult>) => TResult;
