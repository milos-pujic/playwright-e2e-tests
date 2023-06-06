/* eslint-disable @typescript-eslint/no-unused-vars */
import { merge } from 'monocart-reporter';

const reportDataList = [
  process.cwd() + '/monocart-report-chromium-1_2/report.json',
  process.cwd() + '/monocart-report-chromium-2_2/report.json',
  process.cwd() + '/monocart-report-firefox-1_2/report.json',
  process.cwd() + '/monocart-report-firefox-2_2/report.json',
  process.cwd() + '/monocart-report-webkit-1_2/report.json',
  process.cwd() + '/monocart-report-webkit-2_2/report.json'
];

merge(reportDataList, {
  name: 'Playwright E2E Tests',
  outputFile: 'merged-monocart-report/report.html',
  attachmentPath: (currentPath, extras) => {
    // return `https://cenfun.github.io/monocart-reporter/${currentPath}`;
  }
});
