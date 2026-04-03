import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import { expect } from "chai";
import request from "supertest";
import { AppDataSource } from "../src/config/database";
import { Task } from "../src/entity/Task";
import { app } from "../src/app";

before(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

beforeEach(async () => {
  await AppDataSource.getRepository(Task).clear();
});

after(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

// ---------------------------------------------------------------------------
// POST /tasks
// ---------------------------------------------------------------------------
describe("POST /tasks", () => {
  it("creates a task with valid title and returns 201", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Write tests", description: "TDD all the things" });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("id");
    expect(res.body.title).to.equal("Write tests");
    expect(res.body.description).to.equal("TDD all the things");
    expect(res.body.status).to.equal("todo");
    expect(res.body).to.have.property("created_at");
  });

  it("creates a task without optional description", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Minimal task" });

    expect(res.status).to.equal(201);
    expect(res.body.title).to.equal("Minimal task");
  });

  it("returns 400 when title is missing", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ description: "No title here" });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error");
  });

  it("returns 400 when title is an empty string", async () => {
    const res = await request(app).post("/tasks").send({ title: "   " });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error");
  });
});

// ---------------------------------------------------------------------------
// GET /tasks
// ---------------------------------------------------------------------------
describe("GET /tasks", () => {
  it("returns 200 with an empty array when no tasks exist", async () => {
    const res = await request(app).get("/tasks");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").that.is.empty;
  });

  it("returns all tasks as an array", async () => {
    await request(app).post("/tasks").send({ title: "Task 1" });
    await request(app).post("/tasks").send({ title: "Task 2" });

    const res = await request(app).get("/tasks");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").with.lengthOf(2);
  });

  it("returns tasks with the expected fields", async () => {
    await request(app)
      .post("/tasks")
      .send({ title: "Check fields", description: "desc" });

    const res = await request(app).get("/tasks");

    const task = res.body[0];
    expect(task).to.have.all.keys(
      "id",
      "title",
      "description",
      "status",
      "created_at"
    );
  });
});

// ---------------------------------------------------------------------------
// PUT /tasks/:id
// ---------------------------------------------------------------------------
describe("PUT /tasks/:id", () => {
  it("updates status to in-progress and returns the updated task", async () => {
    const create = await request(app)
      .post("/tasks")
      .send({ title: "Update me" });
    const id = create.body.id;

    const res = await request(app)
      .put(`/tasks/${id}`)
      .send({ status: "in-progress" });

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("in-progress");
  });

  it("updates status to done", async () => {
    const create = await request(app)
      .post("/tasks")
      .send({ title: "Finish me" });
    const id = create.body.id;

    const res = await request(app)
      .put(`/tasks/${id}`)
      .send({ status: "done" });

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("done");
  });

  it("returns 404 for a non-existent task id", async () => {
    const res = await request(app)
      .put("/tasks/999999")
      .send({ status: "done" });

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error");
  });

  it("returns 400 for an invalid status value", async () => {
    const create = await request(app)
      .post("/tasks")
      .send({ title: "Bad status" });
    const id = create.body.id;

    const res = await request(app)
      .put(`/tasks/${id}`)
      .send({ status: "flying" });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error");
  });
});

// ---------------------------------------------------------------------------
// DELETE /tasks/:id
// ---------------------------------------------------------------------------
describe("DELETE /tasks/:id", () => {
  it("deletes an existing task and returns 200", async () => {
    const create = await request(app)
      .post("/tasks")
      .send({ title: "Delete me" });
    const id = create.body.id;

    const res = await request(app).delete(`/tasks/${id}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message");

    const check = await request(app).get("/tasks");
    expect(check.body).to.be.an("array").that.is.empty;
  });

  it("returns 404 for a non-existent task id", async () => {
    const res = await request(app).delete("/tasks/999999");

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error");
  });
});
