import { JournalServices } from "src/journal_services/entities/journal_service.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("services", { schema: "gestion_stock" })
export class Services {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "nom", length: 100 })
  nom: string;

  @Column("varchar", { name: "host", length: 255 })
  host: string;

  @Column("varchar", { name: "port", length: 255 })
  port: string;

  @Column("varchar", { name: "protocole", length: 255, default:"tcp" })
  protocole: string;

  @Column("varchar", { name: "cle_API", length: 255, default: null })
  cleApi: string;

  @OneToMany(
    () => JournalServices,
    (journalServices) => journalServices.serviceSource2
  )
  journalServices: JournalServices[];

  @OneToMany(
    () => JournalServices,
    (journalServices) => journalServices.serviceCible2
  )
  journalServices2: JournalServices[];

  @CreateDateColumn({type:'datetime',  name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({type:'datetime', name: 'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({type:'datetime', name: 'delected_at'})
  delectedAt:Date;

  
}
