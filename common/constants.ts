/*
 * Psafe app - Psafe Constants file
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import path from 'path';
import { version } from '../package.json';

// Plugin
export const PLUGIN_VERSION = version;
export const PLUGIN_VERSION_SHORT = version.split('.').splice(0,2).join('.');

// Index patterns - Psafe alerts
export const PSAFE_INDEX_TYPE_ALERTS = 'alerts';
export const PSAFE_ALERTS_PREFIX = 'psafe-alerts-';
export const PSAFE_ALERTS_PATTERN = 'psafe-alerts-*';

// Job - Psafe monitoring
export const PSAFE_INDEX_TYPE_MONITORING = "monitoring";
export const PSAFE_MONITORING_PREFIX = "psafe-monitoring-";
export const PSAFE_MONITORING_PATTERN = "psafe-monitoring-*";
export const PSAFE_MONITORING_TEMPLATE_NAME = "psafe-agent";
export const PSAFE_MONITORING_DEFAULT_INDICES_SHARDS = 1;
export const PSAFE_MONITORING_DEFAULT_INDICES_REPLICAS = 0;
export const PSAFE_MONITORING_DEFAULT_CREATION = 'w';
export const PSAFE_MONITORING_DEFAULT_ENABLED = true;
export const PSAFE_MONITORING_DEFAULT_FREQUENCY = 900;
export const PSAFE_MONITORING_DEFAULT_CRON_FREQ = '0 * * * * *';

// Job - Psafe statistics
export const PSAFE_INDEX_TYPE_STATISTICS = "statistics";
export const PSAFE_STATISTICS_DEFAULT_PREFIX = "psafe";
export const PSAFE_STATISTICS_DEFAULT_NAME = "statistics";
export const PSAFE_STATISTICS_PATTERN = `${PSAFE_STATISTICS_DEFAULT_PREFIX}-${PSAFE_STATISTICS_DEFAULT_NAME}-*`;
export const PSAFE_STATISTICS_TEMPLATE_NAME = `${PSAFE_STATISTICS_DEFAULT_PREFIX}-${PSAFE_STATISTICS_DEFAULT_NAME}`;
export const PSAFE_STATISTICS_DEFAULT_INDICES_SHARDS = 1;
export const PSAFE_STATISTICS_DEFAULT_INDICES_REPLICAS = 0;
export const PSAFE_STATISTICS_DEFAULT_CREATION = 'w';
export const PSAFE_STATISTICS_DEFAULT_STATUS = true;
export const PSAFE_STATISTICS_DEFAULT_FREQUENCY = 900;
export const PSAFE_STATISTICS_DEFAULT_CRON_FREQ = '0 */5 * * * *';

// Job - Psafe initialize
export const PSAFE_PLUGIN_PLATFORM_TEMPLATE_NAME = 'psafe-kibana';

// Permissions
export const PSAFE_ROLE_ADMINISTRATOR_ID = 1;
export const PSAFE_ROLE_ADMINISTRATOR_NAME = 'administrator';

// Sample data
export const PSAFE_SAMPLE_ALERT_PREFIX = 'psafe-alerts-4.x-';
export const PSAFE_SAMPLE_ALERTS_INDEX_SHARDS = 1;
export const PSAFE_SAMPLE_ALERTS_INDEX_REPLICAS = 0;
export const PSAFE_SAMPLE_ALERTS_CATEGORY_SECURITY = 'security';
export const PSAFE_SAMPLE_ALERTS_CATEGORY_AUDITING_POLICY_MONITORING = 'auditing-policy-monitoring';
export const PSAFE_SAMPLE_ALERTS_CATEGORY_THREAT_DETECTION = 'threat-detection';
export const PSAFE_SAMPLE_ALERTS_DEFAULT_NUMBER_ALERTS = 3000;
export const PSAFE_SAMPLE_ALERTS_CATEGORIES_TYPE_ALERTS = {
  [PSAFE_SAMPLE_ALERTS_CATEGORY_SECURITY]: [
    { syscheck: true },
    { aws: true },
    { office: true },
    { gcp: true },
    { authentication: true },
    { ssh: true },
    { apache: true, alerts: 2000 },
    { web: true },
    { windows: { service_control_manager: true }, alerts: 1000 },
    { github: true }
  ],
  [PSAFE_SAMPLE_ALERTS_CATEGORY_AUDITING_POLICY_MONITORING]: [
    { rootcheck: true },
    { audit: true },
    { openscap: true },
    { ciscat: true },
  ],
  [PSAFE_SAMPLE_ALERTS_CATEGORY_THREAT_DETECTION]: [
    { vulnerabilities: true },
    { virustotal: true },
    { osquery: true },
    { docker: true },
    { mitre: true },
  ],
};

