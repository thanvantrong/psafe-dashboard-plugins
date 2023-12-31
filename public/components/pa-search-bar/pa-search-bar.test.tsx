import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IPaSuggestItem, PaSearchBar } from './pa-search-bar';
import { PA_SEARCH_BADGE_NAME } from './components/pa-search-badges/pa-search-badges';
import React from 'react';
import { CASES_SEARCHBAR } from './pa-search-bar.test-cases';

const getSuggestionsFilters = async (field, value, filters = {}) => {
  // here is returned filter to call api and get sugguestions
  return Promise.resolve([]);
};

const suggestions: IPaSuggestItem[] = [
  {
    type: 'q',
    label: 'os.platform',
    description: 'Filter by OS platform',
    operators: ['=', '!='],
    values: async (value) => getSuggestionsFilters('os.platform', value, { q: 'id!=000' }),
  },
  {
    type: 'q',
    label: 'ip',
    description: 'Filter by agent IP',
    operators: ['=', '!='],
    values: async (value) => getSuggestionsFilters('ip', value, { q: 'id!=000' }),
  },
  {
    type: 'q',
    label: 'name',
    description: 'Filter by agent name',
    operators: ['=', '!='],
    values: async (value) => getSuggestionsFilters('name', value, { q: 'id!=000' }),
  },
  {
    type: 'q',
    label: 'id',
    description: 'Filter by agent id',
    operators: ['=', '!='],
    values: async (value) => getSuggestionsFilters('id', value, { q: 'id!=000' }),
  },
  {
    type: 'q',
    label: 'group',
    description: 'Filter by agent group',
    operators: ['=', '!='],
    values: async (value) => getSuggestionsFilters('group', value, { q: 'id!=000' }),
  },
  {
    type: 'q',
    label: 'node_name',
    description: 'Filter by node name',
    operators: ['=', '!='],
    values: async (value) => getSuggestionsFilters('node_name', value, { q: 'id!=000' }),
  },
  {
    type: 'q',
    label: 'manager',
    description: 'Filter by manager',
    operators: ['=', '!='],
    values: async (value) => getSuggestionsFilters('manager', value, { q: 'id!=000' }),
  },
  {
    type: 'q',
    label: 'version',
    description: 'Filter by agent version',
    operators: ['=', '!='],
    values: async (value) => getSuggestionsFilters('version', value, { q: 'id!=000' }),
  },
  {
    type: 'q',
    label: 'configSum',
    description: 'Filter by agent config sum',
    operators: ['=', '!='],
    values: async (value) => getSuggestionsFilters('configSum', value, { q: 'id!=000' }),
  },
  {
    type: 'q',
    label: 'mergedSum',
    description: 'Filter by agent merged sum',
    operators: ['=', '!='],
    values: async (value) => getSuggestionsFilters('mergedSum', value, { q: 'id!=000' }),
  },
  {
    type: 'q',
    label: 'dateAdd',
    description: 'Filter by add date',
    operators: ['=', '!='],
    values: async (value) => getSuggestionsFilters('dateAdd', value, { q: 'id!=000' }),
  },
  {
    type: 'q',
    label: 'lastKeepAlive',
    description: 'Filter by last keep alive',
    operators: ['=', '!='],
    values: async (value) => getSuggestionsFilters('lastKeepAlive', value, { q: 'id!=000' }),
  },
];

/**
 * Mocked Component with inner search bar, used for have react state and props
 */
class ComponentWithPaSearchBar extends React.Component<{}, { filters: any[] }> {
  suggestions = suggestions;
  constructor(props) {
    super(props);
    this.state = {
      filters: [],
    };
  }

  onFilterChanges(filters) {
    this.setState({ filters });
  }

  render() {
    return (
      <PaSearchBar
        filters={this.state.filters}
        onFiltersChange={(filters) => this.onFilterChanges(filters)}
        suggestions={suggestions}
      />
    );
  }
}

describe('PaSearchBar', () => {
  /** This mock is for hide add act method warning that is launched on every component event  */
  const originalError = console.error;

  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  describe('Valid cases', () => {
    it.each(CASES_SEARCHBAR)(
      'should take query inputs "%j" and create search badges when queries are VALID/COMPLETE',
      (inputs) => {
        const spyReactConsoleError = jest.spyOn(console, 'error');
        spyReactConsoleError.mockImplementation(() => {});
        const spyOnChange = jest.spyOn(ComponentWithPaSearchBar.prototype, 'onFilterChanges');
        const { getByRole, getByText, getByTestId } = render(<ComponentWithPaSearchBar />);
        const searchInput = getByRole('textbox') as HTMLInputElement;
        // change input and trigger Enter key for each value
        inputs.forEach((value) => {
          fireEvent.change(searchInput, { target: { value } });
          fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });
        });

        inputs.forEach((filterText, index) => {
          // check all badgets created
          expect(getByTestId(`${PA_SEARCH_BADGE_NAME}-${index}`)).toHaveTextContent(filterText);
          expect(getByText(filterText)).toBeInTheDocument();
        });

        // check the input value if filter was applied
        expect(searchInput.value).toBe('');
        spyOnChange.mockRestore();
        spyReactConsoleError.mockRestore();
      }
    );
  });

  describe('Invalid cases', () => {
    it.each([
      'name=test1 AND ',
      'name=test1 AND',
      'name=test1 OR',
      'name=test1 OR ',
      'AND name=test1 AND name=test2',
      ' and name=test1 and ',
      'AND name=test1 AND ',
      ' AND name=test1 AND ',
      'or name=test1 or ',
      ' or name=test1 or ',
      'OR name=test1 OR ',
      ' OR name=test1 OR ',
    ])('should NOT apply filter "%s" when the query is INVALID/INCOMPLETE', (inputQuery) => {
      const spyReactConsoleError = jest.spyOn(console, 'error');
      spyReactConsoleError.mockImplementation(() => {});
      const spyOnChange = jest.spyOn(ComponentWithPaSearchBar.prototype, 'onFilterChanges');
      const { getByRole } = render(<ComponentWithPaSearchBar />);
      const searchInput = getByRole('textbox') as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: inputQuery } });
      fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });
      expect(searchInput.value).toBe(inputQuery);
      spyOnChange.mockRestore();
      spyReactConsoleError.mockRestore();
    });

    it('should not apply filters when input is empty', () => {
      const spyReactConsoleError = jest.spyOn(console, 'error');
      spyReactConsoleError.mockImplementation(() => {});
      const spyOnChange = jest.spyOn(ComponentWithPaSearchBar.prototype, 'onFilterChanges');
      const { getByRole } = render(<ComponentWithPaSearchBar />);
      const searchInput = getByRole('textbox') as HTMLInputElement;
      fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });
      expect(searchInput.value).toBe('');
      expect(spyOnChange).toHaveBeenCalledTimes(1);
      expect(spyOnChange).toBeCalledWith([]);
      spyOnChange.mockRestore();
      spyReactConsoleError.mockRestore();
    });
  });
});
