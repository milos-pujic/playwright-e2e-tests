/* eslint-disable @typescript-eslint/no-unused-vars */
import { merge } from 'monocart-reporter';

const reportDataList = [
  process.cwd() + '/monocart-report-chromium-1_2/index.json',
  process.cwd() + '/monocart-report-chromium-2_2/index.json',
  process.cwd() + '/monocart-report-firefox-1_2/index.json',
  process.cwd() + '/monocart-report-firefox-2_2/index.json',
  process.cwd() + '/monocart-report-webkit-1_2/index.json',
  process.cwd() + '/monocart-report-webkit-2_2/index.json'
];

merge(reportDataList, {
  name: 'Playwright E2E Tests',
  outputFile: 'merged-monocart-report/index.html',
  trend: 'previous-trend.json',
  attachmentPath: (currentPath) => {
    const searchStr = '../test-results/';
    const replaceStr = './data/';

    if (currentPath.startsWith(searchStr)) {
      return replaceStr + currentPath.slice(searchStr.length);
    }

    return currentPath;
  }
});
