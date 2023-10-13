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
import { connect } from 'react-redux';

import {
  updateFilters,
  updateIsProcessing
} from '../../../../../redux/actions/rulesetActions';
import { PaRequest } from '../../../../../react-services/pa-request';
import { PaSearchBar } from '../../../../../components/pa-search-bar';

class PaRulesetSearchBar extends Component {
  constructor(props) {
    super(props);
  }

  rulesItems = [
    {
      type: 'params',
      label: 'status',
      description: 'Filters the rules by status.',
      values: ['enabled', 'disabled']
    },
    {
      type: 'params',
      label: 'group',
      description: 'Filters the rules by group',
      values: async value => {
        const filter = { limit: 30 };
        if (value) {
          filter['search'] = value;
        }
        const paReq = (...args) => PaRequest.apiReq(...args);
        const result = await paReq('GET', '/rules/groups', filter);
        return (((result || {}).data || {}).data || {}).affected_items;
      },
    },
    {
      type: 'params',
      label: 'level',
      description: 'Filters the rules by level',
      values: [...Array(16).keys()]
    },
    {
      type: 'params',
      label: 'filename',
      description: 'Filters the rules by file name.',
      values: async value => {
        const filter = { limit: 30 };
        if (value) {
          filter['search'] = value;
        }
        const paReq = (...args) => PaRequest.apiReq(...args);
        const result = await paReq('GET', '/rules/files', filter);
        return (((result || {}).data || {}).data || {}).affected_items.map((item) => {return item.filename});
      },
    },
    {
      type: 'params',
      label: 'relative_dirname',
      description: 'Path of the rules files',
      values: async value => {
        const paReq = (...args) => PaRequest.apiReq(...args);
        const result = await paReq('GET', '/manager/configuration', {params: {
          section: 'ruleset',
          field: 'rule_dir'
        }});
        return (((result || {}).data || {}).data || {}).affected_items[0].ruleset.rule_dir;
      }
    },
    {
      type: 'params',
      label: 'hipaa',
      description: 'Filters the rules by HIPAA requirement',
      values: async () => {
        const paReq = (...args) => PaRequest.apiReq(...args);
        const result = await paReq('GET', '/rules/requirement/hipaa', {});
        return (((result || {}).data || {}).data || {}).affected_items;
      }
    },
    {
      type: 'params',
      label: 'gdpr',
      description: 'Filters the rules by GDPR requirement',
      values: async () => {
        const paReq = (...args) => PaRequest.apiReq(...args);
        const result = await paReq('GET', '/rules/requirement/gdpr', {});
        return (((result || {}).data || {}).data || {}).affected_items;
      }
    },
    {
      type: 'params',
      label: 'nist-800-53',
      description: 'Filters the rules by NIST requirement',
      values: async () => {
        const paReq = (...args) => PaRequest.apiReq(...args);
        const result = await paReq('GET', '/rules/requirement/nist-800-53', {});
        return (((result || {}).data || {}).data || {}).affected_items;
      }
    },
    {
      type: 'params',
      label: 'gpg13',
      description: 'Filters the rules by GPG requirement',
      values: async () => {
        const paReq = (...args) => PaRequest.apiReq(...args);
        const result = await paReq('GET', '/rules/requirement/gpg13', {});
        return (((result || {}).data || {}).data || {}).affected_items;
      }
    },
    {
      type: 'params',
      label: 'pci_dss',
      description: 'Filters the rules by PCI DSS requirement',
      values: async () => {
        const paReq = (...args) => PaRequest.apiReq(...args);
        const result = await paReq('GET', '/rules/requirement/pci_dss', {});
        return (((result || {}).data || {}).data || {}).affected_items;
      }
    },
    {
      type: 'params',
      label: 'tsc',
      description: 'Filters the rules by TSC requirement',
      values: async () => {
        const paReq = (...args) => PaRequest.apiReq(...args);
        const result = await paReq('GET', '/rules/requirement/tsc', {});
        return (((result || {}).data || {}).data || {}).affected_items;
      }
    },
    {
      type: 'params',
      label: 'mitre',
      description: 'Filters the rules by MITRE requirement',
      values: async () => {
        const result = await PaRequest.apiReq('GET', '/rules/requirement/mitre', {});
        return (((result || {}).data || {}).data || {}).affected_items;
      }
    }
  ];
  rulesFiles = [
    {
      type: 'params',
      label: 'filename',
      description: 'Filters the rules by file name.',
      values: async value => {
        const filter = { limit: 30 };
        if (value) {
          filter['search'] = value;
        }
        const paReq = (...args) => PaRequest.apiReq(...args);
        const result = await paReq('GET', '/rules/files', filter);
        return (((result || {}).data || {}).data || {}).affected_items.map((item) => {return item.filename});
      },
    },
  ];

  decodersItems = [
    {
      type: 'params',
      label: 'filename',
      description: 'Filters the decoders by file name.',
      values: async value => {
        const filter = { limit: 30 };
        if (value) {
          filter['search'] = value;
        }
        const paReq = (...args) => PaRequest.apiReq(...args);
        const result = await paReq('GET', '/decoders/files', filter);
        return (((result || {}).data || {}).data || {}).affected_items.map((item) => {return item.filename});
      },
    },
    {
      type: 'params',
      label: 'relative_dirname',
      description: 'Path of the decoders files.',
      values: async () => {
        const paReq = (...args) => PaRequest.apiReq(...args);
        const result = await paReq('GET', '/manager/configuration', {params: {
          section: 'ruleset',
          field: 'decoder_dir'
        }});
        return (((result || {}).data || {}).data || {}).affected_items[0].ruleset.decoder_dir;
      }
    },
    {
      type: 'params',
      label: 'status',
      description: 'Filters the decoders by status.',
      values: ['enabled', 'disabled']
    }
  ];

  apiSuggestsItems = {
    items: {
      rules: this.rulesItems,
      decoders: this.decodersItems,
      list: []
    },
    files: {
      rule: this.rulesFiles,
      decoders: [],
      list: []
    }
  };

  buttonOptions = {
    rules: [{label: "Custom rules", field:"relative_dirname", value:"etc/rules"}, ],
    decoders: [{label: "Custom decoders", field:"relative_dirname", value:"etc/decoders"}, ],
    list: []
  };

  render() {
    const { section, showingFiles, filters } = this.props.state;
    const type = showingFiles ? 'files' : 'items';
    const suggestions = this.apiSuggestsItems[type][section] || [];
    const buttonOptions = this.buttonOptions[section];
    return (
      <PaSearchBar
        noDeleteFiltersOnUpdateSuggests
        suggestions={suggestions}
        buttonOptions={buttonOptions}
        placeholder='Filter or search'
        filters={filters}
        onFiltersChange={this.props.updateFilters}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    state: state.rulesetReducers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateFilters: filters => dispatch(updateFilters(filters)),
    updateIsProcessing: state => dispatch(updateIsProcessing(state))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaRulesetSearchBar);
