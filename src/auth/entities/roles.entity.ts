import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permissions } from "./permission.entity";


@Entity("roles", { schema: "gestion_stock" })
export class Roles {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "nom", length: 50 })
  nom: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(() => Permissions, (permissions) => permissions.role)
  permissions: Permissions[];

}
