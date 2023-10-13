/*
 * Psafe app - React component for building Analysisd dashboard
 *
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import React from "react";
import PaReduxProvider from "../../../../../redux/pa-redux-provider";
import KibanaVis from "../../../../../kibana-integrations/kibana-vis";
import { EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";
import { useBuildStatisticsVisualizations } from './hooks';


export function PaStatisticsAnalysisd({clusterNodeSelected, refreshVisualizations}) {
  useBuildStatisticsVisualizations(clusterNodeSelected, refreshVisualizations);
  
  return (
    <div>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>Events processed</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <PaReduxProvider>
                    <KibanaVis
                      visID={"Psafe-App-Statistics-Analysisd-Events-By-Node"}
                      tab={"statistics"}
                    ></KibanaVis>
                  </PaReduxProvider>
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>Events Dropped</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <PaReduxProvider>
                    <KibanaVis
                      visID={
                        "Psafe-App-Statistics-Analysisd-Events-Dropped-By-Node"
                      }
                      tab={"statistics"}
                    ></KibanaVis>
                  </PaReduxProvider>
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>Queue Usage</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <PaReduxProvider>
                    <KibanaVis
                      visID={
                        "Psafe-App-Statistics-Analysisd-Queues-Usage"
                      }
                      tab={"statistics"}
                    ></KibanaVis>
                  </PaReduxProvider>
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>Events Decoded summary</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <PaReduxProvider>
                    <KibanaVis
                      visID={
                        "Psafe-App-Statistics-Analysisd-Overview-Events-Decoded"
                      }
                      tab={"statistics"}
                    ></KibanaVis>
                  </PaReduxProvider>
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>Syscheck</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <PaReduxProvider>
                    <KibanaVis
                      visID={"Psafe-App-Statistics-Analysisd-Syscheck"}
                      tab={"statistics"}
                    ></KibanaVis>
                  </PaReduxProvider>
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>Syscollector</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <PaReduxProvider>
                    <KibanaVis
                      visID={"Psafe-App-Statistics-Analysisd-Syscollector"}
                      tab={"statistics"}
                    ></KibanaVis>
                  </PaReduxProvider>
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>Rootcheck</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <PaReduxProvider>
                    <KibanaVis
                      visID={"Psafe-App-Statistics-Analysisd-Rootcheck"}
                      tab={"statistics"}
                    ></KibanaVis>
                  </PaReduxProvider>
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>SCA</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <PaReduxProvider>
                    <KibanaVis
                      visID={"Psafe-App-Statistics-Analysisd-SCA"}
                      tab={"statistics"}
                    ></KibanaVis>
                  </PaReduxProvider>
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>Host Info</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <PaReduxProvider>
                    <KibanaVis
                      visID={"Psafe-App-Statistics-Analysisd-HostInfo"}
                      tab={"statistics"}
                    ></KibanaVis>
                  </PaReduxProvider>
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>Other</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <PaReduxProvider>
                    <KibanaVis
                      visID={"Psafe-App-Statistics-Analysisd-Other"}
                      tab={"statistics"}
                    ></KibanaVis>
                  </PaReduxProvider>
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
}
