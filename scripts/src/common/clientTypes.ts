/**
 * Created by nitzan on 14/07/2017.
 */

// result types from fugazi.components.commands
export enum ResultStatus {
	Success,
	Failure,
	OAuth2,
	Prompt
}

export interface Result {
	status: ResultStatus;
}

export interface SuccessResult extends Result {
	value?: any;
}

export interface FailResult extends Result {
	error: string;
}

export interface OAuth2Result extends Result {
	authorizationUri: string;
}

export interface PromptData {
	type: "password";
	message: string;
	handlePromptValue: (value: string) => void;
}

export interface PromptResult extends Result {
	prompt: PromptData;
}