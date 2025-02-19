// (C) 2021 GoodData Corporation
import React from "react";
import { IItemsFilteredMessageProps } from "./AllItemsFilteredMessage";
import { ArrowOffsets, Bubble, BubbleHoverTrigger, IAlignPoint } from "@gooddata/sdk-ui-kit";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl";

const bubbleAlignPoints: IAlignPoint[] = [{ align: "bc tl" }, { align: "tc bl" }];
const bubbleArrowOffsets: ArrowOffsets = { "bc tl": [-100, 10], "tc bl": [-100, -10] };

export const ItemsFilteredMessage: React.FC<IItemsFilteredMessageProps> = ({ parentFilterTitles }) => {
    return (
        <div className="gd-attribute-filter-dropdown-items-filtered s-attribute-filter-dropdown-items-filtered">
            <BubbleHoverTrigger showDelay={0} hideDelay={0}>
                <div className="gd-filtered-message">
                    <FormattedMessage id="attributesDropdown.itemsFiltered" />
                    <span className="gd-icon-circle-question" />
                </div>
                <Bubble
                    className="bubble-primary gd-attribute-filter-dropdown-bubble s-attribute-filter-dropdown-bubble"
                    alignPoints={bubbleAlignPoints}
                    arrowOffsets={bubbleArrowOffsets}
                >
                    <FormattedHTMLMessage
                        id="attributesDropdown.itemsFiltered.tooltip"
                        values={{ filters: parentFilterTitles.join(", ") }}
                    />
                </Bubble>
            </BubbleHoverTrigger>
        </div>
    );
};
