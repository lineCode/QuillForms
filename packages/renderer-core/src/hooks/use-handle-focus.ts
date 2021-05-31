/**
 * WordPress Dependencies
 */
import { findDOMNode, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

let focusTimer;
const useHandleFocus = (
	inputRef,
	isActive: boolean,
	isTouchDevice: boolean
) => {
	const { isAnimating, currentBlockId } = useSelect( ( select ) => {
		return {
			isAnimating: select( 'quillForms/renderer-core' ).isAnimating(),
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
		};
	} );

	const { isFocused } = useSelect( ( select ) => {
		return {
			isFocused: select( 'quillForms/renderer-core' ).isFocused(),
		};
	} );

	const isVisible = ( ref ) => {
		if ( ! ref?.current ) return false;
		var rect = ( findDOMNode(
			ref.current
		) as Element )?.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <=
				( window.innerHeight ||
					document.documentElement
						.clientHeight ) /* or $(window).height() */ &&
			rect.right <=
				( window.innerWidth ||
					document.documentElement
						.clientWidth ) /* or $(window).width() */
		);
	};

	useEffect( () => {
		if ( ! isTouchDevice && isFocused && isActive && ! isAnimating ) {
			if ( isVisible( inputRef ) ) {
				focusTimer = setTimeout( () => {
					if ( inputRef?.current?.focus ) {
						inputRef.current.focus();
					}
				} );
			} else {
				if (
					currentBlockId &&
					document?.querySelector(
						`#block-${ currentBlockId } .renderer-components-field-wrapper__content-wrapper`
					)
				) {
					focusTimer = setTimeout( () => {
						( document.querySelector(
							`#block-${ currentBlockId } .renderer-components-field-wrapper__content-wrapper`
						) as HTMLElement ).focus();
					} );
				}
			}
		}
	}, [ isFocused, isActive, isAnimating ] );

	useEffect( () => {
		if ( ! isActive ) {
			clearTimeout( focusTimer );
		}
		if (
			inputRef?.current?.blur &&
			! isActive &&
			document.activeElement === inputRef.current
		) {
			console.log( 'lkjndhwsqk' );
			inputRef.current.blur();
		}
	}, [ inputRef, isActive ] );
};

export default useHandleFocus;
