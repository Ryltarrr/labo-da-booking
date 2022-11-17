import "dayjs/locale/fr";
import { Center, Title } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { type NextPage } from "next";
import Head from "next/head";
import {
  getBookingEndTime,
  getDateWithoutTime as getDateWithoutTime,
  getPageTitle,
} from "../../utils/functions";
import { trpc } from "../../utils/trpc";
import { useState } from "react";

const Planning: NextPage = () => {
  const { data: availabilities } = trpc.availability.getAllFuture.useQuery();
  const { data: bookings } = trpc.booking.getAllPlanned.useQuery();
  const [date, setDate] = useState<Date | null>(null);

  const includedDates = new Set();
  availabilities?.forEach((el) => {
    const startDate = getDateWithoutTime(el.startAt);
    includedDates.add(startDate);
  });

  const bookingsOnSelectedDate = date
    ? bookings?.filter(
        (b) => getDateWithoutTime(b.date) === getDateWithoutTime(date)
      )
    : [];

  return (
    <>
      <Head>
        <title>{getPageTitle("Planning")}</title>
        <meta
          name="description"
          content="Logiciel de réservation pour le Labo-DA Ynov"
        />
      </Head>
      <main>
        <Title order={2} mb="xl">
          Planning
        </Title>
        <Center>
          <Calendar
            value={date}
            onChange={setDate}
            locale="fr"
            excludeDate={(date) => !includedDates.has(getDateWithoutTime(date))}
          />
        </Center>
        {!!bookingsOnSelectedDate?.length ? (
          <>
            {bookingsOnSelectedDate?.map((el) => (
              <div key={el.id}>
                <>
                  {el.firstName} {el.lastName} de{" "}
                  {el.date.toLocaleTimeString("fr", { timeStyle: "short" })} à{" "}
                  {getBookingEndTime(
                    el.date,
                    el.course.duration
                  ).toLocaleTimeString("fr", { timeStyle: "short" })}{" "}
                  avec {el.teacher?.name}
                </>
              </div>
            ))}
          </>
        ) : (
          <>Pas de réservation à cette date</>
        )}
      </main>
    </>
  );
};

export default Planning;
