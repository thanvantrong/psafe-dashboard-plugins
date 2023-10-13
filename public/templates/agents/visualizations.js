/*
 * Psafe app - Tab name equivalence
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

export const visualizations = {
  general: {
    rows: [
      {
        height: 400,
        vis: [
          {
            title: 'Alert groups evolution',
            id: 'Psafe-App-Agents-General-Alert-groups-evolution',
            width: 50
          },
          { title: 'Alerts', id: 'Psafe-App-Agents-General-Alerts', width: 50 }
        ]
      },
      {
        height: 300,
        vis: [
          {
            title: 'Top 5 agents',
            id: 'Psafe-App-Agents-General-Top-5-alerts',
            width: 33
          },
          {
            title: 'Top 5 rule groups',
            id: 'Psafe-App-Agents-General-Top-10-groups',
            width: 33
          },
          {
            title: 'Top 5 PCI DSS Requirements',
            id: 'Psafe-App-Agents-General-Top-5-PCI-DSS-Requirements',
            width: 33
          }
        ]
      },
      {
        hide: true,
        vis: [
          {
            title: 'Alerts summary',
            id: 'Psafe-App-Agents-General-Alerts-summary',
            width: 60
          },
          {
            title: 'Groups summary',
            id: 'Psafe-App-Agents-General-Groups-summary',
            width: 40
          }
        ]
      }
    ]
  },
  fim: {
    rows: [
      {
        height: 300,
        vis: [
          {
            title: 'Most active users',
            id: 'Psafe-App-Agents-FIM-Users',
            width: 30
          },
          {
            title: 'Actions',
            id: 'Psafe-App-Agents-FIM-Actions',
            width: 30
          },
          {
            title: 'Events',
            id: 'Psafe-App-Agents-FIM-Events',
            width: 40
          }
        ]
      },
      {
        height: 230,
        vis: [
          {
            title: 'Files added',
            id: 'Psafe-App-Agents-FIM-Files-added',
            width: 33
          },
          {
            title: 'Files modified',
            id: 'Psafe-App-Agents-FIM-Files-modified',
            width: 33
          },
          {
            title: 'Files deleted',
            id: 'Psafe-App-Agents-FIM-Files-deleted',
            width: 33
          }
        ]
      },
      {
        hide: true,
        vis: [
          {
            title: 'Alerts summary',
            id: 'Psafe-App-Agents-FIM-Alerts-summary'
          }
        ]
      }
    ]
  },
  pci: {
    rows: [
      {
        height: 300,
        vis: [
          {
            title: 'Top 5 rule groups',
            id: 'Psafe-App-Agents-PCI-Groups',
            width: 33
          },
          {
            title: 'Top 5 rules',
            id: 'Psafe-App-Agents-PCI-Rule',
            width: 33
          },
          {
            title: 'Top 5 PCI DSS requirements',
            id: 'Psafe-App-Agents-PCI-Requirement',
            width: 33
          }
        ]
      },
      {
        height: 300,
        vis: [
          {
            title: 'PCI Requirements',
            id: 'Psafe-App-Agents-PCI-Requirements',
            width: 70
          },
          {
            title: 'Rule level distribution',
            id: 'Psafe-App-Agents-PCI-Rule-level-distribution',
            width: 30
          }
        ]
      },
      {
        hide: true,
        vis: [
          {
            title: 'Alerts summary',
            id: 'Psafe-App-Agents-PCI-Last-alerts'
          }
        ]
      }
    ]
  },
  gdpr: {
    rows: [
      {
        height: 300,
        vis: [
          {
            title: 'Top 5 rule groups',
            id: 'Psafe-App-Agents-GDPR-Groups',
            width: 33
          },
          {
            title: 'Top 5 rules',
            id: 'Psafe-App-Agents-GDPR-Rule',
            width: 33
          },
          {
            title: 'Top 5 GDPR requirements',
            id: 'Psafe-App-Agents-GDPR-Requirement',
            width: 33
          }
        ]
      },
      {
        height: 300,
        vis: [
          {
            title: 'GDPR Requirements',
            id: 'Psafe-App-Agents-GDPR-Requirements',
            width: 70
          },
          {
            title: 'Rule level distribution',
            id: 'Psafe-App-Agents-GDPR-Rule-level-distribution',
            width: 30
          }
        ]
      },
      {
        hide: true,
        vis: [
          {
            title: 'Alerts summary',
            id: 'Psafe-App-Agents-GDPR-Last-alerts'
          }
        ]
      }
    ]
  },
  nist: {
    rows: [
      {
        height: 300,
        vis: [
          {
            title: 'Stats',
            id: 'Psafe-App-Agents-NIST-Stats',
            width: 25
          },
          {
            title: 'Top 10 requirements',
            id: 'Psafe-App-Agents-NIST-top-10-requirements',
            width: 25
          },
          {
            title: 'Requirements distributed by level',
            id: 'Psafe-App-Agents-NIST-Requirement-by-level',
            width: 50
          }
        ]
      },
      {
        height: 300,
        vis: [
          {
            title: 'Requirements over time',
            id: 'Psafe-App-Agents-NIST-Requirements-stacked-overtime'
          }
        ]
      },
      {
        hide: true,
        vis: [
          {
            title: 'Alerts summary',
            id: 'Psafe-App-Agents-NIST-Last-alerts'
          }
        ]
      }
    ]
  },
  tsc: {
    rows: [
      {
        height: 400,
        vis: [
          {
            title: 'TSC requirements',
            id: 'Psafe-App-Overview-TSC-requirements',
            width: 50
          },
          {
            title: 'Top 10 agents by alerts number',
            id: 'Psafe-App-Overview-TSC-Agents',
            width: 50
          }
        ]
      },
      {
        height: 300,
        vis: [
          {
            title: 'Top requirements over time',
            id: 'Psafe-App-Overview-TSC-Requirements-over-time'
          }
        ]
      },
      {
        height: 530,
        vis: [
          {
            title: 'Last alerts',
            id: 'Psafe-App-Overview-TSC-Requirements-Agents-heatmap'
          }
        ]
      },
      {
        height: 255,
        vis: [
          {
            title: 'Requirements by agent',
            id: 'Psafe-App-Overview-TSC-Requirements-by-agent'
          }
        ]
      },
      {
        hide: true,
        vis: [
          {
            title: 'Alerts summary',
            id: 'Psafe-App-Overview-TSC-Alerts-summary'
          }
        ]
      }
    ]
  },
  hipaa: {
    rows: [
      {
        height: 300,
        vis: [
          {
            title: 'Requirements over time',
            id: 'Psafe-App-Agents-HIPAA-Requirements-Stacked-Overtime',
            width: 50
          },
          {
            title: 'Top 10 requirements',
            id: 'Psafe-App-Agents-HIPAA-top-10',
            width: 50
          }
        ]
      },
      {
        height: 300,
        vis: [
          {
            title: 'HIPAA requirements',
            id: 'Psafe-App-Agents-HIPAA-Burbles',
            width: 45
          },
          {
            title: 'Requirements distribution by level',
            id: 'Psafe-App-Agents-HIPAA-Distributed-By-Level',
            width: 30
          },
          {
            title: 'Most common alerts',
            id: 'Psafe-App-Agents-HIPAA-Most-Common',
            width: 25
          }
        ]
      },
      {
        hide: true,
        vis: [
          {
            title: 'Alerts summary',
            id: 'Psafe-App-Agents-HIPAA-Last-alerts'
          }
        ]
      }
    ]
  },
  virustotal: {
    rows: [
      {
        height: 250,
        vis: [
          {
            title: 'Last scanned files',
            id: 'Psafe-App-Agents-Virustotal-Last-Files-Pie',
            width: 33
          },
          {
            title: 'Malicious files alerts Evolution',
            id: 'Psafe-App-Agents-Virustotal-Malicious-Evolution',
            width: 67
          }
        ]
      },
      {
        height: 570,
        vis: [
          {
            title: 'Last files',
            id: 'Psafe-App-Agents-Virustotal-Files-Table'
          }
        ]
      },
      {
        hide: true,
        vis: [
          {
            title: 'Alerts summary',
            id: 'Psafe-App-Agents-Virustotal-Alerts-summary'
          }
        ]
      }
    ]
  },
  osquery: {
    rows: [
      {
        height: 300,
        vis: [
          {
            title: 'Most common Osquery actions',
            id: 'Psafe-App-Agents-Osquery-most-common-osquery-actions',
            width: 30
          },
          {
            title: 'Evolution of Osquery events per pack over time',
            id: 'Psafe-App-Agents-Osquery-Evolution',
            width: 70
          }
        ]
      },
      {
        height: 300,
        vis: [
          {
            title: 'Most common Osquery packs being used',
            id: 'Psafe-App-Agents-Osquery-top-5-packs-being-used',
            width: 30
          },
          {
            title: 'Most common rules',
            id: 'Psafe-App-Agents-Osquery-monst-common-rules-being-fired',
            width: 70
          }
        ]
      },
      {
        hide: true,
        vis: [
          {
            title: 'Alerts summary',
            id: 'Psafe-App-Overview-Osquery-Alerts-summary'
          }
        ]
      }
    ]
  },
  docker: {
    rows: [
      {
        height: 300,
        vis: [
          {
            title: 'Top 5 images',
            id: 'Psafe-App-Agents-Docker-top-5-images',
            width: 25
          },
          {
            title: 'Top 5 events',
            id: 'Psafe-App-Agents-Docker-top-5-actions',
            width: 25
          },
          {
            title: 'Resources usage over time',
            id: 'Psafe-App-Agents-Docker-Types-over-time',
            width: 50
          }
        ]
      },
      {
        height: 300,
        vis: [
          {
            title: 'Events occurred evolution',
            id: 'Psafe-App-Agents-Docker-Actions-over-time'
          }
        ]
      },
      {
        hide: true,
        vis: [
          {
            title: 'Alerts summary',
            id: 'Psafe-App-Agents-Docker-Events-summary'
          }
        ]
      }
    ]
  },
  oscap: {
    rows: [
      {
        height: 230,
        vis: [
          {
            title: 'Top 5 Scans',
            id: 'Psafe-App-Agents-OSCAP-Scans',
            width: 25
          },
          {
            title: 'Top 5 Profiles',
            id: 'Psafe-App-Agents-OSCAP-Profiles',
            width: 25
          },
          {
            title: 'Top 5 Content',
            id: 'Psafe-App-Agents-OSCAP-Content',
            width: 25
          },
          {
            title: 'Top 5 Severity',
            id: 'Psafe-App-Agents-OSCAP-Severity',
            width: 25
          }
        ]
      },
      {
        height: 230,
        vis: [
          {
            title: 'Daily scans evolution',
            id: 'Psafe-App-Agents-OSCAP-Daily-scans-evolution'
          }
        ]
      },
      {
        height: 250,
        vis: [
          {
            title: 'Top 5 - Alerts',
            id: 'Psafe-App-Agents-OSCAP-Top-5-Alerts',
            width: 50
          },
          {
            title: 'Top 5 - High risk alerts',
            id: 'Psafe-App-Agents-OSCAP-Top-5-High-risk-alerts',
            width: 50
          }
        ]
      },
      {
        hide: true,
        vis: [
          {
            title: 'Alerts summary',
            id: 'Psafe-App-Agents-OSCAP-Last-alerts'
          }
        ]
      }
    ]
  },
  ciscat: {
    rows: [
      {
        height: 320,
        vis: [
          {
            title: 'Top 5 CIS-CAT groups',
            id: 'Psafe-app-Agents-CISCAT-top-5-groups',
            width: 60
          },
          {
            title: 'Scan result evolution',
            id: 'Psafe-app-Agents-CISCAT-scan-result-evolution',
            width: 40
          }
        ]
      },
      {
        hide: true,
        vis: [
          {
            title: 'Alerts summary',
            id: 'Psafe-app-Agents-CISCAT-alerts-summary'
          }
        ]
      }
    ]
  },
  pm: {
    rows: [
      {
        height: 290,
        vis: [
          {
            title: 'Alerts over time',
            id: 'Psafe-App-Agents-PM-Events-over-time',
            width: 50
          },
          {
            title: 'Rule distribution',
            id: 'Psafe-App-Agents-PM-Top-5-rules',
            width: 50
          }
        ]
      },
      {
        height: 240,
        vis: [
          {
            title: 'Events per control type evolution',
            id: 'Psafe-App-Agents-PM-Events-per-agent-evolution'
          }
        ]
      },
      {
        hide: true,
        vis: [
          {
            title: 'Alerts summary',
            id: 'Psafe-App-Agents-PM-Alerts-summary'
          }
        ]
      }
    ]
  },
  audit: {
    rows: [
      {
        height: 250,
        vis: [
          {
            title: 'Groups',
            id: 'Psafe-App-Agents-Audit-Groups',
            width: 33
          },
          {
            title: 'Commands',
            id: 'Psafe-App-Agents-Audit-Commands',
            width: 33
          },
          {
            title: 'Files',
            id: 'Psafe-App-Agents-Audit-Files',
            width: 33
          }
        ]
      },
      {
        height: 310,
        vis: [
          {
            title: 'Alerts over time',
            id: 'Psafe-App-Agents-Audit-Alerts-over-time'
          }
        ]
      },
      {
        hide: true,
        vis: [
          {
            title: 'Alerts summary',
            id: 'Psafe-App-Agents-Audit-Last-alerts'
          }
        ]
      }
    ]
  }
};
