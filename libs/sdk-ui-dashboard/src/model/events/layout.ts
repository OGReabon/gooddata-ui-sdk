// (C) 2021 GoodData Corporation
import { IDashboardLayout, IDashboardLayoutSectionHeader } from "@gooddata/sdk-backend-spi";

import {
    ExtendedDashboardItem,
    ExtendedDashboardLayoutSection,
    ExtendedDashboardWidget,
    StashedDashboardItemsId,
} from "../types/layoutTypes";
import { DashboardContext } from "../types/commonTypes";
import { IDashboardEvent } from "./base";
import { eventGuard } from "./util";

/**
 * This event is emitted when a new dashboard layout section is added.
 *
 * @alpha
 */
export interface DashboardLayoutSectionAdded extends IDashboardEvent {
    readonly type: "GDC.DASH/EVT.FLUID_LAYOUT.SECTION_ADDED";
    readonly payload: {
        /**
         * The new section.
         */
        readonly section: ExtendedDashboardLayoutSection;

        /**
         * Index of the new section among other sections in the layout.
         *
         * Index is zero-based.
         */
        readonly index: number;
    };
}

export function layoutSectionAdded(
    ctx: DashboardContext,
    section: ExtendedDashboardLayoutSection,
    index: number,
    correlationId?: string,
): DashboardLayoutSectionAdded {
    return {
        type: "GDC.DASH/EVT.FLUID_LAYOUT.SECTION_ADDED",
        ctx,
        correlationId,
        payload: {
            section,
            index,
        },
    };
}

/**
 * Tests whether the provided object is an instance of {@link DashboardLayoutSectionAdded}.
 *
 * @param obj - object to test
 * @alpha
 */
export const isDashboardLayoutSectionAdded = eventGuard<DashboardLayoutSectionAdded>(
    "GDC.DASH/EVT.FLUID_LAYOUT.SECTION_ADDED",
);

//
//
//

/**
 * This event is emitted when a dashboard layout section is moved from one place to another.
 *
 * @alpha
 */
export interface DashboardLayoutSectionMoved extends IDashboardEvent {
    readonly type: "GDC.DASH/EVT.FLUID_LAYOUT.SECTION_MOVED";
    readonly payload: {
        readonly section: ExtendedDashboardLayoutSection;
        readonly fromIndex: number;
        readonly toIndex: number;
    };
}

export function layoutSectionMoved(
    ctx: DashboardContext,
    section: ExtendedDashboardLayoutSection,
    fromIndex: number,
    toIndex: number,
    correlationId?: string,
): DashboardLayoutSectionMoved {
    return {
        type: "GDC.DASH/EVT.FLUID_LAYOUT.SECTION_MOVED",
        ctx,
        correlationId,
        payload: {
            section,
            fromIndex,
            toIndex,
        },
    };
}

/**
 * Tests whether the provided object is an instance of {@link DashboardLayoutSectionMoved}.
 *
 * @param obj - object to test
 * @alpha
 */
export const isDashboardLayoutSectionMoved = eventGuard<DashboardLayoutSectionMoved>(
    "GDC.DASH/EVT.FLUID_LAYOUT.SECTION_MOVED",
);

//
//
//

/**
 * This event is emitted when a dashboard layout section is removed from the layout.
 *
 * Note: this event will be emitted also when the section is removed as part of eager removal of
 * its items. E.g. item is removed, it is last item in the section, and the whole section is removed
 * as well.
 *
 * @alpha
 */
export interface DashboardLayoutSectionRemoved extends IDashboardEvent {
    readonly type: "GDC.DASH/EVT.FLUID_LAYOUT.SECTION_REMOVED";
    readonly payload: {
        /**
         * Section that was removed.
         *
         * Note: when the section is eagerly removed, it's items will be empty.
         */
        readonly section: ExtendedDashboardLayoutSection;

        /**
         * Index where the section originally resided.
         */
        readonly index: number;

        /**
         * Indicates that the section was removed as part of eager removal of the section items.
         */
        readonly eagerRemoval?: boolean;

        /**
         * If the remove command indicated to stash the items for later reuse, then the stash identifier
         * provided on the command is mirrored here.
         */
        readonly stashIdentifier?: StashedDashboardItemsId;
    };
}

export function layoutSectionRemoved(
    ctx: DashboardContext,
    section: ExtendedDashboardLayoutSection,
    index: number,
    eagerRemoval?: boolean,
    stashIdentifier?: StashedDashboardItemsId,
    correlationId?: string,
): DashboardLayoutSectionRemoved {
    return {
        type: "GDC.DASH/EVT.FLUID_LAYOUT.SECTION_REMOVED",
        ctx,
        correlationId,
        payload: {
            section,
            index,
            eagerRemoval,
            stashIdentifier,
        },
    };
}

/**
 * Tests whether the provided object is an instance of {@link DashboardLayoutSectionRemoved}.
 *
 * @param obj - object to test
 * @alpha
 */
export const isDashboardLayoutSectionRemoved = eventGuard<DashboardLayoutSectionRemoved>(
    "GDC.DASH/EVT.FLUID_LAYOUT.SECTION_REMOVED",
);

