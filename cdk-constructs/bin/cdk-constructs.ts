#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkConstructsStack } from '../lib/cdk-constructs-stack';

const app = new cdk.App();
new CdkConstructsStack(app, 'CdkConstructsStack');