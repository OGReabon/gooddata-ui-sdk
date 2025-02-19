// (C) 2021 GoodData Corporation
import {
    ICatalogDateDataset,
    IDashboardAttributeFilter,
    IDashboardFilterReference,
    isDashboardAttributeFilterReference,
    IAnalyticalWidget,
} from "@gooddata/sdk-backend-spi";
import { areObjRefsEqual, ObjRef } from "@gooddata/sdk-model";
import { DashboardContext } from "../../../types/commonTypes";
import { IDashboardCommand } from "../../../commands";
import {
    FilterOpEnableDateFilter,
    FilterOpIgnoreAttributeFilter,
    FilterOpReplaceAll,
    FilterOpReplaceAttributeIgnores,
    FilterOpUnignoreAttributeFilter,
    WidgetFilterOperation,
} from "../../../types/widgetTypes";
import { SagaIterator } from "redux-saga";
import { call, SagaReturnType, select } from "redux-saga/effects";
import { selectFilterContextAttributeFilters } from "../../../store/filterContext/filterContextSelectors";

function toAttributeDisplayFormRefs(references: IDashboardFilterReference[]) {
    return references.filter(isDashboardAttributeFilterReference).map((reference) => reference.displayForm);
}

function getIgnoredAttributeFilters(
    filters: IDashboardAttributeFilter[],
    ignored: IDashboardFilterReference[],
): IDashboardAttributeFilter[] {
    const ignoredRefs = toAttributeDisplayFormRefs(ignored);

    return filters.filter((filter) => {
        return ignoredRefs.some((ref) => areObjRefsEqual(filter.attributeFilter.displayForm, ref));
    });
}

function* replaceFilterSettings(
    ctx: DashboardContext,
    validators: FilterValidators<IAnalyticalWidget>,
    cmd: IDashboardCommand,
    widget: IAnalyticalWidget,
    op: FilterOpReplaceAll,
): SagaIterator<FilterOpResult> {
    let dateDataSet: ICatalogDateDataset | undefined;
    if (op.dateDatasetForFiltering) {
        dateDataSet = yield call(
            validators.dateDatasetValidator,
            ctx,
            cmd,
            widget,
            op.dateDatasetForFiltering,
        );
    }

    let ignoredFilters: IDashboardAttributeFilter[] | undefined = undefined;
    if (op.ignoreAttributeFilters) {
        ignoredFilters = yield call(
            validators.attributeFilterValidator,
            ctx,
            cmd,
            widget,
            op.ignoreAttributeFilters,
        );
    }

    return {
        dateDataSet,
        ignoredFilters,
    };
}

function* disableDateFilter(
    ctx: DashboardContext,
    validators: FilterValidators<IAnalyticalWidget>,
    cmd: IDashboardCommand,
    widget: IAnalyticalWidget,
): SagaIterator<FilterOpResult> {
    const replaceEquivalent: FilterOpReplaceAll = {
        type: "replace",
        dateDatasetForFiltering: undefined,
        ignoreAttributeFilters: toAttributeDisplayFormRefs(widget.ignoreDashboardFilters),
    };

    return yield call(replaceFilterSettings, ctx, validators, cmd, widget, replaceEquivalent);
}

function* enableDateFilter(
    ctx: DashboardContext,
    validators: FilterValidators<IAnalyticalWidget>,
    cmd: IDashboardCommand,
    widget: IAnalyticalWidget,
    op: FilterOpEnableDateFilter,
): SagaIterator<FilterOpResult> {
    const replaceEquivalent: FilterOpReplaceAll = {
        type: "replace",
        dateDatasetForFiltering: op.dateDataset,
        ignoreAttributeFilters: toAttributeDisplayFormRefs(widget.ignoreDashboardFilters),
    };

    return yield call(replaceFilterSettings, ctx, validators, cmd, widget, replaceEquivalent);
}

