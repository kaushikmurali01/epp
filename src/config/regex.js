export const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const emailPhoneUSFormateRegExp = /^(?=.{6,50}$)(([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(\+?1?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})|\d{10})$/
export  const hasUpperAndLowerCase =/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;