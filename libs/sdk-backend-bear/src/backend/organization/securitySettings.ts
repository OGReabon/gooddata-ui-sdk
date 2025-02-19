// (C) 2021 GoodData Corporation
import { validatePluginUrlIsSane } from "@gooddata/sdk-backend-base";
import { ISecuritySettingsService, ValidationContext } from "@gooddata/sdk-backend-spi";
import { BearAuthenticatedCallGuard } from "../../types/auth";

export interface IValidationResponse {
    validationResponse: {
        valid: boolean;
    };
}

export class SecuritySettingsService implements ISecuritySettingsService {
    /**
     * Constructs a new SecuritySettingsService
     * @param authCall - call guard to perform API calls through
     * @param scope - URI of the scope. For now only the organization (domain) URI is supported by the backend.
     *  The plan is to support also workspace URI and user profile URI.
     */
    constructor(private readonly authCall: BearAuthenticatedCallGuard, public readonly scope: string) {}

    public isUrlValid = (url: string, context: ValidationContext): Promise<boolean> => {
        return this.authCall(async (sdk) =>
            sdk.xhr
                .postParsed<IValidationResponse>("/gdc/securitySettings/validate", {
                    body: {
                        validationRequest: {
                            type: context,
                            value: url,
                            scope: this.scope,
                        },
                    },
                })
                .then(({ validationResponse }) => {
                    return validationResponse.valid;
                }),
        );
    };

    public isDashboardPluginUrlValid = async (url: string, workspace: string): Promise<boolean> => {
        const sanitizationError = validatePluginUrlIsSane(url);

        if (sanitizationError) {
            // eslint-disable-next-line no-console
            console.warn("Dashboard plugin URL is not valid: ", sanitizationError);

            return false;
        }

        const setting = await this.authCall(async (sdk) => {
            return sdk.project.getConfigItem(workspace, "dashboardPluginHosts");
        });

        const hostList = setting?.settingItem?.value ?? "";
        const allowedHosts = hostList.split(";").map((entry) => entry.trim());

        return allowedHosts.some((host) => url.startsWith(host));
    };
}
