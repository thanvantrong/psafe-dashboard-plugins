/*
 * Psafe app - React component for building Remoted dashboard
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

export function PaStatisticsRemoted({clusterNodeSelected,  refreshVisualizations}) {
  useBuildStatisticsVisualizations(clusterNodeSelected, refreshVisualizations);
  return (
    <div>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>Total number of bytes received</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <PaReduxProvider>
                    <KibanaVis
                      visID={
                        "Psafe-App-Statistics-remoted-Recv-bytes"
                      }
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
              <EuiFlexItem>Events sent to Analysisd</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <PaReduxProvider>
                    <KibanaVis
                      visID={
                        "Psafe-App-Statistics-remoted-event-count"
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
              <EuiFlexItem>Messages statistics</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <PaReduxProvider>
                    <KibanaVis
                      visID={
                        "Psafe-App-Statistics-remoted-messages"
                      }
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
              <EuiFlexItem>TCP sessions</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <PaReduxProvider>
                    <KibanaVis
                      visID={
                        "Psafe-App-Statistics-remoted-tcp-sessions"
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
    </div>
  );
}
