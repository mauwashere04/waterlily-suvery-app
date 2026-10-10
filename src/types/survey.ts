export type QuestionType = "text" | "number" | "single";

export interface SurveyOption {
  id: string;
  label: string;
  position: number;
}

export interface SurveyQuestion {
  id: string;
  key: string;
  position: number;
  title: string;
  description: string;
  type: QuestionType;
  options: SurveyOption[];
}

export interface SurveyInfo {
  id: string;
  title: string;
  description: string;
}

export interface SurveyApiResponse {
  survey: SurveyInfo;
  questions: SurveyQuestion[];
  hasSubmitted: boolean;
}