//
//
//

/**
 * This event is emitted when dashboard layout section changes.
 *
 * @alpha
 */
export interface DashboardLayoutSectionHeaderChanged extends IDashboardEvent {
    readonly type: "GDC.DASH/EVT.FLUID_LAYOUT.SECTION_HEADER_CHANGED";
    readonly payload: {
        /**
         * The new header of the section.
         */
        readonly newHeader: IDashboardLayoutSectionHeader;

        /**
         * Index of the section which had the header updated.
         */
        readonly sectionIndex: number;
    };
}

export function layoutSectionHeaderChanged(
    ctx: DashboardContext,
    newHeader: IDashboardLayoutSectionHeader,
    sectionIndex: number,
    correlationId?: string,
): DashboardLayoutSectionHeaderChanged {
    return {
        type: "GDC.DASH/EVT.FLUID_LAYOUT.SECTION_HEADER_CHANGED",
        ctx,
        correlationId,
        payload: {
            newHeader,
            sectionIndex,
        },
    };
}

/**
 * Tests whether the provided object is an instance of {@link DashboardLayoutSectionHeaderChanged}.
 *
 * @param obj - object to test
 * @alpha
 */
export const isDashboardLayoutSectionHeaderChanged = eventGuard<DashboardLayoutSectionHeaderChanged>(
    "GDC.DASH/EVT.FLUID_LAYOUT.SECTION_HEADER_CHANGED",
);

//
//
//

/**
 * This event is emitted when items are added to a dashboard section.
 *
 * @alpha
 */
export interface DashboardLayoutSectionItemsAdded extends IDashboardEvent {
    readonly type: "GDC.DASH/EVT.FLUID_LAYOUT.ITEMS_ADDED";
    readonly payload: {
        /**
         * Index of the section to which the items were added.
         */
        readonly sectionIndex: number;

        /**
         * Index within the section at which the items were inserted.
         */
        readonly startIndex: number;

        /**
         * Items that were inserted.
         */
        readonly itemsAdded: ReadonlyArray<ExtendedDashboardItem>;

        /**
         * If the items from one or more stashes were added and the stashes were cleared, the the list of
         * stash identifiers will be included here.
         */
        readonly stashesUsed?: ReadonlyArray<StashedDashboardItemsId>;
    };
}

export function layoutSectionItemsAdded(
    ctx: DashboardContext,
    sectionIndex: number,
    startIndex: number,
    itemsAdded: ExtendedDashboardItem[],
    stashesUsed?: StashedDashboardItemsId[],
    correlationId?: string,
): DashboardLayoutSectionItemsAdded {
    return {
        type: "GDC.DASH/EVT.FLUID_LAYOUT.ITEMS_ADDED",
        ctx,
        correlationId,
        payload: {
            sectionIndex,
            startIndex,
            itemsAdded,
            stashesUsed,
        },
    };
}

/**
 * Tests whether the provided object is an instance of {@link DashboardLayoutSectionItemsAdded}.
 *
 * @param obj - object to test
 * @alpha
 */
export const isDashboardLayoutSectionItemsAdded = eventGuard<DashboardLayoutSectionItemsAdded>(
    "GDC.DASH/EVT.FLUID_LAYOUT.ITEMS_ADDED",
);

//
//
//

/**
 * This event is emitted when an item in a dashboard section is replaced.
 * @alpha
 */
export interface DashboardLayoutSectionItemReplaced extends IDashboardEvent {
    readonly type: "GDC.DASH/EVT.FLUID_LAYOUT.ITEM_REPLACED";
    readonly payload: {
        /**
         * Index of section where the replacement happened.
         */
        readonly sectionIndex: number;

        /**
         * Index of item within the section that was replaced.
         */
        readonly itemIndex: number;

        /**
         * New item definition.
         */
        readonly items: ReadonlyArray<ExtendedDashboardItem>;

        /**
         * Item that was replaced
         */
        readonly previousItem: ExtendedDashboardItem;

        /**
         * If the replacement specified to stash the old item, then the identifier of the
         * stash is included here.
         */
        readonly stashIdentifier?: StashedDashboardItemsId;
    };
}

export function layoutSectionItemReplaced(
    ctx: DashboardContext,
    sectionIndex: number,
    itemIndex: number,
    items: ExtendedDashboardItem[],
    previousItem: ExtendedDashboardItem,
    stashIdentifier?: StashedDashboardItemsId,
    correlationId?: string,
): DashboardLayoutSectionItemReplaced {
    return {
        type: "GDC.DASH/EVT.FLUID_LAYOUT.ITEM_REPLACED",
        ctx,
        correlationId,
        payload: {
            sectionIndex,
            itemIndex,
            items,
            previousItem,
            stashIdentifier,
        },
    };
}

/**
 * Tests whether the provided object is an instance of {@link DashboardLayoutSectionItemReplaced}.
 *
 * @param obj - object to test
 * @alpha
 */
