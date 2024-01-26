import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import { expect } from "vitest";

// @vitest-environment jsdom

const server = setupServer();

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

it("fetch test - jsdom", async () => {
  let receivingSize;

  server.use(
    http.post("http://localhost/api", async ({ request }) => {
      const data = await request.formData();
      receivingSize = data.get("file").size;
      console.log("receiving size", receivingSize);
      return HttpResponse.json();
    })
  );

  const formData = new FormData();
  const json = JSON.stringify({ test: 1 });
  const blob = new Blob([json], {
    type: "application/json",
  });
  formData.append("file", blob);
  const sendingSize = formData.get("file").size;
  console.log("sending size", sendingSize);

  fetch("http://localhost/api", {
    method: "POST",
    body: formData,
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  expect(receivingSize).toEqual(sendingSize);
});
