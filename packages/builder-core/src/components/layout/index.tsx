/**
 * QuillForms Dependencies
 */
import { __experimentalDragDropContext as DragDropContext } from '@quillforms/admin-components';
import { createBlock } from '@quillforms/blocks';

/**
 * WordPress Dependencies
 */
import { useState, useMemo, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { PluginArea } from '@wordpress/plugins';

/**
 * External Dependencies
 */
import { confirmAlert } from 'react-confirm-alert';

/**
 * Internal Dependencies
 */
import DropArea from '../drop-area';
import FormPreview from '../preview-area-wrapper';
import Panel from '../panel';
import BuilderPanelsBar from '../panels-bar';
import DragAlert from '../drag-alert';
import SaveButton from '../save-button';
import { BuilderNotices } from '../builder-notices';
import type {
	OnDragUpdateResponder,
	OnDragEndResponder,
	OnBeforeCaptureResponder,
	OnDragStartResponder,
} from 'react-beautiful-dnd';

const Layout: React.FC = () => {
	const [ targetIndex, setTargetIndex ] = useState< number >();
	const [ isDraggingContent, setIsDraggingContent ] = useState< boolean >(
		false
	);
	const [ sourceContentIndex, setSourceContentIndex ] = useState< number >();
	const [ isDragging, setIsDragging ] = useState< boolean >( false );

	const {
		blockTypes,
		currentPanel,
		areaToShow,
		formBlocks,
		hasBlocksFinishedResolution,
	} = useSelect( ( select ) => {
		const { getBlockTypes } = select( 'quillForms/blocks' );
		const { getCurrentPanel, getAreaToShow } = select(
			'quillForms/builder-panels'
		);
		// @ts-expect-error
		// hasFinishedResolution isn't in select map and until now, @types/wordpress__data doesn't have it by default.
		const { getBlocks, hasFinishedResolution } = select(
			'quillForms/block-editor'
		);
		return {
			blockTypes: getBlockTypes(),
			currentPanel: getCurrentPanel(),
			areaToShow: getAreaToShow(),
			formBlocks: getBlocks(),
			hasBlocksFinishedResolution: hasFinishedResolution( 'getBlocks' ),
		};
	} );

	const { insertBlock, reorderBlocks, setCurrentBlock } = useDispatch(
		'quillForms/block-editor'
	);
	const { insertEmptyFieldAnswer } = useDispatch(
		'quillForms/renderer-submission'
	);

	const hasIncorrectFieldMergeTags = ( a: number, b: number ): boolean => {
		const list = [ ...formBlocks ];
		const { attributes } = list[ a ];
		const label = attributes?.label ? attributes.label : '';
		const description = attributes?.description
			? attributes.description
			: '';
		const regex = /{{field:([a-zA-Z0-9-_]+)}}/g;
		let match;

		while ( ( match = regex.exec( label + ' ' + description ) ) ) {
			const fieldId = match[ 1 ];
			const fieldIndex = formBlocks.findIndex(
				( field ) => field.id === fieldId
			);
			if ( fieldIndex >= b ) {
				return true;
			}
		}
		return false;
	};

	const onDragStart: OnDragStartResponder = ( {
		source,
	}: {
		source: {
			index?: number;
			droppableId?: string;
		};
	} ) => {
		setIsDragging( true );
		if ( source?.droppableId !== 'DROP_AREA' ) return;
		setSourceContentIndex( source.index );
	};

	const onDragUpdate: OnDragUpdateResponder = ( { destination } ) => {
		if ( destination?.droppableId !== 'DROP_AREA' ) {
			setTargetIndex( undefined );
			return;
		}
		let next = destination?.index;

		if ( isDraggingContent && next && sourceContentIndex !== undefined ) {
			next = next >= sourceContentIndex ? next + 1 : next;
		}

		setTargetIndex( next );
	};

	const onDragEnd: OnDragEndResponder = ( result ) => {
		setIsDragging( false );
		setTargetIndex( undefined );
		setIsDraggingContent( false );

		const { source, destination } = result;

		// dropped outside the list
		if ( ! destination ) {
			return;
		}

		switch ( source.droppableId ) {
			case destination.droppableId:
				if ( destination.droppableId === 'BLOCKS_LIST' ) {
					return;
				}
				if (
					hasIncorrectFieldMergeTags(
						source.index,
						destination.index
					) ||
					hasIncorrectFieldMergeTags(
						destination.index,
						source.index
					)
				) {
					confirmAlert( {
						customUI: ( { onClose } ) => {
							return (
								<DragAlert
									approve={ () => {
										reorderBlocks(
											source.index,
											destination.index
										);
										onClose();
									} }
									reject={ () => {
										onClose();
									} }
									closeModal={ onClose }
								/>
							);
						},
					} );
				} else {
					reorderBlocks( source.index, destination.index );
				}
				break;
			case 'BLOCKS_LIST': {
				if ( destination.droppableId === 'DROP_AREA' ) {
					// Get block type
					const blockName = Object.keys( blockTypes )[ source.index ];
					const blockType = blockTypes[ blockName ];
					const blockToInsert = createBlock( blockName );
					// console.log( blockToInsert );
					if ( blockToInsert ) {
						// blockToInsert.id = generateBlockId();
						if ( blockType.supports.editable )
							insertEmptyFieldAnswer(
								blockToInsert.id,
								blockType
							);

						insertBlock( blockToInsert, destination );
					}
				}
			}
		}
	};

	const onBeforeCapture: OnBeforeCaptureResponder = ( { draggableId } ) => {
		const contentListItem = formBlocks.find(
			( block ) => block.id === draggableId
		);
		const isDraggingContentList = !! contentListItem;

		if ( isDraggingContentList ) {
			setIsDraggingContent( true );
		}

		const el = document.querySelector(
			`[data-rbd-draggable-id="${ draggableId }"]`
		) as HTMLInputElement;

		if ( el ) {
			el.style.height = isDraggingContentList ? '24px' : '2px';
		}
	};

	const formPreview = useMemo( () => {
		return <FormPreview />;
	}, [] );

	const pluginsArea = useMemo( () => {
		return <PluginArea />;
	}, [] );
	const builderNotices = useMemo( () => {
		return <BuilderNotices />;
	}, [] );

	const builderPanelsBar = useMemo( () => {
		return <BuilderPanelsBar />;
	}, [] );

	const savButton = useMemo( () => {
		return <SaveButton />;
	}, [] );

	const panel = useMemo( () => {
		return <Panel />;
	}, [] );

	// Setting current block id once blocks are resolved.
	useEffect( () => {
		if ( hasBlocksFinishedResolution && formBlocks?.length > 0 ) {
			setCurrentBlock( formBlocks[ 0 ].id );
			formBlocks.forEach( ( block ) => {
				const blockType = blockTypes[ block.name ];
				if ( blockType.supports.editable )
					insertEmptyFieldAnswer( block.id, block.name );
			} );
		}
	}, [ hasBlocksFinishedResolution ] );

	return (
		<>
			{ savButton }
			{ builderNotices }
			{ pluginsArea }
			{ builderPanelsBar }
			<DragDropContext
				onDragStart={ onDragStart }
				onDragEnd={ onDragEnd }
				onDragUpdate={ onDragUpdate }
				onBeforeCapture={ onBeforeCapture }
			>
				{ currentPanel && panel }
				{ ( ! areaToShow || areaToShow === 'drop-area' ) && (
					<DropArea
						isDragging={ isDragging }
						currentPanel={ currentPanel }
						targetIndex={ targetIndex }
						areaToShow={ areaToShow }
					/>
				) }
			</DragDropContext>
			{ ( ! areaToShow || areaToShow === 'preview-area' ) && formPreview }
		</>
	);
};

export default Layout;