export const isDashboardLayoutSectionItemReplaced = eventGuard<DashboardLayoutSectionItemReplaced>(
    "GDC.DASH/EVT.FLUID_LAYOUT.ITEM_REPLACED",
);

//
//
//

/**
 * This event is emitted when a dashboard item is moved between sections or within a section.
 *
 * @alpha
 */
export interface DashboardLayoutSectionItemMoved extends IDashboardEvent {
    readonly type: "GDC.DASH/EVT.FLUID_LAYOUT.ITEM_MOVED";
    readonly payload: {
        /**
         * Item that was moved.
         */
        readonly item: ExtendedDashboardItem;

        /**
         * Index of section from which the item was moved.
         */
        readonly fromSectionIndex: number;

        /**
         * Index of section to which the item was moved.
         *
         * This may be the same as `fromSectionIndex` - which means the move happened within the same section.
         */
        readonly toSectionIndex: number;

        /**
         * Index within the `fromSection` from where the item was moved.
         */
        readonly fromIndex: number;

        /**
         * Index in `toSection` at which the item was inserted.
         */
        readonly toIndex: number;
    };
}

export function layoutSectionItemMoved(
    ctx: DashboardContext,
    item: ExtendedDashboardItem,
    fromSectionIndex: number,
    toSectionIndex: number,
    fromIndex: number,
    toIndex: number,
    correlationId?: string,
): DashboardLayoutSectionItemMoved {
    return {
        type: "GDC.DASH/EVT.FLUID_LAYOUT.ITEM_MOVED",
        ctx,
        correlationId,
        payload: {
            item,
            fromSectionIndex,
            toSectionIndex,
            fromIndex,
            toIndex,
        },
    };
}

/**
 * Tests whether the provided object is an instance of {@link DashboardLayoutSectionItemMoved}.
 *
 * @param obj - object to test
 * @alpha
 */
export const isDashboardLayoutSectionItemMoved = eventGuard<DashboardLayoutSectionItemMoved>(
    "GDC.DASH/EVT.FLUID_LAYOUT.ITEM_MOVED",
);

//
//
//

/**
 * This event is emitted when an item is removed from dashboard layout section.
 *
 * @alpha
 */
export interface DashboardLayoutSectionItemRemoved extends IDashboardEvent {
    readonly type: "GDC.DASH/EVT.FLUID_LAYOUT.ITEM_REMOVED";
    readonly payload: {
        /**
         * Item that was removed.
         */
        readonly item: ExtendedDashboardItem;

        /**
         * Index where the item resided.
         */
        readonly itemIndex: number;

        /**
         * If the removal was eager and removed the entire section, then that section is included here.
         *
         * NOTE: the {@link DashboardLayoutSectionRemoved} will be fired at the occasion as well.
         */
        readonly section?: ExtendedDashboardLayoutSection;

        /**
         * If the removal indicated to stash the item, then the stash identifier is mirrored here.
         */
        readonly stashIdentifier?: StashedDashboardItemsId;
    };
}

export function layoutSectionItemRemoved(
    ctx: DashboardContext,
    item: ExtendedDashboardItem,
    itemIndex: number,
    section?: ExtendedDashboardLayoutSection,
    stashIdentifier?: StashedDashboardItemsId,
    correlationId?: string,
): DashboardLayoutSectionItemRemoved {
    return {
        type: "GDC.DASH/EVT.FLUID_LAYOUT.ITEM_REMOVED",
        ctx,
        correlationId,
        payload: {
            item,
            itemIndex,
            section,
            stashIdentifier,
        },
    };
}

/**
 * Tests whether the provided object is an instance of {@link DashboardLayoutSectionItemRemoved}.
 *
 * @param obj - object to test
 * @alpha
 */
export const isDashboardLayoutSectionItemRemoved = eventGuard<DashboardLayoutSectionItemRemoved>(
    "GDC.DASH/EVT.FLUID_LAYOUT.ITEM_REMOVED",
);

//
//
//

/**
 * This event is emitted after any change to the dashboard layout and will include the entire new layout.
 *
 * @alpha
 */
export interface DashboardLayoutChanged extends IDashboardEvent {
    readonly type: "GDC.DASH/EVT.FLUID_LAYOUT.LAYOUT_CHANGED";
    readonly payload: {
        /**
         * Layout after the change.
         */
        readonly layout: IDashboardLayout<ExtendedDashboardWidget>;
    };
}

export function layoutChanged(
    ctx: DashboardContext,
    layout: IDashboardLayout<ExtendedDashboardWidget>,
    correlationId?: string,
): DashboardLayoutChanged {
    return {
        type: "GDC.DASH/EVT.FLUID_LAYOUT.LAYOUT_CHANGED",
        ctx,
        correlationId,
        payload: {
            layout,
        },
    };
}

/**
 * Tests whether the provided object is an instance of {@link DashboardLayoutChanged}.
 *
 * @param obj - object to test
 * @alpha
 */
export const isDashboardLayoutChanged = eventGuard<DashboardLayoutChanged>(
    "GDC.DASH/EVT.FLUID_LAYOUT.LAYOUT_CHANGED",
);
