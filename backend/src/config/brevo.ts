import SibApiV3Sdk from 'sib-api-v3-sdk';
import config from './index.js';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.brevo.apiKey;

export const brevoApiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const configureBrevo = (): void => {
  if (config.brevo.apiKey) {
    console.log('✅ Brevo Email Service Configured');
  } else {
    console.warn('⚠️  Brevo API key not configured');
  }
};

export default { brevoApiInstance, configureBrevo };
