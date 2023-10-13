# Psafe Kibana App

[![Slack](https://img.shields.io/badge/slack-join-blue.svg)](https://psafe.com/community/join-us-on-slack/)
[![Email](https://img.shields.io/badge/email-join-blue.svg)](https://groups.google.com/forum/#!forum/psafe)
[![Documentation](https://img.shields.io/badge/docs-view-green.svg)](https://documentation.psafe.com)
[![Documentation](https://img.shields.io/badge/web-view-green.svg)](https://psafe.com)

This repository contains the Psafe Kibana plugin, from which you can navigate through the Psafe data using visualizations in a simple and understandable way. It also allows you to manage the configuration and capabilities of the Psafe server.

Psafe is a security detection, visibility, and compliance open source project. Psafe helps you to gain deeper security visibility into your infrastructure by monitoring hosts at an operating system and application level.

You can learn more about it here [psafe.com](https://psafe.com/)

## Description

This plugin for Kibana allows you to visualize and analyze Psafe alerts stored in Elasticsearch and provides the following capabilities:

- Search alerts classified by modules and filter them using the different views. You will be able to explore the alerts both at Psafe cluster level, and in a particular agent. The modules, divided into the following use cases, are:
    - Security Information Management
        - Security events: Browse through your security alerts, identifying issues and threats in your environment.
        - Integrity monitoring: Alerts related to file changes, including permissions, content, ownership and attributes.
        - Amazon AWS: Security events related to your Amazon AWS services, collected directly via AWS API.
        - Office 365: Security events related to your Office 365 services.
        - GitHub: Security events related to your GitHub organizations, collected via GitHub audit logs API.
        - Google Cloud Platform: Security events related to your Google Cloud Platform services, collected directly via GCP API.
    - Auditing and Policy Monitoring
        - Policy monitoring: Verify that your systems are configured according to your security policies baseline.
        - Security configuration assessment: Scan your assets as part of a configuration assessment audit.
        - System auditing: Audit users behavior, monitoring command execution and alerting on access to critical files.
        - OpenSCAP: Configuration assessment and automation of compliance monitoring using SCAP checks.
        - CIS-CAT: Configuration assessment using Center of Internet Security scanner and SCAP checks.
    - Threat Detection and Response
        - Vulnerabilities: Discover what applications in your environment are affected by well-known vulnerabilities.
        - MITRE ATT&CK: Security events from the knowledge base of adversary tactics and techniques based on real-world observations.
        - VirusTotal: Alerts resulting from VirusTotal analysis of suspicious files via an integration with their API.
        - Osquery: Osquery can be used to expose an operating system as a high-performance relational database.
        - Docker listener: Monitor and collect the activity from Docker containers such as creation, running, starting, stopping or pausing events.
    - Regulatory Compliance
        - PCI DSS: Global security standard for entities that process, store or transmit payment cardholder data.
        - NIST 800-53: National Institute of Standards and Technology Special Publication 800-53 (NIST 800-53) sets guidelines for federal information systems.
        - GDPR: General Data Protection Regulation (GDPR) sets guidelines for processing of personal data.
        - HIPAA: Health Insurance Portability and Accountability Act of 1996 (HIPAA) provides data privacy and security provisions for safeguarding medical information.
        - TSC: Trust Services Criteria for Security, Availability, Processing Integrity, Confidentiality, and Privacy.
- View and edit the Psafe manager configuration.
- Manage your ruleset (rules, decoders and CDB lists).
- Manage your groups of agents.
- Check the status and logs of your Psafe cluster.
- Manage your agents, as well as see their configuration and data inventory. You can also deploy new agents.
- Explore and interact with the Psafe API through our Dev Tools.

## Documentation

- [Full documentation](https://documentation.psafe.com)
- [Psafe installation guide](https://documentation.psafe.com/current/installation-guide/index.html)
- [Screenshots](https://documentation.psafe.com/current/index.html#example-screenshots)

**Modules overview**

![Overview](screenshots/app.png)

**Security events**

![Overview](screenshots/app2.png)

**Integrity monitoring**

![Overview](screenshots/app3.png)

**Vulnerability detection**

![Overview](screenshots/app4.png)

**Regulatory compliance**

![Overview](screenshots/app5.png)

**Agents overview**

![Overview](screenshots/app6.png)

**Agent summary**

![Overview](screenshots/app7.png)

## Branches

- `stable` corresponds to the latest Psafe app stable version.
- `master` branch contains the latest code, be aware of possible bugs on this branch.

## Requisites

- Psafe HIDS 4.3.10
- Kibana 7.17.6
- Elasticsearch 7.17.6

## Installation

Ensure that the directory `/usr/share/kibana/data` exists
If not create it:

```
mkdir /usr/share/kibana/data
chown -R kibana:kibana /usr/share/kibana/data
```

Install the Psafe app plugin for Kibana

```
cd /usr/share/kibana
sudo -u kibana bin/kibana-plugin install https://packages.psafe.com/4.x/ui/kibana/psafe_kibana-4.3.10_7.17.6-1.zip
```

Restart Kibana

- Systemd:

```
systemctl restart kibana
```

- SysV Init:

```
service kibana restart
```

## Upgrade

Note: Since Psafe 4.0.4 release revision 4016 (regardless of the Elastic Stack version) the location of the psafe.yml has been moved from `/usr/share/kibana/optimize/psafe/config/psafe.yml` to `/usr/share/kibana/data/psafe/config/psafe.yml`.

Since Psafe 3.12.0 release (regardless of the Elastic Stack version) the location of the psafe.yml has been moved from `/usr/share/kibana/plugins/psafe/psafe.yml` to `/usr/share/kibana/data/psafe/config/psafe.yml`.

Stop Kibana

- Systemd:

```
systemctl stop kibana
```

- SysV Init:

```
service kibana stop
```
Ensure that the directory `/usr/share/kibana/data` exists
If not create it:

```
mkdir /usr/share/kibana/data
```

### From 3.11.x
Copy the `psafe.yml` to its new location.

```
mkdir -p /usr/share/kibana/data/psafe/config
cp /usr/share/kibana/plugins/psafe/psafe.yml /usr/share/kibana/optimize/psafe/config/psafe.yml
```
### From 4.0.4 - 4016
Copy the `psafe.yml` to its new location.

```
mkdir -p /usr/share/kibana/data/psafe/config
cp /usr/share/kibana/optimize/psafe/config/psafe.yml /usr/share/kibana/data/psafe/config/psafe.yml
```

```
mkdir -p /usr/share/kibana/data/psafe/config
cp /usr/share/kibana/optimize/psafe/config/psafe.yml /usr/share/kibana/data/psafe/config/psafe.yml
```

Remove the Psafe app using the kibana-plugin tool

```
cd /usr/share/kibana/
sudo -u kibana bin/kibana-plugin remove psafe
```

Remove generated bundles

```
rm -rf /usr/share/kibana/optimize/bundles
```

Update file permissions. This will prevent errors when generating new bundles or updating the app:

```
chown -R kibana:kibana /usr/share/kibana/data
chown -R kibana:kibana /usr/share/kibana/plugins
```

Install the Psafe app

```
cd /usr/share/kibana/
sudo -u kibana bin/kibana-plugin install https://packages.psafe.com/4.x/ui/kibana/psafe_kibana-4.3.10_7.17.6-1.zip
```

Update configuration file permissions.

```
sudo chown kibana:kibana /usr/share/kibana/data/psafe/config/psafe.yml
sudo chmod 600 /usr/share/kibana/data/psafe/config/psafe.yml
```

Restart Kibana

- Systemd:

```
systemctl restart kibana
```
 
- SysV Init: 
 
``` 
service kibana restart 
```

 
## Psafe - Kibana - Open Distro version compatibility matrix

The compatibility matrix is avaliable in the repository [wiki](https://github.com/psafe/psafe-kibana-app/wiki/Compatibility).

## Contribute

If you want to contribute to our project please don't hesitate to send a pull request. You can also join our users [mailing list](https://groups.google.com/d/forum/psafe), by sending an email to [psafe+subscribe@googlegroups.com](mailto:psafe+subscribe@googlegroups.com), to ask questions and participate in discussions.

## Software and libraries used

- [Elastic](https://elastic.co)
- [Elastic UI framework](https://elastic.github.io/eui)
- [AngularJS](https://angularjs.org)
- [AngularJS Material](https://material.angularjs.org)
- [Node.js](https://nodejs.org)
- [NPM](https://npmjs.com)
- [React](https://reactjs.org)
- [Redux](https://redux.js.org)

## Copyright & License

Copyright &copy; 2022 Psafe, Inc.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.

Find more information about this on the [LICENSE](LICENSE) file.
