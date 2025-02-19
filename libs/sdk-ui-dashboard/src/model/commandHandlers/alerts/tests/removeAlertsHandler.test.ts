// (C) 2021 GoodData Corporation

import { DashboardTester, preloadedTesterFactory } from "../../../tests/DashboardTester";
import { idRef, uriRef } from "@gooddata/sdk-model";
import { RemoveAlerts, removeAlerts } from "../../../commands/alerts";
import {
    BrokenFilterAlertsDashboardIdentifier,
    AlertForRemovedFiltersKpi,
    TestCorrelation,
} from "../../../tests/fixtures/BrokenFilterAlerts.fixtures";
import { DashboardAlertsRemoved } from "../../../events/alerts";
import { selectAlertByRef } from "../../../store/alerts/alertsSelectors";
import { DashboardCommandFailed } from "../../../events";

describe("removeDrillsForInsightWidgetHandler", () => {
    const alertRef = AlertForRemovedFiltersKpi.ref!;
    const alertsRefsArray = [alertRef];

    let Tester: DashboardTester;
    beforeEach(
        preloadedTesterFactory(async (tester) => {
            Tester = tester;
        }, BrokenFilterAlertsDashboardIdentifier),
    );

    describe("remove", () => {
        it("should emit the appropriate events for remove alerts and propagate correlationId", async () => {
            await Tester.dispatchAndWaitFor(
                removeAlerts(alertsRefsArray, TestCorrelation),
                "GDC.DASH/EVT.ALERTS.REMOVED",
            );
            expect(Tester.emittedEventsDigest()).toMatchSnapshot();
        });

        it("should remove alerts from the state and propagate it via event payload", async () => {
            const alertSelector = selectAlertByRef(alertRef);

            const alertFromStateBefore = alertSelector(Tester.state());
            expect(alertFromStateBefore).toBeTruthy();

            const event: DashboardAlertsRemoved = await Tester.dispatchAndWaitFor(
                removeAlerts(alertsRefsArray, TestCorrelation),
                "GDC.DASH/EVT.ALERTS.REMOVED",
            );

            expect(event.payload.alerts).toEqual([AlertForRemovedFiltersKpi]);

            const alertFromState = alertSelector(Tester.state());
            expect(alertFromState).toBeFalsy();
        });

        it("should remove alerts referenced by Identifer from the state and propagate it via event payload", async () => {
            const alertIdentifier = idRef(AlertForRemovedFiltersKpi.identifier!);

            const alertSelector = selectAlertByRef(alertRef);

            const alertFromStateBefore = alertSelector(Tester.state());
            expect(alertFromStateBefore).toBeTruthy();

            const event: DashboardAlertsRemoved = await Tester.dispatchAndWaitFor(
                removeAlerts([alertIdentifier], TestCorrelation),
                "GDC.DASH/EVT.ALERTS.REMOVED",
            );

            expect(event.payload.alerts).toEqual([AlertForRemovedFiltersKpi]);

            const alertFromState = alertSelector(Tester.state());
            expect(alertFromState).toBeFalsy();
        });
    });

    describe("validate", () => {
        it("should fail if trying to remove non-existent alert", async () => {
            const event: DashboardCommandFailed<RemoveAlerts> = await Tester.dispatchAndWaitFor(
                removeAlerts([uriRef("missing")], TestCorrelation),
                "GDC.DASH/EVT.COMMAND.FAILED",
            );

            expect(event.payload.reason).toEqual("USER_ERROR");
            expect(event.correlationId).toEqual(TestCorrelation);
        });
    });
});
