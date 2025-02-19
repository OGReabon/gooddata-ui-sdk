// (C) 2021 GoodData Corporation
import { ActionOptions } from "../_base/types";
import { logError, logInfo, logSuccess, logWarn } from "../_base/terminal/loggers";
import fse from "fs-extra";
import { getLinkCmdActionConfig, LinkCmdActionConfig } from "./actionConfig";
import { IDashboard, IDashboardDefinition } from "@gooddata/sdk-backend-spi";
import { idRef } from "@gooddata/sdk-model";
import ora from "ora";
import { genericErrorReporter } from "../_base/utils";

function printUseConfigSummary(config: LinkCmdActionConfig) {
    const {
        backend,
        hostname,
        workspace,
        dashboard,
        identifier,
        parameters,
        withParameters,
        credentials: { username },
    } = config;

    logInfo("Everything looks valid. Going to link plugin on the dashboard.");
    logInfo(`  Hostname    : ${hostname}   (${backend === "bear" ? "GoodData platform" : "GoodData.CN"})`);

    if (backend === "bear") {
        logInfo(`  Username    : ${username}`);
    }

    logInfo(`  Workspace   : ${workspace}`);
    logInfo(`  Dashboard   : ${dashboard}`);
    logInfo(`  Plugin obj  : ${identifier}`);

    if (withParameters) {
        logInfo(`  Parameters  : ${parameters}`);
    }
}

async function updateDashboardWithPluginLink(config: LinkCmdActionConfig) {
    const { backendInstance, workspace, dashboard, identifier: validIdentifier, parameters } = config;
    const dashboardRef = idRef(dashboard);

    const dashboardObj: IDashboard = await backendInstance
        .workspace(workspace)
        .dashboards()
        .getDashboard(dashboardRef);
    const plugins = dashboardObj.plugins ? [...dashboardObj.plugins] : [];

    plugins.push({
        type: "IDashboardPluginLink",
        plugin: idRef(validIdentifier),
        parameters,
    });

    // note: need the cast here as IDashboard filterContext may contain ITempFilter context in some cases...
    // but that's not going to happen here (because code never asked for export-specific temp filters)
    const updatedDashboard: IDashboardDefinition = {
        ...(dashboardObj as IDashboardDefinition),
        plugins,
    };

    await backendInstance.workspace(workspace).dashboards().updateDashboard(dashboardObj, updatedDashboard);
}

export async function linkPluginCmdAction(identifier: string, options: ActionOptions): Promise<void> {
    if (!fse.existsSync("package.json")) {
        logError(
            "Cannot find package.json. Please make sure to run the tool in directory that contains your dashboard plugin project.",
        );

        process.exit(1);
        return;
    }

    try {
        const config: LinkCmdActionConfig = await getLinkCmdActionConfig(identifier, options);

        printUseConfigSummary(config);

        if (config.dryRun) {
            logWarn(
                "Dry run has finished. Dashboard was not updated. Remove '--dry-run' to perform the actual update.",
            );

            process.exit(0);
            return;
        }

        const updateProgress = ora({
            text: "Linking dashboard with a plugin.",
        });

        let success = false;
        try {
            updateProgress.start();
            await updateDashboardWithPluginLink(config);
            success = true;
        } finally {
            updateProgress.stop();
        }

        if (success) {
            logSuccess(`Linked dashboard ${config.dashboard} with plugin ${config.identifier}.`);
        }
    } catch (e) {
        genericErrorReporter(e);

        process.exit(1);
    }
}
