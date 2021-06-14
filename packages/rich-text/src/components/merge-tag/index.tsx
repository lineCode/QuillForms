/**
 * QuillForms Dependencies
 */
import type { IconDescriptor, Icon as IconType } from '@quillforms/types';
import { Icon, Dashicon } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';
import { plus, close } from '@wordpress/icons';

/**
 * External Dependencies
 */
import { Editor, Path } from 'slate';
import classnames from 'classnames';
import { css } from 'emotion';
import { ReactEditor, RenderElementProps } from 'slate-react';

/**
 * Internal Dependencies
 */
import getPlainExcerpt from '../../get-plain-excerpt';
import type { MergeTags, MergeTag } from '../../types';

interface Props extends RenderElementProps {
	path: Path;
	mergeTags: MergeTags;
	editor: ReactEditor;
	children: React.ReactNode;
}
const EditorMergeTag: React.FC< Props > = ( {
	attributes,
	editor,
	children,
	path,
	element,
	mergeTags,
} ) => {
	const { type, modifier } = element.data as MergeTag;
	const [ node ] = Editor.node( editor, path );

	const mergeTag = mergeTags.find(
		( a ) => a.type === type && a.modifier === modifier
	);
	const mergeTagIcon = mergeTag?.icon ? mergeTag.icon : plus;
	const renderedIcon = (
		<Icon
			icon={
				( ( mergeTagIcon as IconDescriptor )?.src as IconType )
					? ( ( mergeTagIcon as IconDescriptor )?.src as IconType )
					: ( mergeTagIcon as Dashicon.Icon )
			}
		/>
	);

	useEffect( () => {
		if ( ! mergeTag ) {
			editor.apply( { type: 'remove_node', path, node } );
		}
	}, [ mergeTags, mergeTag ] );
	return (
		<>
			{ mergeTag && (
				<span
					{ ...attributes }
					contentEditable={ false }
					className={ classnames(
						'rich-text-merge-tag__node-wrapper',
						css`
							color: ${ mergeTag?.color
								? mergeTag.color
								: '#bb426f' };
							bordercolor: ${ mergeTag?.color
								? mergeTag.color
								: '#bb426f' };
							fill: ${ mergeTag?.color
								? mergeTag.color
								: '#bb426f' };
						`
					) }
				>
					<span
						className={ classnames(
							'rich-text-merge-tag__background',
							css`
								background: ${ mergeTag?.color
									? mergeTag.color
									: '#bb426f' };
							`
						) }
					/>
					<span className="rich-text-merge-tag__icon-box">
						{ renderedIcon }
					</span>
					<span
						className="rich-text-merge-tag__title"
						dangerouslySetInnerHTML={ {
							__html: getPlainExcerpt( mergeTag.label ),
						} }
					/>

					<button
						className="rich-text-merge-tag__delete"
						onClick={ () => {
							setTimeout( () => {
								editor.apply( {
									type: 'remove_node',
									path,
									node,
								} );
							}, 0 );
						} }
					>
						<Icon icon={ close } />
					</button>
					{ children }
				</span>
			) }
		</>
	);
};
export default EditorMergeTag;
