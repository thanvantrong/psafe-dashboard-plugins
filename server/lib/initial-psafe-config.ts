/*
 * Psafe app - App configuration file
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import {
  PSAFE_ALERTS_PATTERN,
  PSAFE_DEFAULT_APP_CONFIG,
  PSAFE_MONITORING_DEFAULT_CREATION,
  PSAFE_MONITORING_DEFAULT_ENABLED,
  PSAFE_MONITORING_DEFAULT_FREQUENCY,
  PSAFE_MONITORING_DEFAULT_INDICES_REPLICAS,
  PSAFE_MONITORING_DEFAULT_INDICES_SHARDS,
  PSAFE_MONITORING_PATTERN,
  PSAFE_SAMPLE_ALERT_PREFIX,
  PSAFE_STATISTICS_DEFAULT_CREATION,
  PSAFE_STATISTICS_DEFAULT_CRON_FREQ,
  PSAFE_STATISTICS_DEFAULT_INDICES_REPLICAS,
  PSAFE_STATISTICS_DEFAULT_INDICES_SHARDS,
  PSAFE_STATISTICS_DEFAULT_NAME,
  PSAFE_STATISTICS_DEFAULT_PREFIX,
  PSAFE_STATISTICS_DEFAULT_STATUS,
} from '../../common/constants';
import { webDocumentationLink } from '../../common/services/web_documentation';
import { configEquivalences } from '../../common/config-equivalences';

/**
 * Given a string, this function builds a multine string, each line about 70
 * characters long, splitted at the closest whitespace character to that lentgh.
 *
 * This function is used to transform the settings description stored in the
 * configEquivalences map into a multiline string to be used as the setting
 * documentation.
 *
 * The # character is also appended to the beginning of each line.
 *
 * @param text
 * @returns multine string
 */
function splitDescription(text: string = ''): string {
  const lines = text.match(/.{1,80}(?=\s|$)/g) || [];
  return lines.map((z) => '# ' + z.trim()).join('\n');
}

