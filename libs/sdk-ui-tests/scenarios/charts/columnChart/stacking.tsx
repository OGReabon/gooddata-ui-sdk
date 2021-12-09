// (C) 2007-2019 GoodData Corporation

import { scenariosFor } from "../../../src";
import { ColumnChart, IColumnChartProps } from "@gooddata/sdk-ui-charts";
import {
    ColumnChartWithArithmeticMeasuresAndViewBy,
    ColumnChartWithSingleMeasureAndViewBy,
    ColumnChartWithTwoMeasuresAndTwoViewBy,
} from "./base";
import { measureLocalId } from "@gooddata/sdk-model";
import { ReferenceLdm, ReferenceLdmExt } from "@gooddata/reference-workspace";
import { ScenarioGroupNames } from "../_infra/groupNames";

export default scenariosFor<IColumnChartProps>("ColumnChart", ColumnChart)
    .withGroupNames(ScenarioGroupNames.Stacking)
    .withVisualTestConfig({ screenshotSize: { width: 800, height: 600 } })
    .withDefaultTags("vis-config-only", "mock-no-scenario-meta")
    .addScenario("two measures and two viewBy with stackMeasures", {
        ...ColumnChartWithTwoMeasuresAndTwoViewBy,
        config: {
            stackMeasures: true,
        },
    })
    .addScenario("two measures and two viewBy with stackMeasuresToPercent", {
        ...ColumnChartWithTwoMeasuresAndTwoViewBy,
        config: {
            stackMeasuresToPercent: true,
        },
    })
    .addScenario("two measures and two viewBy with right axis and stackMeasuresToPercent", {
        ...ColumnChartWithTwoMeasuresAndTwoViewBy,
        config: {
            stackMeasuresToPercent: true,
            secondary_yaxis: {
                measures: [measureLocalId(ReferenceLdm.Amount), measureLocalId(ReferenceLdm.Won)],
            },
        },
    })
    .addScenario("Stack measures to 100% with and axis min/max", {
        ...ColumnChartWithTwoMeasuresAndTwoViewBy,
        config: {
            stackMeasuresToPercent: true,
            dataLabels: {
                visible: true,
            },
            yaxis: {
                min: "0.1",
                max: "0.9",
            },
        },
    })
    .addScenario("two measures with dual axis ignores stack measures", {
        ...ColumnChartWithTwoMeasuresAndTwoViewBy,
        config: {
            stackMeasures: true,
            secondary_yaxis: {
                measures: [measureLocalId(ReferenceLdm.Amount)],
            },
        },
    })
    .addScenario("two measures with dual axis and stack measures to 100%", {
        ...ColumnChartWithTwoMeasuresAndTwoViewBy,
        config: {
            stackMeasuresToPercent: true,
            secondary_yaxis: {
                measures: [measureLocalId(ReferenceLdm.Amount)],
            },
        },
    })
    .addScenario("aaaa3a stack measures and dual axis", {
        ...ColumnChartWithArithmeticMeasuresAndViewBy,
        config: {
            dataLabels: {
                visible: true,
            },
            stackMeasures: true,
            secondary_yaxis: {
                measures: [measureLocalId(ReferenceLdmExt.CalculatedWonLostRatio)],
            },
        },
    })
    .addScenario("stack measures to 100% and dual axis", {
        ...ColumnChartWithArithmeticMeasuresAndViewBy,
        config: {
            stackMeasuresToPercent: true,
            secondary_yaxis: {
                measures: [measureLocalId(ReferenceLdmExt.CalculatedWonLostRatio)],
            },
        },
    })
    .addScenario("stack measures to 100% with dual axis and axis min/max", {
        ...ColumnChartWithArithmeticMeasuresAndViewBy,
        config: {
            stackMeasuresToPercent: true,
            yaxis: {
                min: "0.1",
                max: "0.9",
            },
            secondary_yaxis: {
                min: "1",
                max: "2",
                measures: [measureLocalId(ReferenceLdmExt.CalculatedWonLostRatio)],
            },
        },
    })
    .addScenario("single measure ignores stack measures", {
        ...ColumnChartWithSingleMeasureAndViewBy,
        config: {
            stackMeasures: true,
        },
    })
    // note: this scenario was described as 'ignores stack to 100%' in old storybooks,
    //  but that was actually not happening, screenshots recorded opposite behavior :)
    .addScenario("single measure with stack to 100%", {
        ...ColumnChartWithSingleMeasureAndViewBy,
        config: {
            stackMeasuresToPercent: true,
        },
    });
