/**
 * QuillForms Dependencies
 */
import { BuilderLayout } from '@quillforms/builder-core';
import { getRestFields } from '@quillforms/rest-fields';
import configApi from '@quillforms/config';
/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import { flatten, map, forEach, uniq } from 'lodash';
import Loader from 'react-loader-spinner';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import SaveButton from './save-button';
import './style.scss';

const Builder = ( { params } ) => {
	const { id } = params;

	const { setCurrentPanel } = useDispatch( 'quillForms/builder-panels' );
	const { resetAnswers } = useDispatch( 'quillForms/renderer-core' );

	const { invalidateResolutionForStore } = useDispatch( 'core/data' );
	const connectedStores = flatten(
		map( getRestFields(), ( restField ) => restField.connectedStores )
	);
	const [ isResolving, setIsResolving ] = useState( true );
	const [ isLoading, setIsLoading ] = useState( true );

	const invalidateResolutionForAllConnectedStores = () => {
		// Invalidate resolution for all connected stores.
		forEach( uniq( connectedStores ), ( store ) => {
			if (
				store &&
				wp.data.RegistryConsumer._currentValue.stores[ store ]
			) {
				invalidateResolutionForStore( store );
			}
		} );
	};
	useEffect( () => {
		apiFetch( {
			path: `/wp/v2/quill_forms/${ id }`,
			method: 'GET',
		} ).then( ( res ) => {
			configApi.setInitialBuilderPayload( res );
			invalidateResolutionForAllConnectedStores();
			setTimeout( () => {
				setIsLoading( false );
			}, 100 );
		} );

		return () => {
			setCurrentPanel( 'blocks' );
			invalidateResolutionForAllConnectedStores();
			resetAnswers();
		};
	}, [] );

	// Making sure all stores are set up already
	// We pick one store only (any store would work) "The  block editor store" to make sure all resolvers depending on builder initial payload has finished resolution.
	// what would make this would work is that we have the save button components rendered already while fetching.
	// The save button component has observers for all rest fields changes so here we would be notified if the resolution has finished.
	const { hasBlockEditorFinishedResolution } = useSelect( ( select ) => {
		return {
			hasBlockEditorFinishedResolution: select(
				'quillForms/block-editor'
			).hasFinishedResolution( 'getBlocks' ),
		};
	} );

	useEffect( () => {
		if ( ! isLoading && hasBlockEditorFinishedResolution ) {
			setIsResolving( false );
		}
	}, [ isLoading, hasBlockEditorFinishedResolution ] );
	return (
		<div id="quillforms-builder-page">
			{ isResolving ? (
				<div
					className={ css`
						display: flex;
						flex-wrap: wrap;
						width: 100%;
						min-height: 100vh;
						justify-content: center;
						align-items: center;
					` }
				>
					<Loader
						type="ThreeDots"
						color="#8640e3"
						height={ 50 }
						width={ 50 }
					/>
				</div>
			) : (
				<BuilderLayout />
			) }

			<SaveButton formId={ id } isResolving={ isResolving } />
		</div>
	);
};

export default Builder;