// Security
export const PSAFE_SECURITY_PLUGIN_XPACK_SECURITY = 'X-Pack Security';
export const PSAFE_SECURITY_PLUGIN_OPEN_DISTRO_FOR_ELASTICSEARCH = 'Open Distro for Elasticsearch';

export const PSAFE_SECURITY_PLUGINS = [
  PSAFE_SECURITY_PLUGIN_XPACK_SECURITY,
  PSAFE_SECURITY_PLUGIN_OPEN_DISTRO_FOR_ELASTICSEARCH,
];

// App configuration
export const PSAFE_CONFIGURATION_CACHE_TIME = 10000; // time in ms;
export const PSAFE_CONFIGURATION_SETTINGS_NEED_RESTART = [
  'psafe.monitoring.enabled',
  'psafe.monitoring.frequency',
  'cron.statistics.interval',
  'logs.level',
];
export const PSAFE_CONFIGURATION_SETTINGS_NEED_HEALTH_CHECK = [
  'pattern',
  'psafe.monitoring.replicas',
  'psafe.monitoring.creation',
  'psafe.monitoring.pattern',
  'alerts.sample.prefix',
  'cron.statistics.index.name',
  'cron.statistics.index.creation',
  'cron.statistics.index.shards',
  'cron.statistics.index.replicas',
  'psafe.monitoring.shards',
];
export const PSAFE_CONFIGURATION_SETTINGS_NEED_RELOAD = [
  'hideManagerAlerts',
  'customization.logo.sidebar'
];

// Reserved ids for Users/Role mapping
export const PSAFE_API_RESERVED_ID_LOWER_THAN = 100;

// Psafe data path
const PSAFE_DATA_PLUGIN_PLATFORM_BASE_PATH = 'data';
export const PSAFE_DATA_PLUGIN_PLATFORM_BASE_ABSOLUTE_PATH = path.join(
  __dirname,
  '../../../',
  PSAFE_DATA_PLUGIN_PLATFORM_BASE_PATH
);
export const PSAFE_DATA_ABSOLUTE_PATH = path.join(PSAFE_DATA_PLUGIN_PLATFORM_BASE_ABSOLUTE_PATH, 'psafe');

// Psafe data path - config
export const PSAFE_DATA_CONFIG_DIRECTORY_PATH = path.join(PSAFE_DATA_ABSOLUTE_PATH, 'config');
export const PSAFE_DATA_CONFIG_APP_PATH = path.join(PSAFE_DATA_CONFIG_DIRECTORY_PATH, 'psafe.yml');
export const PSAFE_DATA_CONFIG_REGISTRY_PATH = path.join(
  PSAFE_DATA_CONFIG_DIRECTORY_PATH,
  'psafe-registry.json'
);

// Psafe data path - logs
export const MAX_MB_LOG_FILES = 100;
export const PSAFE_DATA_LOGS_DIRECTORY_PATH = path.join(PSAFE_DATA_ABSOLUTE_PATH, 'logs');
export const PSAFE_DATA_LOGS_PLAIN_FILENAME = 'psafeapp-plain.log';
export const PSAFE_DATA_LOGS_PLAIN_PATH = path.join(
  PSAFE_DATA_LOGS_DIRECTORY_PATH,
  PSAFE_DATA_LOGS_PLAIN_FILENAME
);
export const PSAFE_DATA_LOGS_RAW_FILENAME = 'psafeapp.log';
export const PSAFE_DATA_LOGS_RAW_PATH = path.join(
  PSAFE_DATA_LOGS_DIRECTORY_PATH,
  PSAFE_DATA_LOGS_RAW_FILENAME
);

