import { mergeHTMLReports } from 'playwright-merge-html-reports';

const inputReportPaths = [
  process.cwd() + '/playwright-report-chromium-1_2',
  process.cwd() + '/playwright-report-chromium-2_2',
  process.cwd() + '/playwright-report-firefox-1_2',
  process.cwd() + '/playwright-report-firefox-2_2',
  process.cwd() + '/playwright-report-webkit-1_2',
  process.cwd() + '/playwright-report-webkit-2_2'
];

const config = {
  outputFolderName: 'merged-html-report'
};

mergeHTMLReports(inputReportPaths, config);
