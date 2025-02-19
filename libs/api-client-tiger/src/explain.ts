// (C) 2021 GoodData Corporation
import { AxiosInstance } from "axios";
import { ActionsApi, ActionsApiInterface } from "./generated/afm-rest-api";

export const tigerAfmExplainClientFactory = (axios: AxiosInstance): Pick<ActionsApiInterface, "explainAFM"> =>
    new ActionsApi({}, "", axios);