// Psafe data path - UI logs
export const PSAFE_UI_LOGS_PLAIN_FILENAME = 'psafe-ui-plain.log';
export const PSAFE_UI_LOGS_RAW_FILENAME = 'psafe-ui.log';
export const PSAFE_UI_LOGS_PLAIN_PATH = path.join(
  PSAFE_DATA_LOGS_DIRECTORY_PATH,
  PSAFE_UI_LOGS_PLAIN_FILENAME
);
export const PSAFE_UI_LOGS_RAW_PATH = path.join(PSAFE_DATA_LOGS_DIRECTORY_PATH, PSAFE_UI_LOGS_RAW_FILENAME);

// Psafe data path - downloads
export const PSAFE_DATA_DOWNLOADS_DIRECTORY_PATH = path.join(PSAFE_DATA_ABSOLUTE_PATH, 'downloads');
export const PSAFE_DATA_DOWNLOADS_REPORTS_DIRECTORY_PATH = path.join(
  PSAFE_DATA_DOWNLOADS_DIRECTORY_PATH,
  'reports'
);

// Queue
export const PSAFE_QUEUE_CRON_FREQ = '*/15 * * * * *'; // Every 15 seconds

// Default App Config
export const PSAFE_DEFAULT_APP_CONFIG = {
  pattern: PSAFE_ALERTS_PATTERN,
  'checks.pattern': true,
  'checks.template': true,
  'checks.api': true,
  'checks.setup': true,
  'checks.fields': true,
  'checks.metaFields': true,
  'checks.maxBuckets': true,
  'checks.timeFilter': true,
  'extensions.pci': true,
  'extensions.gdpr': true,
  'extensions.hipaa': true,
  'extensions.nist': true,
  'extensions.tsc': true,
  'extensions.audit': true,
  'extensions.oscap': false,
  'extensions.ciscat': false,
  'extensions.aws': false,
  'extensions.office': false,
  'extensions.github': false,
  'extensions.gcp': false,
  'extensions.virustotal': false,
  'extensions.osquery': false,
  'extensions.docker': false,
  timeout: 20000,
  'ip.selector': true,
  'ip.ignore': [],
  'xpack.rbac.enabled': true,
  'psafe.monitoring.enabled': PSAFE_MONITORING_DEFAULT_ENABLED,
  'psafe.monitoring.frequency': PSAFE_MONITORING_DEFAULT_FREQUENCY,
  'psafe.monitoring.shards': PSAFE_MONITORING_DEFAULT_INDICES_SHARDS,
  'psafe.monitoring.replicas': PSAFE_MONITORING_DEFAULT_INDICES_REPLICAS,
  'psafe.monitoring.creation': PSAFE_MONITORING_DEFAULT_CREATION,
  'psafe.monitoring.pattern': PSAFE_MONITORING_PATTERN,
  'cron.prefix': PSAFE_STATISTICS_DEFAULT_PREFIX,
  'cron.statistics.status': PSAFE_STATISTICS_DEFAULT_STATUS,
  'cron.statistics.apis': [],
  'cron.statistics.interval': PSAFE_STATISTICS_DEFAULT_CRON_FREQ,
  'cron.statistics.index.name': PSAFE_STATISTICS_DEFAULT_NAME,
  'cron.statistics.index.creation': PSAFE_STATISTICS_DEFAULT_CREATION,
  'cron.statistics.index.shards': PSAFE_STATISTICS_DEFAULT_INDICES_SHARDS,
  'cron.statistics.index.replicas': PSAFE_STATISTICS_DEFAULT_INDICES_REPLICAS,
  'alerts.sample.prefix': PSAFE_SAMPLE_ALERT_PREFIX,
  hideManagerAlerts: false,
  'logs.level': 'info',
  'enrollment.dns': '',
  'enrollment.password': '',
  'customization.logo.app': '',
  'customization.logo.sidebar': '',
  'customization.logo.healthcheck':'',
  'customization.logo.reports': ''
};

