// (C) 2019-2021 GoodData Corporation
import { ObjectType, ObjRef } from "@gooddata/sdk-model";

/**
 * Token representing part of parsed MAQL measure expression.
 *
 * @example
 * ```ts
 * // for example "SELECT [/gdc/md/projectId/obj/6273] WHERE [/gdc/md/projectId/obj/6307] = [/gdc/md/projectId/obj/6307/elements?id=5703453]"
 * // could be represented as
 * const expressionTokens = [
 *      {
 *          "type": "text",
 *          "value": "SELECT "
 *      },
 *      {
 *          "type": "measure",
 *          "value": "Amount",
 *      },
 *      {
 *          "type": "text",
 *          "value": " WHERE "
 *      },
 *      {
 *          "type": "attribute",
 *          "value": "Status",
 *      },
 *      {
 *          "type": "text",
 *          "value": " = "
 *      },
 *      {
 *          "type": "attributeElement",
 *          "value": "Won",
 *      }
 *  ]
 * ```
 *
 * @public
 */
export type IMeasureExpressionToken =
    | IObjectExpressionToken
    | IAttributeElementExpressionToken
    | ITextExpressionToken;

/**
 * Parsed {@link https://help.gooddata.com/pages/viewpage.action?pageId=86795279 | MAQL} token referencing a metadata object.
 *
 * @remarks
 * See {@link IMeasureExpressionToken} for more information.
 *
 * @public
 */
export interface IObjectExpressionToken {
    /**
     * Expression token type
     */
    type: ObjectType;

    /**
     * Title of the object
     */
    value: string;

    /**
     * Id of the object
     */
    id?: string;

    /**
     * Ref of the object
     */
    ref: ObjRef;
}

/**
 * Parsed {@link https://help.gooddata.com/pages/viewpage.action?pageId=86795279 | MAQL} token referencing an attribute element.
 *
 * @remarks
 * See {@link IMeasureExpressionToken} for more information.
 *
 * @public
 */
export interface IAttributeElementExpressionToken {
    /**
     * Expression token type
     */
    type: "attributeElement";

    /**
     * Element title
     */
    value: string | undefined;

    /**
     * Deleted element
     */
    deleted?: boolean;
}

/**
 * Parsed {@link https://help.gooddata.com/pages/viewpage.action?pageId=86795279 | MAQL} text.
 *
 * @remarks
 * See {@link IMeasureExpressionToken} for more information.
 *
 * @public
 */
export interface ITextExpressionToken {
    /**
     * Expression token type
     */
    type: "text";

    /**
     * Plain text
     */
    value: string;
}
