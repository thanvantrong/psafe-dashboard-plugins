import { compose } from 'redux';
import { withErrorBoundary, withReduxProvider } from '../../../../components/common/hocs';
// Redux
import PaManagementMain from '../management/management-main';

export default compose(withErrorBoundary, withReduxProvider)(PaManagementMain);
