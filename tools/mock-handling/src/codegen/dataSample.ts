// (C) 2020 GoodData Corporation
import { OptionalKind, VariableDeclarationKind, VariableStatementStructure } from "ts-morph";
import * as path from "path";
import { createUniqueVariableName } from "../base/variableNaming";
import { DisplayFormRecording } from "../recordings/displayForms";
import groupBy = require("lodash/groupBy");

const DataSampleConstName = "DataSamples";

type DataSampleRecording = [string, DisplayFormRecording];

function generateRecordingForDataSample(entries: DataSampleRecording[]): string {
    return `{ ${entries
        .map(([_, entryRecording]) => {
            return `${entryRecording.getAttributeElements().map((element, index) => {
                return `${createUniqueVariableName(
                    element.title,
                )} : ${entryRecording.getRecordingName()}[${index}]`;
            })}`;
        })
        .join(",")} }`;
}

function comparatorDataSample(a: [string, DataSampleRecording[]], b: [string, DataSampleRecording[]]) {
    if (a[0] < b[0]) {
        return -1;
    } else if (a[0] > b[0]) {
        return 1;
    }

    return 0;
}

function generateDataSampleConst(
    recordings: DisplayFormRecording[],
): OptionalKind<VariableStatementStructure> {
    const recsWithDataSample: DataSampleRecording[] = recordings.map(rec => [
        createUniqueVariableName(rec.getDisplayFormTitle()),
        rec,
    ]);

    const entriesDataSample = Object.entries(groupBy(recsWithDataSample, ([title]) => title)).sort(
        comparatorDataSample,
    );
    return {
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
            {
                name: DataSampleConstName,
                initializer: `{ ${entriesDataSample
                    .map(([title, rec]) => `${title}: ${generateRecordingForDataSample(rec)}`)
                    .join(",")} }`,
            },
        ],
    };
}

/**
 * Generate constants for the display form recordings and data sample. This function will return non-exported constant per recording
 * and then also an exported 'DataSamples' constant that is a map from data sample => display form => recording.
 *
 * @param recordings - recordings to generate constants for
 * @param targetDir - absolute path to directory where index will be stored, this is needed so that paths can be
 *   made relative for require()
 */
export function generateConstantsForDataSamples(
    recordings: DisplayFormRecording[],
    targetDir: string,
): Array<OptionalKind<VariableStatementStructure>> {
    const recConsts = recordings.map(rec => {
        return {
            declarationKind: VariableDeclarationKind.Const,
            isExported: false,
            declarations: [
                {
                    name: rec.getRecordingName(),
                    initializer: `require('./${path.relative(targetDir, rec.elementFile)}')`,
                },
            ],
        };
    });
    return [...recConsts, generateDataSampleConst(recordings)];
}
