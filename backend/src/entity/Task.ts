import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({
    type: "enum",
    enum: ["todo", "in-progress", "done"],
    default: "todo",
  })
  status!: "todo" | "in-progress" | "done";

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;
}
