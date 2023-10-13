import { PaSecurity } from '../../components/security';
import { getAngularModule } from '../../kibana-services';

const app = getAngularModule();
app.value('PaSecurity', PaSecurity);