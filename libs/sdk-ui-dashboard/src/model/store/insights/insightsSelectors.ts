// (C) 2021 GoodData Corporation
import { insightsAdapter } from "./insightsEntityAdapter";
import { DashboardState } from "../types";
import { createSelector } from "@reduxjs/toolkit";
import { insightRef, ObjRef, serializeObjRef } from "@gooddata/sdk-model";
import memoize from "lodash/memoize";
import { newInsightMap } from "../../../_staging/metadata/objRefMap";
import { selectBackendCapabilities } from "../backendCapabilities/backendCapabilitiesSelectors";

const entitySelectors = insightsAdapter.getSelectors((state: DashboardState) => state.insights);

/**
 * Selects all insights used on the dashboard.
 *
 * Note: if you are aiming to lookup insights using an ObjRef, then you should instead use the map returned
 * by {@link selectInsightsMap}. If you are aiming to lookup a single insight by its ref, use {@link selectInsightByRef}.
 * Using these selectors is both faster and safer as they take ObjRef type into account and look up the insight
 * depending on the type of the ref.
 *
 * @remarks see {@link selectInsightsMap} or {@link selectInsightByRef} for a faster and safer ways to get
 * an insight by its ObjRef.
 * @alpha
 */
export const selectInsights = entitySelectors.selectAll;

/**
 * Selects refs of all insights used on the dashboard.
 *
 * @alpha
 */
export const selectInsightRefs = createSelector(selectInsights, (insights) => {
    return insights.map(insightRef);
});

/**
 * Selects all insights and returns them in a mapping of obj ref to the insight object.
 *
 * @alpha
 */
export const selectInsightsMap = createSelector(
    selectInsights,
    selectBackendCapabilities,
    (insights, capabilities) => {
        return newInsightMap(insights, capabilities.hasTypeScopedIdentifiers);
    },
);

/**
 * Selects insight used on a dashboard by its ref.
 *
 * @alpha
 */
export const selectInsightByRef = memoize((ref: ObjRef) => {
    return createSelector(selectInsightsMap, (insights) => {
        return insights.get(ref);
    });
}, serializeObjRef);
