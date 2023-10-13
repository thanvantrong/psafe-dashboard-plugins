import fs from 'fs';
import path from 'path';
import { PSAFE_DATA_ABSOLUTE_PATH } from '../../common/constants';

export const createDirectoryIfNotExists = (directory: string): void => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
};

export const createLogFileIfNotExists = (filePath: string): void => {
  if (!fs.existsSync(filePath)) {
    fs.closeSync(fs.openSync(filePath, 'w'));
  }
};

export const createDataDirectoryIfNotExists = (directory?: string) => {
  const absoluteRoute = directory
    ? path.join(PSAFE_DATA_ABSOLUTE_PATH, directory)
    : PSAFE_DATA_ABSOLUTE_PATH;
  if (!fs.existsSync(absoluteRoute)) {
    fs.mkdirSync(absoluteRoute);
  }
};

export const getDataDirectoryRelative = (directory?: string) => {
  return path.join(PSAFE_DATA_ABSOLUTE_PATH, directory);
};
