import supertest from "supertest";
import path from "path";
import { app, server } from "..";

const api = supertest(app);

test("post a new file", async () => {
  const filePath = path.join(__dirname, "../../test.csv");
  const response = await api
    .post("/api/files")
    .attach("file", filePath)
    .expect(200);

  expect(response.body).toEqual(
    expect.objectContaining({
      data: expect.any(Object),
    })
  );
});

test("Data is returned as json", async () => {
  const response = await api
    .get("/api/users")
    .query({ q: "Juan" })
    .expect(200)
    .expect("Content-Type", /application\/json/);
  expect(response.body.data).toHaveLength(1);
});

afterAll(() => {
  server.close();
});
