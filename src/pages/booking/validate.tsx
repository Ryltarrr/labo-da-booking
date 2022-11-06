import { Button } from "@mantine/core";
import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";

const Validate: NextPage = () => {
  const { data: bookings } = trpc.booking.getAll.useQuery();
  const validate = trpc.booking.validate.useMutation();

  return (
    <>
      <h1>Validate requête</h1>
      {bookings?.map((b) => (
        <>
          <p>
            {b.firstName} {b.lastName}
            <Button onClick={() => validate.mutate(b.id)}>Valider</Button>
            <br />
          </p>
          <pre>
            <code>{JSON.stringify(b, null, 2)}</code>
          </pre>
        </>
      ))}
    </>
  );
};

export default Validate;
