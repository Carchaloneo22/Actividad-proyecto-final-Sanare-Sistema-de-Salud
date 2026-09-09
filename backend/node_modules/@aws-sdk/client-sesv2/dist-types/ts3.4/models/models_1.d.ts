import { ReputationEntityType, SendingStatus } from "./enums";
import {
  EmailTemplateContent,
  EventDestinationDefinition,
  Tag,
  Topic,
  TopicPreference,
} from "./models_0";
export interface SendEmailResponse {
  MessageId?: string | undefined;
}
export interface TagResourceRequest {
  ResourceArn: string | undefined;
  Tags: Tag[] | undefined;
}
export interface TagResourceResponse {}
export interface TestRenderEmailTemplateRequest {
  TemplateName: string | undefined;
  TemplateData: string | undefined;
}
export interface TestRenderEmailTemplateResponse {
  RenderedTemplate: string | undefined;
}
export interface UntagResourceRequest {
  ResourceArn: string | undefined;
  TagKeys: string[] | undefined;
}
export interface UntagResourceResponse {}
export interface UpdateConfigurationSetEventDestinationRequest {
  ConfigurationSetName: string | undefined;
  EventDestinationName: string | undefined;
  EventDestination: EventDestinationDefinition | undefined;
}
export interface UpdateConfigurationSetEventDestinationResponse {}
export interface UpdateContactRequest {
  ContactListName: string | undefined;
  EmailAddress: string | undefined;
  TopicPreferences?: TopicPreference[] | undefined;
  UnsubscribeAll?: boolean | undefined;
  AttributesData?: string | undefined;
}
export interface UpdateContactResponse {}
export interface UpdateContactListRequest {
  ContactListName: string | undefined;
  Topics?: Topic[] | undefined;
  Description?: string | undefined;
}
export interface UpdateContactListResponse {}
export interface UpdateCustomVerificationEmailTemplateRequest {
  TemplateName: string | undefined;
  FromEmailAddress: string | undefined;
  TemplateSubject: string | undefined;
  TemplateContent: string | undefined;
  SuccessRedirectionURL: string | undefined;
  FailureRedirectionURL: string | undefined;
}
export interface UpdateCustomVerificationEmailTemplateResponse {}
export interface UpdateEmailIdentityPolicyRequest {
  EmailIdentity: string | undefined;
  PolicyName: string | undefined;
  Policy: string | undefined;
}
export interface UpdateEmailIdentityPolicyResponse {}
export interface UpdateEmailTemplateRequest {
  TemplateName: string | undefined;
  TemplateContent: EmailTemplateContent | undefined;
}
export interface UpdateEmailTemplateResponse {}
export interface UpdateReputationEntityCustomerManagedStatusRequest {
  ReputationEntityType: ReputationEntityType | undefined;
  ReputationEntityReference: string | undefined;
  SendingStatus: SendingStatus | undefined;
}
export interface UpdateReputationEntityCustomerManagedStatusResponse {}
export interface UpdateReputationEntityPolicyRequest {
  ReputationEntityType: ReputationEntityType | undefined;
  ReputationEntityReference: string | undefined;
  ReputationEntityPolicy: string | undefined;
}
export interface UpdateReputationEntityPolicyResponse {}
