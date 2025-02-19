// (C) 2021 GoodData Corporation

import { IWidgetAlert, IWidgetAlertDefinition } from "@gooddata/sdk-backend-spi";
import { ObjRef } from "@gooddata/sdk-model";
import { IDashboardCommand } from "./base";

/**
 * Creates Kpi alert.
 *
 * @alpha
 */
export interface CreateAlert extends IDashboardCommand {
    readonly type: "GDC.DASH/CMD.ALERT.CREATE";
    readonly payload: {
        readonly alert: IWidgetAlertDefinition;
    };
}

/**
 * Creates the SaveAlert command. Dispatching this command will result in the creating Kpi alert on the backend.
 *
 * @param alert - specify alert to create.
 * @param correlationId - optionally specify correlation id to use for this command. this will be included in all
 *  events that will be emitted during the command processing
 * @alpha
 */
export function createAlert(alert: IWidgetAlertDefinition, correlationId?: string): CreateAlert {
    return {
        type: "GDC.DASH/CMD.ALERT.CREATE",
        correlationId,
        payload: {
            alert,
        },
    };
}

/**
 *Updates Kpi alert.
 *
 * @alpha
 */
export interface UpdateAlert extends IDashboardCommand {
    readonly type: "GDC.DASH/CMD.ALERT.UPDATE";
    readonly payload: {
        readonly alert: IWidgetAlert;
    };
}

/**
 * Creates the UpdateAlert command. Dispatching this command will result in the updating Kpi alert on the backend.
 *
 * @param alert - specify alert to update.
 * @param correlationId - optionally specify correlation id to use for this command. this will be included in all
 *  events that will be emitted during the command processing

 * @alpha
 */
export function updateAlert(alert: IWidgetAlert, correlationId?: string): UpdateAlert {
    return {
        type: "GDC.DASH/CMD.ALERT.UPDATE",
        correlationId,
        payload: {
            alert,
        },
    };
}

/**
 * Removes Kpi alert.
 *
 * @alpha
 */
export interface RemoveAlerts extends IDashboardCommand {
    readonly type: "GDC.DASH/CMD.ALERTS.REMOVE";
    readonly payload: {
        /**
         * References to Kpi alerts whose should be removed.
         */
        readonly refs: ObjRef[];
    };
}

/**
 * Creates the RemoveAlerts command. Dispatching this command will result in the removing Kpi alerts on the backend.
 *
 * @param refs - specify ObjRef of the alerts to remove
 * @param correlationId - optionally specify correlation id to use for this command. this will be included in all
 *  events that will be emitted during the command processing

 * @alpha
 */
export function removeAlerts(refs: ObjRef[], correlationId?: string): RemoveAlerts {
    return {
        type: "GDC.DASH/CMD.ALERTS.REMOVE",
        correlationId,
        payload: {
            refs,
        },
    };
}
