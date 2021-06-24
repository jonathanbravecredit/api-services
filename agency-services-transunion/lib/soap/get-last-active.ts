import { getLastActiveOnboardingQuery } from 'lib/queries/custom-graphql';
import { postGraphQLRequest } from 'lib/utils/helpers';

/**
 * Gets the last active onboarding step by user
 * @returns
 */
export const getLastActiveOnboarding = async (id: string): Promise<{ status: string; data: any; error?: string }> => {
  const variables = {
    id: id,
  };

  try {
    const response = await postGraphQLRequest(getLastActiveOnboardingQuery, variables);
    return { status: 'success', data: response, error: null };
  } catch (err) {
    return { status: 'failed', data: null, error: `failed during sync=${err}` };
  }
};
