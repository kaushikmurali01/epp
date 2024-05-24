export const validatorApiResponse = async (schemaName: any, eventName: object) => {
  try {
    await schemaName.validate(eventName);
  } catch (error: any) {
    throw error?.errors[0]
  }
};
