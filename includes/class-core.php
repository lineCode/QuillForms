<?php
/**
 * Core: class Core.
 * Responsible for registering post type and registering block types in JS and some functions to get blocks, messages, ..etc.
 *
 * @since 1.0.0
 * @package QuillForms
 */

namespace QuillForms;

use QuillForms\Managers\Blocks_Manager;
use QuillForms\Models\Form_Theme_Model;

/**
 * Core class
 *
 * @since 1.0.0
 */
class Core {

	/**
	 * Register Block types via inline scripts.
	 *
	 * @since 1.0.0
	 */
	public static function register_block_types_by_js() {
		foreach ( Blocks_Manager::get_instance()->get_all_registered() as $block ) {
			wp_add_inline_script(
				'quillforms-blocks',
				'qf.blocks.registerBlockType("' . $block->name . '",' . wp_json_encode(
					array(
						'attributes'       => $block->custom_attributes,
						'supports'         => $block->supported_features,
						'logicalOperators' => $block->logical_operators,
					)
				) . ');'
			);

		}
	}

	/**
	 * Register Quill Forms Post Type.
	 *
	 * @since 1.0.0
	 */
	public static function register_quillforms_post_type() {
		$labels   = array(
			'name'                  => __( 'Forms', 'quillforms' ),
			'singular_name'         => __( 'Form', 'quillforms' ),
			'add_new'               => __( 'Add Form', 'quillforms' ),
			'add_new_item'          => __( 'Add Form', 'quillforms' ),
			'edit_item'             => __( 'Edit Form', 'quillforms' ),
			'new_item'              => __( 'Add Form', 'quillforms' ),
			'view_item'             => __( 'View Form', 'quillforms' ),
			'search_items'          => __( 'Search Forms', 'quillforms' ),
			'not_found'             => __( 'No forms found', 'quillforms' ),
			'not_found_in_trash'    => __( 'No forms found in trash', 'quillforms' ),
			'featured_image'        => __( 'Form Featured Image', 'quillforms' ),
			'set_featured_image'    => __( 'Set featured image', 'quillforms' ),
			'remove_featured_image' => __( 'Remove featured image', 'quillforms' ),
			'use_featured_image'    => __( 'Use as featured image', 'quillforms' ),
		);
		$supports = array(
			'title',
			'editor',
			'thumbnail',
		);

		$args = array(
			'labels'             => $labels,
			'hierarchical'       => false,
			'supports'           => $supports,
			'public'             => true,
			'show_in_menu'       => false,
			'show_ui'            => true,
			'publicly_queryable' => true,
			'query_var'          => true,
			'capability_type'    => 'quillform',
			'rewrite'            => array(
				'slug'       => 'quillforms',
				'feeds'      => true,
				'with_front' => false,
			),
			'has_archive'        => true,
			'menu_position'      => 30,
			'show_in_rest'       => true,
		);
		register_post_type( 'quill_forms', $args );
		flush_rewrite_rules();
	}

	/**
	 * Get blocks for a specific form id.
	 *
	 * @param integer $form_id   Form id.
	 *
	 * @return array|null The form blocks
	 *
	 * @since 1.0.0
	 */
	public static function get_blocks( $form_id ) {
		$blocks = get_post_meta( $form_id, 'blocks', true );
		$blocks = $blocks ? $blocks : array();
		return $blocks;
	}

	/**
	 * Get messages for a specific form id.
	 *
	 * @param integer $form_id   Form id.
	 *
	 * @return array|null The form messages
	 *
	 * @since 1.0.0
	 */
	public static function get_messages( $form_id ) {
		$messages = get_post_meta( $form_id, 'messages', true );
		return $messages;
	}

	/**
	 * Get notifications for a specific form id.
	 *
	 * @param integer $form_id   Form id.
	 *
	 * @return array|null The form notifications
	 *
	 * @since 1.0.0
	 */
	public static function get_notifications( $form_id ) {
		$notifications = get_post_meta( $form_id, 'notifications', true );
		return $notifications;
	}

	/**
	 * Get the theme for a specific form id.
	 *
	 * @param integer $form_id   Form id.
	 *
	 * @return array|null The form theme
	 *
	 * @since 1.0.0
	 */
	public static function get_theme( $form_id ) {
		$theme_id  = get_post_meta( $form_id, 'theme', true );
		$theme_obj = Form_Theme_Model::get_theme( $theme_id );
		if ( ! $theme_obj ) {
			$theme = Form_Theme::get_instance()->prepare_theme_properties_for_render();
		} else {
			$theme_properties = $theme_obj['properties'];
			$theme_properties = $theme_properties ? $theme_properties : array();
			$theme            = Form_Theme::get_instance()->prepare_theme_properties_for_render( $theme_properties );
		}
		return $theme;
	}
}
