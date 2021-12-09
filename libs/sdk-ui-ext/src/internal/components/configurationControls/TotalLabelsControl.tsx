import React from "react";
import { WrappedComponentProps, injectIntl } from "react-intl";
import DropdownControl from "./DropdownControl";

import { totalLabelsDropdownItems } from "../../constants/dropdowns";
import { getTranslatedDropdownItems } from "../../utils/translations";
import { IVisualizationProperties } from "../../interfaces/Visualization";

export interface ITotalLabelsControlProps {
    pushData: (data: any) => any;
    properties: IVisualizationProperties;
    isDisabled: boolean;
    showDisabledMessage?: boolean;
    defaultValue?: string | boolean;
}

class TotalLabelsControl extends React.Component<ITotalLabelsControlProps & WrappedComponentProps> {
    public static defaultProps = {
        defaultValue: "auto",
        showDisabledMessage: false,
    };
    public render() {
        const { pushData, properties, intl, isDisabled, showDisabledMessage, defaultValue } = this.props;
        const totalLabels = properties?.controls?.totalLabels?.visible ?? defaultValue;

        return (
            <div className="s-total-labels-config">
                <DropdownControl
                    value={totalLabels}
                    valuePath="totalLabels.visible"
                    labelText="properties.canvas.totalLabels"
                    disabled={isDisabled}
                    properties={properties}
                    pushData={pushData}
                    items={getTranslatedDropdownItems(totalLabelsDropdownItems, intl)}
                    showDisabledMessage={showDisabledMessage}
                />
            </div>
        );
    }
}

export default injectIntl(TotalLabelsControl);
