// (C) 2021 GoodData Corporation
import invariant from "ts-invariant";
import { ObjRef } from "../objRef";

/**
 * Represents platform user.
 *
 * @public
 */
export interface IUser {
    /**
     * Stored user reference.
     */
    ref: ObjRef;

    /**
     * Login - unique user ID for logging into the platform.
     */
    login: string;

    /**
     * Contact email of the user.
     */
    email?: string;

    /**
     * Full name.
     *
     * Note: This property has higher priority than firstName / lastName.
     * Backend implementation MUST fill this property if user names are supported.
     */
    fullName?: string;

    /**
     * First name - when backend implementations supports it.
     */
    firstName?: string;

    /**
     * Last name - when backend implementations supports it.
     */
    lastName?: string;
}

/**
 * Gets the user full name
 *
 * @param user - user to get full name of
 * @returns the user full name
 * @public
 */
export function userFullName(user: IUser): string | undefined {
    invariant(user, "user to get full name of must be specified");

    return user.fullName;
}
