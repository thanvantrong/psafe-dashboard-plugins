/*
 * Psafe app - React component for registering agents.
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import React, { Component } from 'react';
// Redux
import store from '../../../../../redux/store';
import PaReduxProvider from '../../../../../redux/pa-redux-provider';
//Psafe ruleset tables(rules, decoder, lists)
import PaRulesetOverview from './ruleset-overview';
//Information about rule or decoder
import PaRuleInfo from './rule-info';
import PaDecoderInfo from './decoder-info';
import PaRulesetEditor from './ruleset-editor';
import PaListEditor from './list-editor';

export default class PaRuleset extends Component {
  _isMount = false;
  constructor(props) {
    super(props);
    this.state = {}; //Init state empty to avoid fails when try to read any parameter and this.state is not defined yet
    this.store = store;
  }

  UNSAFE_componentWillMount() {
    this._isMount = true;
    this.store.subscribe(() => {
      const state = this.store.getState().rulesetReducers;
      if (this._isMount) {
        this.setState(state);
        this.setState({ selectedTabId: state.section });
      }
    });
  }

  componentWillUnmount() {
    this._isMount = false;
    // When the component is going to be unmounted the ruleset state is reset
    const { ruleInfo, decoderInfo, listInfo, fileContent, addingRulesetFile } = this.state;
    if (
      !window.location.href.includes('rules?tab=rules') &&
      (!ruleInfo && !decoderInfo && !listInfo && !fileContent, !addingRulesetFile)
    ) {
      this.store.dispatch({ type: 'RESET' });
    }
  }

  render() {
    const { ruleInfo, decoderInfo, listInfo, fileContent, addingRulesetFile } = this.state;

    return (
      <PaReduxProvider>
        {(ruleInfo && <PaRuleInfo />) ||
          (decoderInfo && <PaDecoderInfo />) ||
          (listInfo && <PaListEditor clusterStatus={this.props.clusterStatus} />) ||
          ((fileContent || addingRulesetFile) && (
            <PaRulesetEditor
              logtestProps={this.props.logtestProps}
              clusterStatus={this.props.clusterStatus}
            />
          )) || <PaRulesetOverview clusterStatus={this.props.clusterStatus} />}
      </PaReduxProvider>
    );
  }
}
