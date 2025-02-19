// (C) 2021 GoodData Corporation

import {
    IAttributeDisplayFormMetadataObject,
    ICatalogAttribute,
    ICatalogDateDataset,
    IWorkspaceCatalog,
} from "@gooddata/sdk-backend-spi";
import { newDisplayFormMap, ObjRefMap } from "../metadata/objRefMap";
import flatMap from "lodash/flatMap";

/**
 * Factory function that extracts all display forms from catalog entities and returns a map indexing display
 * form `ref` to display form metadata object.
 *
 * The lookups into the map can be done by any type of ObjRef.
 *
 * @param attributes - catalog attributes
 * @param dateDatasets - catalog date datasets
 * @param strictTypeChecking - optionally indicate whether strict type checking should be done using 'type' property of input `idRef`; default is false - the type information will be ignored
 * @alpha
 */
export function createDisplayFormMap(
    attributes: ICatalogAttribute[],
    dateDatasets: ICatalogDateDataset[],
    strictTypeChecking: boolean = false,
): ObjRefMap<IAttributeDisplayFormMetadataObject> {
    const nonDateDisplayForms = flatMap(attributes, (a) => [...a.displayForms, ...a.geoPinDisplayForms]);
    const dateDisplayForms = flatMap(dateDatasets, (d) =>
        flatMap(d.dateAttributes, (a) => a.attribute.displayForms),
    );

    return newDisplayFormMap([...nonDateDisplayForms, ...dateDisplayForms], strictTypeChecking);
}

/**
 * Factory function that extracts all display forms from workspace catalog and returns a map indexing
 * display form's `ref` to display form metadata object.
 *
 * The lookups into the map can be done by any type of ObjRef.
 *
 * @param catalog - workspace catalog
 * @param strictTypeChecking - optionally indicate whether strict type checking should be done using 'type' property of input `idRef`; default is false - the type information will be ignored
 * @alpha
 */
export function createDisplayFormMapFromCatalog(
    catalog: IWorkspaceCatalog,
    strictTypeChecking: boolean = false,
): ObjRefMap<IAttributeDisplayFormMetadataObject> {
    return createDisplayFormMap(catalog.attributes(), catalog.dateDatasets(), strictTypeChecking);
}
