/**
 * QuillForms Dependencies
 */
import { Icon } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { close } from '@wordpress/icons';

interface Props {
	blockColor?: string;
	attachment: {
		type: string;
		url: string;
	};
	id: string;
}
const BlockAttachment: React.FC< Props > = ( {
	blockColor,
	attachment,
	id,
} ) => {
	const { setBlockAttributes } = useDispatch( 'quillForms/block-editor' );

	return (
		<div
			className="block-editor-block-attachment"
			style={ { borderColor: blockColor } }
		>
			<img
				alt=""
				className="block-editor-block-attachment__image"
				src={ attachment.url }
			/>
			<div
				role="presentation"
				className="block-editor-block-attachment__delete"
				onClick={ () => setBlockAttributes( id, { attachment: {} } ) }
			>
				<div
					className="block-editor-block-attachment__background-wrapper"
					style={ { backgroundColor: blockColor } }
				/>
				<Icon icon={ close } style={ { color: blockColor } } />
			</div>
		</div>
	);
};

export default BlockAttachment;
