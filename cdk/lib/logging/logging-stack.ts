import { Stack, StackProps } from 'aws-cdk-lib';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface LoggingStackProps extends StackProps {
  readonly applicationName: string;
}

export class LoggingStack extends Stack {
  readonly logGroup: LogGroup;

  constructor(scope: Construct, id: string, props: LoggingStackProps) {
    super(scope, id, props);

    const { applicationName } = props;

    this.logGroup = new LogGroup(this, 'ApplicationLogGroup', {
      logGroupName: applicationName,
    });
  }
}
