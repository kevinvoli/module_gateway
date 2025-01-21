import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Roles } from "./roles.entity";


@Index("role_id", ["roleId"], {})
@Entity("permissions", { schema: "gestion_stock" })
export class Permissions {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "role_id", nullable: true })
  roleId: number | null;

  @Column("varchar", { name: "module", nullable: true, length: 50 })
  module: string | null;

  @Column("varchar", { name: "action", nullable: true, length: 50 })
  action: string | null;

  @ManyToOne(() => Roles, (roles) => roles.permissions, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Roles;
}
