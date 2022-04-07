export interface ValidatorDefinition {
  type?: string;
  min?: number;
  max?: number;
  optional?: boolean;
  enum?: string[];
}
