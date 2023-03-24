export const getImageUrl = (email: string | null | undefined) => {
  if (!email) {
    return "";
  }
  return `/${email.split("@")[0]?.replace(".", "-")}.webp`;
};

export const getPageTitle = (title: string) => {
  return `${title} - Labo-DA`;
};

export const getDateWithoutTime = (date: Date) => {
  const withoutHours = new Date(date);
  withoutHours.setHours(0, 0, 0, 0);
  return withoutHours.getTime();
};

export const getBookingEndTime = (start: Date, duration: number): Date => {
  const end = new Date(start);
  end.setMinutes(start.getMinutes() + duration);
  return end;
};