function* replaceAttributeIgnores(
    ctx: DashboardContext,
    validators: FilterValidators<IAnalyticalWidget>,
    cmd: IDashboardCommand,
    widget: IAnalyticalWidget,
    op: FilterOpReplaceAttributeIgnores,
): SagaIterator<FilterOpResult> {
    const replaceEquivalent: FilterOpReplaceAll = {
        type: "replace",
        dateDatasetForFiltering: widget.dateDataSet,
        ignoreAttributeFilters: op.displayFormRefs,
    };

    return yield call(replaceFilterSettings, ctx, validators, cmd, widget, replaceEquivalent);
}

function* ignoreAttributeFilter(
    ctx: DashboardContext,
    validators: FilterValidators<IAnalyticalWidget>,
    cmd: IDashboardCommand,
    widget: IAnalyticalWidget,
    op: FilterOpIgnoreAttributeFilter,
): SagaIterator<FilterOpResult> {
    const replaceIntermediate: FilterOpReplaceAll = {
        type: "replace",
        dateDatasetForFiltering: widget.dateDataSet,
        ignoreAttributeFilters: op.displayFormRefs,
    };

    const intermediate: SagaReturnType<typeof replaceFilterSettings> = yield call(
        replaceFilterSettings,
        ctx,
        validators,
        cmd,
        widget,
        replaceIntermediate,
    );
    const attributeFilters: ReturnType<typeof selectFilterContextAttributeFilters> = yield select(
        selectFilterContextAttributeFilters,
    );
    const alreadyIgnored = getIgnoredAttributeFilters(attributeFilters, widget.ignoreDashboardFilters);
    const addToIgnore = (intermediate.ignoredFilters ?? []).filter((candidate) => {
        return (
            alreadyIgnored.find((ignoredFilter) =>
                areObjRefsEqual(
                    ignoredFilter.attributeFilter.displayForm,
                    candidate.attributeFilter.displayForm,
                ),
            ) === undefined
        );
    });

    return {
        dateDataSet: intermediate.dateDataSet,
        ignoredFilters: [...alreadyIgnored, ...addToIgnore],
    };
}

function* unignoreAttributeFilter(
    ctx: DashboardContext,
    validators: FilterValidators<IAnalyticalWidget>,
    cmd: IDashboardCommand,
    widget: IAnalyticalWidget,
    op: FilterOpUnignoreAttributeFilter,
): SagaIterator<FilterOpResult> {
    const replaceIntermediate: FilterOpReplaceAll = {
        type: "replace",
        dateDatasetForFiltering: widget.dateDataSet,
        ignoreAttributeFilters: op.displayFormRefs,
    };

    const intermediate: SagaReturnType<typeof replaceFilterSettings> = yield call(
        replaceFilterSettings,
        ctx,
        validators,
        cmd,
        widget,
        replaceIntermediate,
    );
    const attributeFilters: ReturnType<typeof selectFilterContextAttributeFilters> = yield select(
        selectFilterContextAttributeFilters,
    );
    const alreadyIgnored = getIgnoredAttributeFilters(attributeFilters, widget.ignoreDashboardFilters);
    const reducedIgnores = alreadyIgnored.filter((candidate) => {
        return (
            (intermediate.ignoredFilters ?? []).find((toRemove) =>
                areObjRefsEqual(candidate.attributeFilter.displayForm, toRemove.attributeFilter.displayForm),
            ) === undefined
        );
    });

    return {
        dateDataSet: intermediate.dateDataSet,
        ignoredFilters: reducedIgnores,
    };
}

//
//
//

/**
 * Result of the filter operation. This is fully resolved variant of filter settings that should be set as-is
 * on the widget.
 */
export type FilterOpResult = {
    /**
     * Date data set (if any) to use for date filtering the widget
     */
    dateDataSet?: ICatalogDateDataset;

    /**
     * Attribute filters to ignore on the widget.
     */
    ignoredFilters?: IDashboardAttributeFilter[];
};

