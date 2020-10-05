// (C) 2020 GoodData Corporation
import React, { useState } from "react";
import { Button } from "@gooddata/sdk-ui-kit";
import { ObjRefInScope, areObjRefsEqual } from "@gooddata/sdk-model";
import cx from "classnames";
import { IMeasureDropdownItem } from "../types";
import { MeasureDropdownBody } from "./MeasureDropdownBody";

interface IMeasureDropdownProps {
    items: IMeasureDropdownItem[];
    selectedItemRef: ObjRefInScope;
    onSelect: (ref: ObjRefInScope) => void;
    onDropDownItemMouseOver?: (ref: ObjRefInScope) => void;
    onDropDownItemMouseOut?: () => void;
}

export const MeasureDropdown: React.FC<IMeasureDropdownProps> = ({
    items,
    selectedItemRef,
    onSelect,
    onDropDownItemMouseOver,
    onDropDownItemMouseOut,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const onButtonClick = () => {
        setIsOpen(!isOpen);
    };

    const onItemSelect = (ref: ObjRefInScope) => {
        onSelect(ref);
        setIsOpen(false);
        onDropDownItemMouseOut && onDropDownItemMouseOut();
    };

    const buttonClassNames = cx(
        "gd-button-secondary",
        "gd-button-small",
        "button-dropdown",
        "icon-right",
        {
            "icon-navigateup": isOpen,
            "icon-navigatedown": !isOpen,
        },
        "gd-rf-measure-dropdown-button",
        "s-rf-measure-dropdown-button",
    );

    const selectedItem = items.find((item) => areObjRefsEqual(item.ref, selectedItemRef));
    const title = selectedItem?.title;

    return (
        <>
            <Button
                className={buttonClassNames}
                value={title}
                onClick={onButtonClick}
                iconLeft="icon-measure"
            />
            {isOpen && (
                <MeasureDropdownBody
                    items={items}
                    selectedItemRef={selectedItemRef}
                    onSelect={onItemSelect}
                    onClose={() => setIsOpen(false)}
                    onDropDownItemMouseOver={onDropDownItemMouseOver}
                    onDropDownItemMouseOut={onDropDownItemMouseOut}
                />
            )}
        </>
    );
};
