import { Router, Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/database";
import { Task } from "../entity/Task";

const router = Router();

const VALID_STATUSES = ["todo", "in-progress", "done"] as const;
type TaskStatus = (typeof VALID_STATUSES)[number];

function getRepo() {
  return AppDataSource.getRepository(Task);
}

// GET /tasks?page=1&limit=10 — paginated, ordered by created_at desc
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt((req.query.limit as string) || "10", 10))
    );
    const skip = (page - 1) * limit;

    const [tasks, total] = await getRepo().findAndCount({
      order: { created_at: "DESC" },
      take: limit,
      skip,
    });

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: tasks,
      total,
      page,
      limit,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (err) {
    next(err);
  }
});

// POST /tasks — create a new task
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body as {
      title?: string;
      description?: string;
    };

    if (!title || title.trim() === "") {
      res.status(400).json({ error: "title is required" });
      return;
    }

    const task = getRepo().create({
      title: title.trim(),
      description: description?.trim() ?? "",
      status: "todo",
    });

    const saved = await getRepo().save(task);
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id — update task status
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body as { status?: string };

    if (!status || !VALID_STATUSES.includes(status as TaskStatus)) {
      res.status(400).json({
        error: `status must be one of: ${VALID_STATUSES.join(", ")}`,
      });
      return;
    }

    const task = await getRepo().findOneBy({ id });
    if (!task) {
      res.status(404).json({ error: `Task with id ${id} not found` });
      return;
    }

    task.status = status as TaskStatus;
    const updated = await getRepo().save(task);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id — delete a task
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const task = await getRepo().findOneBy({ id });

      if (!task) {
        res.status(404).json({ error: `Task with id ${id} not found` });
        return;
      }

      await getRepo().remove(task);
      res.json({ message: `Task ${id} deleted successfully` });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