export type DateDatasetValidator<T extends IAnalyticalWidget> = (
    ctx: DashboardContext,
    cmd: IDashboardCommand,
    widget: T,
    ref: ObjRef,
) => SagaIterator<ICatalogDateDataset>;
export type AttributeFilterValidator<T extends IAnalyticalWidget> = (
    ctx: DashboardContext,
    cmd: IDashboardCommand,
    widget: T,
    refs: ObjRef[],
) => SagaIterator<IDashboardAttributeFilter[] | undefined>;
export type FilterValidators<T extends IAnalyticalWidget> = {
    dateDatasetValidator: DateDatasetValidator<T>;
    attributeFilterValidator: AttributeFilterValidator<T>;
};

export type FilterOpCommand = IDashboardCommand & {
    payload: {
        readonly operation: WidgetFilterOperation;
    };
};

/**
 * This is one of the more complex event handlers. Here is a little introduction to make studying easier. You
 * really should read this first because you start messing around here villy-nilly. It can simplify things hopefully.
 *
 * In order to provide rich/convenient API for fiddling with widget filters, the widget filter setting commands
 * allow caller to use different types of operations such as:
 *
 * -  replace filter settings completely
 * -  enable/disable date filter (by setting or unsetting date dataset)
 * -  replace list of attribute filters to ignore
 * -  add/remove one or more items from a list of attribute filters to ignore
 *
 * To keep things sane, the handler opts out for convenient - yet perhaps not optimal approach to implement these
 * operations:
 *
 * 1.  The operation to replace filter settings completely can handle validation and resolution of date dataset
 *     to filter by and attribute filters to ignore. In a way, this is the ultimate operation that can achieve
 *     everything.
 *
 * 2.  All the other operations are just thin wrappers on top of the replace filter settings. The sub-operation always
 *     prepare a 'quasi replace' or 'intermediate replace', call the the replace settings operation and
 *     then either send the results off or tweak them.
 *
 *     The latter is the case for the ignore/unignore one or more attribute filter operations. These cannot be
 *     mapped 1-1 to just the replace. However, the replace operation is still used to do intermediate work/validations.
 *
 *     The result of the intermediate operation is then tweaked. The funniest example is the unignore operation:
 *
 *     -  the intermediate operation is set with the existing date data set setting that is on the widget - this is
 *        because it should be untouched yet we need to perform resolution to catalog date dataset for the
 *        purpose of having nice, rich eventing in the end
 *
 *     -  the intermediate operation is set with attribute filters that should be removed from ignore list. that is
 *        because code needs to verify the input - whether the display form is valid and used in some attribute filter
 *
 *     -  the replace operation does the validations.. it essentially resolves date data set ref to a nice catalog
 *        date dataset info & resolves display form of the filter to remove to an attribute filter to remove
 *
 *     -  the unignore op then fiddles with with existing ignore list and removes the attribute filter that was
 *        validated and resolved by the intermediate replace operation
 */
export function* processFilterOp(
    ctx: DashboardContext,
    validators: FilterValidators<IAnalyticalWidget>,
    cmd: FilterOpCommand,
    widget: IAnalyticalWidget,
): SagaIterator<FilterOpResult> {
    const {
        payload: { operation },
    } = cmd;

    switch (operation.type) {
        case "replace": {
            return yield call(replaceFilterSettings, ctx, validators, cmd, widget, operation);
        }
        case "disableDateFilter": {
            return yield call(disableDateFilter, ctx, validators, cmd, widget);
        }
        case "enableDateFilter": {
            return yield call(enableDateFilter, ctx, validators, cmd, widget, operation);
        }
        case "replaceAttributeIgnores": {
            return yield call(replaceAttributeIgnores, ctx, validators, cmd, widget, operation);
        }
        case "ignoreAttributeFilter": {
            return yield call(ignoreAttributeFilter, ctx, validators, cmd, widget, operation);
        }
        case "unignoreAttributeFilter": {
            return yield call(unignoreAttributeFilter, ctx, validators, cmd, widget, operation);
        }
    }
}
