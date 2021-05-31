import { BlockAttributes, FormBlocks } from '@quillforms/config';
import {
	SET_SUBMISSION_ERRORS,
	SET_SWIPER_STATE,
	COMPLETE_FORM,
	GO_NEXT,
	GO_PREV,
	GO_TO_BLOCK,
	INSERT_EMPTY_FIELD_ANSWER,
	SET_FIELD_ANSWER,
	SET_IS_FIELD_VALID,
	SET_FIELD_VALIDATION_ERR,
	SET_IS_FIELD_ANSWERED,
	RESET_ANSWERS,
	SET_IS_REVIEWING,
	SET_IS_SUBMITTING,
} from './constants';
export type Screen = {
	id: string;
	attributes: BlockAttributes;
};

export type SwiperState = {
	walkPath: FormBlocks;
	welcomeScreens: Screen[];
	thankyouScreens: Screen[];
	currentBlockId: undefined | string;
	nextBlockId: undefined | string;
	lastActiveBlockId: undefined | string;
	prevBlockId: undefined | string;
	canGoNext: boolean;
	canGoPrev: boolean;
	isAnimating: boolean;
	isThankyouScreenActive: boolean;
	isWelcomeScreenActive: boolean;
};

export type SubmissionState = {
	isReviewing: boolean;
	isSubmitting: boolean;
	submissionErrors: string[];
};

/**
 * Actions
 */
type setSwiperAction = {
	type: typeof SET_SWIPER_STATE;
	swiperState: Partial< SwiperState >;
};

type goNextAction = {
	type: typeof GO_NEXT;
	isSwiping?: boolean;
};

type goPrevAction = {
	type: typeof GO_PREV;
};

type goToBlockAction = {
	type: typeof GO_TO_BLOCK;
	id: string;
};

type completeFormAction = {
	type: typeof COMPLETE_FORM;
};

export type Answer = {
	isValid: boolean;
	isAnswered: boolean;
	blockName: string;
	value: unknown;
	validationErr: string | undefined;
};

export type RendererAnswersState = Record< string, Answer >;

/**
 * Actions
 */
type insertEmptyFieldAnswerAction = {
	type: typeof INSERT_EMPTY_FIELD_ANSWER;
	id: string;
	blockName: string;
};

type setFieldAnswerAction = {
	type: typeof SET_FIELD_ANSWER;
	id: string;
	val: unknown;
};

type setIsFieldValidAction = {
	type: typeof SET_IS_FIELD_VALID;
	id: string;
	val: boolean;
};

type setIsFieldAnsweredAction = {
	type: typeof SET_IS_FIELD_ANSWERED;
	id: string;
	val: boolean;
};

type setIsFieldValidationErr = {
	type: typeof SET_FIELD_VALIDATION_ERR;
	id: string;
	val: string;
};

type resetAnswers = {
	type: typeof RESET_ANSWERS;
};

type setIsReviewing = {
	type: typeof SET_IS_REVIEWING;
	val: boolean;
};

type setIsSubmitting = {
	type: typeof SET_IS_SUBMITTING;
	val: boolean;
};

type setSumbissionErrors = {
	type: typeof SET_SUBMISSION_ERRORS;
	val: string[];
};
export type RendererAnswersActionTypes =
	| insertEmptyFieldAnswerAction
	| setFieldAnswerAction
	| setIsFieldValidAction
	| setIsFieldValidationErr
	| setIsFieldAnsweredAction
	| resetAnswers
	| ReturnType< () => { type: 'NOOP' } >;

export type SwiperActionTypes =
	| setSwiperAction
	| goNextAction
	| goPrevAction
	| goToBlockAction
	| completeFormAction
	| ReturnType< () => { type: 'NOOP' } >;

export type SubmitActionTypes =
	| setIsReviewing
	| setIsSubmitting
	| setSumbissionErrors
	| completeFormAction
	| ReturnType< () => { type: 'NOOP' } >;