// Psafe errors
export const PSAFE_ERROR_DAEMONS_NOT_READY = 'ERROR3099';

// Agents
export enum PSAFE_AGENTS_OS_TYPE {
  WINDOWS = 'windows',
  LINUX = 'linux',
  SUNOS = 'sunos',
  DARWIN = 'darwin',
  OTHERS = '',
}

export enum PSAFE_MODULES_ID {
  SECURITY_EVENTS = 'general',
  INTEGRITY_MONITORING = 'fim',
  AMAZON_WEB_SERVICES = 'aws',
  OFFICE_365 = 'office',
  GOOGLE_CLOUD_PLATFORM = 'gcp',
  POLICY_MONITORING = 'pm',
  SECURITY_CONFIGURATION_ASSESSMENT = 'sca',
  AUDITING = 'audit',
  OPEN_SCAP = 'oscap',
  VULNERABILITIES = 'vuls',
  OSQUERY = 'osquery',
  DOCKER = 'docker',
  MITRE_ATTACK = 'mitre',
  PCI_DSS = 'pci',
  HIPAA = 'hipaa',
  NIST_800_53 = 'nist',
  TSC = 'tsc',
  CIS_CAT = 'ciscat',
  VIRUSTOTAL = 'virustotal',
  GDPR = 'gdpr',
  GITHUB = 'github'
};

export enum PSAFE_MENU_MANAGEMENT_SECTIONS_ID {
  MANAGEMENT = 'management',
  ADMINISTRATION = 'administration',
  RULESET = 'ruleset',
  RULES = 'rules',
  DECODERS = 'decoders',
  CDB_LISTS = 'lists',
  GROUPS = 'groups',
  CONFIGURATION = 'configuration',
  STATUS_AND_REPORTS = 'statusReports',
  STATUS = 'status',
  CLUSTER = 'monitoring',
  LOGS = 'logs',
  REPORTING = 'reporting',
  STATISTICS = 'statistics',
};

export enum PSAFE_MENU_TOOLS_SECTIONS_ID {
  API_CONSOLE = 'devTools',
  RULESET_TEST = 'logtest',
};

export enum PSAFE_MENU_SECURITY_SECTIONS_ID {
  USERS = 'users',
  ROLES = 'roles',
  POLICIES = 'policies',
  ROLES_MAPPING = 'roleMapping',
};

export enum PSAFE_MENU_SETTINGS_SECTIONS_ID {
  SETTINGS = 'settings',
  API_CONFIGURATION = 'api',
  MODULES = 'modules',
  SAMPLE_DATA = 'sample_data',
  CONFIGURATION = 'configuration',
  LOGS = 'logs',
  MISCELLANEOUS = 'miscellaneous',
  ABOUT = 'about',
};

export const AUTHORIZED_AGENTS = 'authorized-agents';

// Psafe links
export const PSAFE_LINK_GITHUB = 'https://github.com/psafe';
export const PSAFE_LINK_GOOGLE_GROUPS = 'https://groups.google.com/forum/#!forum/psafe';
export const PSAFE_LINK_SLACK = 'https://psafe.com/community/join-us-on-slack';

export const HEALTH_CHECK = 'health-check';

// Health check
export const HEALTH_CHECK_REDIRECTION_TIME = 300; //ms

// Plugin platform settings
// Default timeFilter set by the app
export const PSAFE_PLUGIN_PLATFORM_SETTING_TIME_FILTER = {
  from: 'now-24h',
  to: 'now',
};
export const PLUGIN_PLATFORM_SETTING_NAME_TIME_FILTER = 'timepicker:timeDefaults';

// Default maxBuckets set by the app
export const PSAFE_PLUGIN_PLATFORM_SETTING_MAX_BUCKETS = 200000;
export const PLUGIN_PLATFORM_SETTING_NAME_MAX_BUCKETS = 'timelion:max_buckets';

