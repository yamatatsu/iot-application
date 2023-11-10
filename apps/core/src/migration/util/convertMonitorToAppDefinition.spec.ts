import { convertMonitorToAppDefinition } from './convertMonitorToAppDefinition';
import {
  MonitorAnnotations,
  MonitorMetric,
  MonitorWidgetType,
  SiteWiseMonitorDashboardDefinition,
} from './monitorDashboardDefinition';
import { DashboardWidgetType } from '../../dashboards/entities/dashboard-widget.entity';

const createMonitorChartWidget = (
  widgetType: MonitorWidgetType,
  metrics: MonitorMetric[],
  annotations?: MonitorAnnotations,
) => {
  return {
    type: widgetType,
    title: 'test',
    x: 0,
    y: 0,
    height: 3,
    width: 3,
    metrics,
    alarms: [],
    properties: {
      colorDataAcrossThresholds: true,
    },
    annotations,
  };
};

const createApplicationChartDefinition = (
  widgetType: string,
  properties: object,
) => {
  return {
    type: widgetType,
    x: 0,
    y: 0,
    z: 0,
    width: 99,
    height: 42,
    properties,
  };
};

describe('Dashboard definition conversion', () => {
  it('converts a single SiteWise Monitor line chart into an application line chart', () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.LineChart, metrics)],
    };

    const expectedProperties = {
      title: 'test',
      symbol: {
        style: 'filled-circle',
      },
      axis: {
        yVisible: true,
        xVisible: true,
      },
      line: {
        connectionStyle: 'linear',
        style: 'solid',
      },
      legend: {
        visible: true,
      },
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition('xy-plot', expectedProperties),
      ],
    };
    const applicationDefinition =
      convertMonitorToAppDefinition(lineChartDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('converts multiple SiteWise Monitor line charts into an application line charts', () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
      {
        type: 'iotsitewise',
        label: 'Other metric',
        assetId: '12345678-85db-4c90-854f-4e29d579b898',
        propertyId: '12345678-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.LineChart, metrics)],
    };

    const expectedProperties = {
      title: 'test',
      symbol: {
        style: 'filled-circle',
      },
      axis: {
        yVisible: true,
        xVisible: true,
      },
      line: {
        connectionStyle: 'linear',
        style: 'solid',
      },
      legend: {
        visible: true,
      },
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                },
              ],
            },
            {
              assetId: '12345678-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: '12345678-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition(
          DashboardWidgetType.XYPlot,
          expectedProperties,
        ),
      ],
    };
    const applicationDefinition =
      convertMonitorToAppDefinition(lineChartDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a single SiteWise Monitor bar chart into an application bar chart', () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const barChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.BarChart, metrics)],
    };

    const expectedProperties = {
      title: 'test',
      axis: {
        showX: true,
        showY: true,
      },
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                },
              ],
            },
          ],
        },
      },
      styleSettings: {}, // refId is randomly generated so we are just asserting that styleSettings exists
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition('bar-chart', expectedProperties),
      ],
    };

    const applicationDefinition =
      convertMonitorToAppDefinition(barChartDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a single SiteWise Monitor scatter chart into an application scatter chart', () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        createMonitorChartWidget(MonitorWidgetType.ScatterChart, metrics),
      ],
    };

    const expectedProperties = {
      title: 'test',
      symbol: {
        style: 'filled-circle',
      },
      axis: {
        yVisible: true,
        xVisible: true,
      },
      line: {
        connectionStyle: 'none',
        style: 'solid',
      },
      legend: {
        visible: true,
      },
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition('xy-plot', expectedProperties),
      ],
    };
    const applicationDefinition =
      convertMonitorToAppDefinition(lineChartDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('converts Monitor annotations into Application thresholds', () => {
    const color = '#5e87b5';
    const comparisonOperator = 'LT';
    const showValue = true;
    const value = 100;

    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const annotations = {
      y: [
        {
          color,
          comparisonOperator,
          showValue,
          value,
        },
      ],
    };

    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        createMonitorChartWidget(
          MonitorWidgetType.LineChart,
          metrics,
          annotations,
        ),
      ],
    };

    const expectedProperties = {
      title: 'test',
      thresholds: [
        {
          color,
          comparisonOperator,
          value,
          visible: showValue,
        },
      ],
      symbol: {
        style: 'filled-circle',
      },
      axis: {
        yVisible: true,
        xVisible: true,
      },
      line: {
        connectionStyle: 'linear',
        style: 'solid',
      },
      legend: {
        visible: true,
      },
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition('xy-plot', expectedProperties),
      ],
    };

    const applicationDefinition =
      convertMonitorToAppDefinition(lineChartDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });
});
