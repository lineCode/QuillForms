/**
 * External Dependencies
 */
import { isFunction, some } from 'lodash';

/**
 * Internal Dependencies
 */
import { Pages, PageSettings } from '../types';

const adminPages: Pages = {};
export const registerAdminPage = ( id: string, settings: PageSettings ) => {
	if ( adminPages[ id ] ) {
		console.error( 'This page id is already registered' );
		return;
	}

	if ( ! settings.path ) {
		console.error( 'Path property is mandatory!' );
		return;
	}

	if ( typeof settings.path !== 'string' ) {
		console.error( 'The "path" property must be a string!' );
		return;
	}

	if (
		some(
			Object.values( adminPages ),
			( page ) => page.path === settings.path
		)
	) {
		console.error( 'This path is already registered!' );
		return;
	}

	if ( ! settings.component ) {
		console.error( 'The "component" property is mandatory!' );
		return;
	}

	if ( ! isFunction( settings.component ) ) {
		console.error( 'The "component" property must be a valid function!' );
		return;
	}

	if (
		settings.template &&
		settings.template !== 'default' &&
		settings.template !== 'full-screen'
	) {
		console.error(
			'The "template" property can have value of "default" or "full-screen" only!'
		);
		return;
	}

	if ( settings.header && ! isFunction( settings.header ) ) {
		console.error( 'The "header" property must be a valid function!' );
		return;
	}

	adminPages[ id ] = settings;
};

export const getAdminPages = (): Pages => {
	return adminPages;
};
