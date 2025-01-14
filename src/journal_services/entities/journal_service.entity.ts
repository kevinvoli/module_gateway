import { Services } from "src/discovery/entities/service.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";


@Index("service_source", ["serviceSource"], {})
@Index("service_cible", ["serviceCible"], {})
@Entity("journal_services", { schema: "gestion_stock" })
export class JournalServices {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "service_source", nullable: true })
  serviceSource: number | null;

  @Column("int", { name: "service_cible", nullable: true })
  serviceCible: number | null;

  @Column("datetime", {
    name: "date",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  date: Date | null;

  @Column("varchar", { name: "statut", nullable: true, length: 50 })
  statut: string | null;

  @Column("decimal", {
    name: "temps_reponse",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  tempsReponse: string | null;

  @ManyToOne(() => Services, (services) => services.journalServices, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "service_source", referencedColumnName: "id" }])
  serviceSource2: Services;

  @ManyToOne(() => Services, (services) => services.journalServices2, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "service_cible", referencedColumnName: "id" }])
  serviceCible2: Services;
  @CreateDateColumn({type:'datetime',  name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({type:'datetime', name: 'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({type:'datetime', name: 'delected_at'})
  delectedAt:Date;
}
