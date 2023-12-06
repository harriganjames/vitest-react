import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";

const server = setupServer();

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

it("fetch test", async () => {
  server.use(
    http.post("http://localhost/api", async ({ request }) => {
      const data = await request.formData();
      console.log("receiving size", data.get("file").size);
      return HttpResponse.json();
    })
  );

  const formData = new FormData();
  const json = JSON.stringify({ test: 1 });
  const blob = new Blob([json], {
    type: "application/json",
  });
  formData.append("file", blob);
  console.log("sending size", formData.get("file").size);

  fetch("http://localhost/api", {
    method: "POST",
    body: formData,
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));
});
