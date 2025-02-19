// (C) 2007-2020 GoodData Corporation
import React from "react";
import cx from "classnames";
import uniqueId from "lodash/uniqueId";
import pickBy from "lodash/pickBy";

/**
 * @internal
 */
export interface IBubbleTriggerProps {
    className?: string;
    children?: React.ReactNode;
    eventsOnBubble?: boolean;
    tagName?: React.ElementType;
}

/**
 * @internal
 */
export interface IBubbleTriggerState {
    bubbleId: string;
    isBubbleVisible: boolean;
}

/**
 * @internal
 */
export class BubbleTrigger<P extends IBubbleTriggerProps> extends React.PureComponent<
    P,
    IBubbleTriggerState
> {
    public static defaultProps: IBubbleTriggerProps = {
        className: "",
        children: false,
        eventsOnBubble: false,
        tagName: "span",
    };

    public readonly state: Readonly<IBubbleTriggerState> = {
        bubbleId: uniqueId("bubble-"),
        isBubbleVisible: false,
    };

    private onClose = (): void => {
        this.changeBubbleVisibility(false);
    };

    protected eventListeners(): any {
        return {};
    }

    protected changeBubbleVisibility(active: boolean): void {
        this.setState({ isBubbleVisible: active });
    }

    public render(): React.ReactNode {
        const { children, eventsOnBubble, className, tagName, ...others } = this.props;
        const dataAttributes = pickBy(others, (_, key) => key.startsWith("data-"));

        const classNames = cx("gd-bubble-trigger", className, {
            [this.state.bubbleId]: true,
        });

        const TagName = tagName;
        let BubbleElement;
        let WrappedTrigger;

        React.Children.map(children, (child: any) => {
            if (child) {
                if (child.type && child.type.identifier === "Bubble") {
                    BubbleElement = child;
                } else {
                    WrappedTrigger = child;
                }
            }
        });

        const bubbleProps = {
            ...(eventsOnBubble ? this.eventListeners() : {}),
            alignTo: `.${this.state.bubbleId}`,
            onClose: this.onClose,
        };

        const BubbleOverlay =
            this.state.isBubbleVisible && BubbleElement ? React.cloneElement(BubbleElement, bubbleProps) : "";

        return (
            <React.Fragment>
                <TagName {...dataAttributes} {...this.eventListeners()} className={classNames}>
                    {WrappedTrigger}
                </TagName>
                {BubbleOverlay}
            </React.Fragment>
        );
    }
}
