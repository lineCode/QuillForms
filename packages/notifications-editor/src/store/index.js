import { registerStore } from '@wordpress/data';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
const store = registerStore( 'quillForms/notifications-editor', {
	reducer,
	actions,
	selectors,
} );
export default store;
