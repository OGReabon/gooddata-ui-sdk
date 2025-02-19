// (C) 2020-2021 GoodData Corporation
import { useEffect } from "react";
import { GoodDataSdkError } from "@gooddata/sdk-ui";
import { IKpiWidget, IWidgetAlert } from "@gooddata/sdk-backend-spi";

import {
    queryWidgetBrokenAlerts,
    IBrokenAlertFilterBasicInfo,
    QueryProcessingStatus,
    useDashboardQueryProcessing,
    useDashboardSelector,
    selectFilterContextFilters,
} from "../../../model";

export const useWidgetBrokenAlertsQuery = (
    widget: IKpiWidget,
    alert: IWidgetAlert | undefined,
): {
    result?: IBrokenAlertFilterBasicInfo[];
    status?: QueryProcessingStatus;
    error?: GoodDataSdkError;
} => {
    const dashboardFilters = useDashboardSelector(selectFilterContextFilters);

    const {
        run: runBrokenAlertsQuery,
        result,
        status,
        error,
    } = useDashboardQueryProcessing({
        queryCreator: queryWidgetBrokenAlerts,
    });

    const effectiveFilters = result as IBrokenAlertFilterBasicInfo[];

    useEffect(() => {
        if (widget.ref) {
            runBrokenAlertsQuery(widget.ref);
        }

        // queryWidgetBrokenAlerts as a parameter it needs just widget.ref but internally result depends on alert, widget, dashboardFilters
        // we have to call query every time when this dependency changed to get fresh results
    }, [alert, widget, dashboardFilters]);

    return {
        result: effectiveFilters,
        status,
        error,
    };
};
