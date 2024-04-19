interface UserAttributes {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    address: string;
    azure_ad_id?: string;
  }
export { UserAttributes };