export const initialPsafeConfig: string = `---
#
# Psafe app - App configuration file
# Copyright (C) 2015-2022 Psafe, Inc.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# Find more information about this on the LICENSE file.
#
# ======================== Psafe app configuration file ========================
#
# Please check the documentation for more information about configuration options:
# ${webDocumentationLink('user-manual/psafe-dashboard/config-file.html')}
#
# Also, you can check our repository:
# https://github.com/psafe/psafe-kibana-app
#
# ---------------------------- Unauthorized roles ------------------------------
#
# Disable Psafe for the Elasticsearch / OpenSearch roles defined here.
# disabled_roles:
#   - psafe_disabled
#
# ------------------------------- Index patterns -------------------------------
#
${splitDescription(configEquivalences.pattern)}
# pattern: ${PSAFE_ALERTS_PATTERN}
#
# ----------------------------------- Checks -----------------------------------
#
# Define which checks will be executed by the App's HealthCheck.
# Allowed values are: true, false
#
${splitDescription(configEquivalences['checks.pattern'])}
# checks.pattern: ${PSAFE_DEFAULT_APP_CONFIG['checks.pattern']}
#
${splitDescription(configEquivalences['checks.template'])}
# checks.template: ${PSAFE_DEFAULT_APP_CONFIG['checks.template']}
#
${splitDescription(configEquivalences['checks.api'])}
# checks.api: ${PSAFE_DEFAULT_APP_CONFIG['checks.api']}
#
${splitDescription(configEquivalences['checks.setup'])}
# checks.setup: ${PSAFE_DEFAULT_APP_CONFIG['checks.setup']}
#
${splitDescription(configEquivalences['checks.fields'])}
# checks.fields: ${PSAFE_DEFAULT_APP_CONFIG['checks.fields']}
#
${splitDescription(configEquivalences['checks.metaFields'])}
# checks.metaFields: ${PSAFE_DEFAULT_APP_CONFIG['checks.metaFields']}
#
${splitDescription(configEquivalences['checks.timeFilter'])}
# checks.timeFilter: ${PSAFE_DEFAULT_APP_CONFIG['checks.timeFilter']}
#
${splitDescription(configEquivalences['checks.maxBuckets'])}
# checks.maxBuckets: ${PSAFE_DEFAULT_APP_CONFIG['checks.maxBuckets']}
#
# --------------------------------- Extensions ---------------------------------
#
# Define the initial state of the extensions (enabled / disabled) for recently
# added hosts. The extensions can be enabled or disabled anytime using the UI.
# Allowed values are: true, false
#
${splitDescription(configEquivalences['extensions.pci'])}
# extensions.pci: ${PSAFE_DEFAULT_APP_CONFIG['extensions.pci']}
#
${splitDescription(configEquivalences['extensions.gdpr'])}
# extensions.gdpr: ${PSAFE_DEFAULT_APP_CONFIG['extensions.gdpr']}
#
${splitDescription(configEquivalences['extensions.hipaa'])}
# extensions.hipaa: ${PSAFE_DEFAULT_APP_CONFIG['extensions.hipaa']}
#
${splitDescription(configEquivalences['extensions.nist'])}
# extensions.nist: ${PSAFE_DEFAULT_APP_CONFIG['extensions.nist']}
#
${splitDescription(configEquivalences['extensions.tsc'])}
# extensions.tsc: ${PSAFE_DEFAULT_APP_CONFIG['extensions.tsc']}
#
${splitDescription(configEquivalences['extensions.audit'])}
# extensions.audit: ${PSAFE_DEFAULT_APP_CONFIG['extensions.audit']}
#
${splitDescription(configEquivalences['extensions.oscap'])}
# extensions.oscap: ${PSAFE_DEFAULT_APP_CONFIG['extensions.oscap']}
#
${splitDescription(configEquivalences['extensions.ciscat'])}
# extensions.ciscat: ${PSAFE_DEFAULT_APP_CONFIG['extensions.ciscat']}
#
${splitDescription(configEquivalences['extensions.aws'])}
# extensions.aws: ${PSAFE_DEFAULT_APP_CONFIG['extensions.aws']}
#
${splitDescription(configEquivalences['extensions.gcp'])}
# extensions.gcp: ${PSAFE_DEFAULT_APP_CONFIG['extensions.gcp']}
#
${splitDescription(configEquivalences['extensions.virustotal'])}
# extensions.virustotal: ${PSAFE_DEFAULT_APP_CONFIG['extensions.virustotal']}
#
${splitDescription(configEquivalences['extensions.osquery'])}
# extensions.osquery: ${PSAFE_DEFAULT_APP_CONFIG['extensions.osquery']}
#
${splitDescription(configEquivalences['extensions.docker'])}
# extensions.docker: ${PSAFE_DEFAULT_APP_CONFIG['extensions.docker']}
#
# ------------------------------- Timeout --------------------------------------
#
${splitDescription(configEquivalences.timeout)}
# timeout: ${PSAFE_DEFAULT_APP_CONFIG.timeout}
#
# --------------------------- Index pattern selector ---------------------------
#
${splitDescription(configEquivalences['ip.selector'])}
# ip.selector: ${PSAFE_DEFAULT_APP_CONFIG['ip.selector']}
#
${splitDescription(configEquivalences['ip.ignore'])}
# ip.ignore: ${PSAFE_DEFAULT_APP_CONFIG['ip.ignore']}
#
# ------------------------------ Monitoring ------------------------------------
#
${splitDescription(configEquivalences['psafe.monitoring.enabled'])}
# psafe.monitoring.enabled: ${PSAFE_MONITORING_DEFAULT_ENABLED}
#
${splitDescription(configEquivalences['psafe.monitoring.frequency'])}
# psafe.monitoring.frequency: ${PSAFE_MONITORING_DEFAULT_FREQUENCY}
#
${splitDescription(configEquivalences['psafe.monitoring.shards'])}
# psafe.monitoring.shards: ${PSAFE_MONITORING_DEFAULT_INDICES_SHARDS}
#
${splitDescription(configEquivalences['psafe.monitoring.replicas'])}
# psafe.monitoring.replicas: ${PSAFE_MONITORING_DEFAULT_INDICES_REPLICAS}
#
${splitDescription(configEquivalences['psafe.monitoring.creation'])}
# Allowed values are: h (hourly), d (daily), w (weekly), m (monthly)
# psafe.monitoring.creation: ${PSAFE_MONITORING_DEFAULT_CREATION}
#
${splitDescription(configEquivalences['psafe.monitoring.pattern'])}
# psafe.monitoring.pattern: ${PSAFE_MONITORING_PATTERN}
#
# --------------------------------- Sample data --------------------------------
#
${splitDescription(configEquivalences['alerts.sample.prefix'])}
# alerts.sample.prefix: ${PSAFE_SAMPLE_ALERT_PREFIX}
#
# ------------------------------ Background tasks ------------------------------
#
${splitDescription(configEquivalences['cron.prefix'])}
# cron.prefix: ${PSAFE_STATISTICS_DEFAULT_PREFIX}
#
# ------------------------------ Psafe Statistics ------------------------------
#
${splitDescription(configEquivalences['cron.statistics.status'])}
# cron.statistics.status: ${PSAFE_STATISTICS_DEFAULT_STATUS}
#
${splitDescription(configEquivalences['cron.statistics.apis'])}
# cron.statistics.apis: ${PSAFE_DEFAULT_APP_CONFIG['cron.statistics.apis']}
#
${splitDescription(configEquivalences['cron.statistics.interval'])}
# cron.statistics.interval: ${PSAFE_STATISTICS_DEFAULT_CRON_FREQ}
#
${splitDescription(configEquivalences['cron.statistics.index.name'])}
# cron.statistics.index.name: ${PSAFE_STATISTICS_DEFAULT_NAME}
#
${splitDescription(configEquivalences['cron.statistics.index.creation'])}
# cron.statistics.index.creation: ${PSAFE_STATISTICS_DEFAULT_CREATION}
#
${splitDescription(configEquivalences['cron.statistics.index.shards'])}
# cron.statistics.shards: ${PSAFE_STATISTICS_DEFAULT_INDICES_SHARDS}
#
${splitDescription(configEquivalences['cron.statistics.index.replicas'])}
# cron.statistics.replicas: ${PSAFE_STATISTICS_DEFAULT_INDICES_REPLICAS}
#
# ------------------------------ Logo customization ----------------------------
#
${splitDescription(configEquivalences['customization.logo.app'])}
# customization.logo.app: ${PSAFE_DEFAULT_APP_CONFIG['customization.logo.app']}
#
${splitDescription(configEquivalences['customization.logo.sidebar'])}
# customization.logo.sidebar: ${PSAFE_DEFAULT_APP_CONFIG['customization.logo.sidebar']}
#
${splitDescription(configEquivalences['customization.logo.healthcheck'])}
# customization.logo.healthcheck: ${PSAFE_DEFAULT_APP_CONFIG['customization.logo.healthcheck']}
#
${splitDescription(configEquivalences['customization.logo.reports'])}
# customization.logo.reports: ${PSAFE_DEFAULT_APP_CONFIG['customization.logo.reports']}
#
# ---------------------------- Hide manager alerts -----------------------------
#
${splitDescription(configEquivalences.hideManagerAlerts)}
# hideManagerAlerts: ${PSAFE_DEFAULT_APP_CONFIG.hideManagerAlerts}
#
# ------------------------------- App logging level ----------------------------
#
${splitDescription(configEquivalences['logs.level'])}
# Allowed values are: info, debug
# logs.level: ${PSAFE_DEFAULT_APP_CONFIG['logs.level']}
#
# ------------------------------- Agent enrollment -----------------------------
#
${splitDescription(configEquivalences['enrollment.dns'])}
# enrollment.dns: ${PSAFE_DEFAULT_APP_CONFIG['enrollment.dns']}
#
${splitDescription(configEquivalences['enrollment.password'])}
# enrollment.password: ${PSAFE_DEFAULT_APP_CONFIG['enrollment.password']}
#
#-------------------------------- Psafe hosts ----------------------------------
#
# The following configuration is the default structure to define a host.
#
# hosts:
#   # Host ID / name,
#   - env-1:
#       # Host URL
#       url: https://env-1.example
#       # Host / API port
#       port: 55000
#       # Host / API username
#       username: psafe-wui
#       # Host / API password
#       password: psafe-wui
#       # Use RBAC or not. If set to true, the username must be "psafe-wui".
#       run_as: true
#   - env-2:
#       url: https://env-2.example
#       port: 55000
#       username: psafe-wui
#       password: psafe-wui
#       run_as: true

hosts:
  - default:
      url: https://localhost
      port: 55000
      username: psafe-wui
      password: psafe-wui
      run_as: false
`;
