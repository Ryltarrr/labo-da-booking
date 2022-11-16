export const getImageUrl = (email: string | null | undefined) => {
  if (!email) {
    return "";
  }
  return `/${email.split("@")[0]?.replace(".", "-")}.png`;
};