// Default metaFields set by the app
export const PSAFE_PLUGIN_PLATFORM_SETTING_METAFIELDS = ['_source', '_index'];
export const PLUGIN_PLATFORM_SETTING_NAME_METAFIELDS = 'metaFields';

// Logger
export const UI_LOGGER_LEVELS = {
  WARNING: 'WARNING',
  INFO: 'INFO',
  ERROR: 'ERROR',
};

export const UI_TOAST_COLOR = {
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
};

// Assets
export const ASSETS_BASE_URL_PREFIX = '/plugins/psafe/assets/';
export const ASSETS_PUBLIC_URL = '/plugins/psafe/public/assets/';

// Reports
export const REPORTS_LOGO_IMAGE_ASSETS_RELATIVE_PATH = 'images/logo_reports.png';
export const REPORTS_PRIMARY_COLOR = '#256BD1';
export const REPORTS_PAGE_FOOTER_TEXT = 'Copyright © 2022 Psafe, Inc.';
export const REPORTS_PAGE_HEADER_TEXT = 'info@psafe.com\nhttps://psafe.com';

// Plugin platform
export const PLUGIN_PLATFORM_NAME = 'Kibana';
export const PLUGIN_PLATFORM_BASE_INSTALLATION_PATH = '/usr/share/kibana/data/psafe/';
export const PLUGIN_PLATFORM_INSTALLATION_USER = 'kibana';
export const PLUGIN_PLATFORM_INSTALLATION_USER_GROUP = 'kibana';
export const PLUGIN_PLATFORM_PSAFE_DOCUMENTATION_URL_PATH_UPGRADE_PLATFORM = 'upgrade-guide';
export const PLUGIN_PLATFORM_PSAFE_DOCUMENTATION_URL_PATH_TROUBLESHOOTING = 'user-manual/elasticsearch/troubleshooting.html';
export const PLUGIN_PLATFORM_PSAFE_DOCUMENTATION_URL_PATH_APP_CONFIGURATION = 'user-manual/psafe-dashboard/config-file.html';
export const PLUGIN_PLATFORM_URL_GUIDE = 'https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html';
export const PLUGIN_PLATFORM_URL_GUIDE_TITLE = 'Elastic guide';
export const PLUGIN_PLATFORM_REQUEST_HEADERS = {
  'kbn-xsrf': 'kibana'
};

// UI
export const API_NAME_AGENT_STATUS = {
  ACTIVE: 'active',
  DISCONNECTED: 'disconnected',
  PENDING: 'pending',
  NEVER_CONNECTED: 'never_connected',
} as const;

export const UI_COLOR_AGENT_STATUS = {
  [API_NAME_AGENT_STATUS.ACTIVE]: '#007871',
  [API_NAME_AGENT_STATUS.DISCONNECTED]: '#BD271E',
  [API_NAME_AGENT_STATUS.PENDING]: '#FEC514',
  [API_NAME_AGENT_STATUS.NEVER_CONNECTED]: '#646A77',
  default: '#000000'
} as const;

export const UI_LABEL_NAME_AGENT_STATUS = {
  [API_NAME_AGENT_STATUS.ACTIVE]: 'Active',
  [API_NAME_AGENT_STATUS.DISCONNECTED]: 'Disconnected',
  [API_NAME_AGENT_STATUS.PENDING]: 'Pending',
  [API_NAME_AGENT_STATUS.NEVER_CONNECTED]: 'Never connected',
  default: 'Unknown'
} as const;

export const UI_ORDER_AGENT_STATUS = [
  API_NAME_AGENT_STATUS.ACTIVE,
  API_NAME_AGENT_STATUS.DISCONNECTED,
  API_NAME_AGENT_STATUS.PENDING,
  API_NAME_AGENT_STATUS.NEVER_CONNECTED  
];

// Documentation
export const DOCUMENTATION_WEB_BASE_URL = "https://documentation.psafe.com";

// Default Elasticsearch user name context
export const ELASTIC_NAME = 'elastic';
