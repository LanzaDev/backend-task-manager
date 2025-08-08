// interface TaskSchema {
//   title: string;
//   description?: string;
//   status: TaskStatus;
// }

// export enum TaskStatus {
//   PENDENTE = 'PENDENTE',
//   CANCELADA = 'CANCELADA',
//   CONCLUIDA = 'CONCLUIDA',
// }

// export class Task {
//   private readonly id: string;
//   private readonly props: TaskSchema;
//   constructor(
//     props: TaskSchema,
//     id?: string,
//     public readonly userId: string,
//     public title: string,
//     public description: string | null,
//     public status: TaskStatus = TaskStatus.PENDENTE,
//     public readonly createdAt: Date = new Date(),
//   ) {}

//   updateTitle(newTitle: string) {
//     this.title = newTitle;
//   }

//   updateDescription(newDescription: string | null) {
//     this.description = newDescription;
//   }

//   updateStatus(newStatus: TaskStatus) {
//     this.status = newStatus;
//   }

//   markAsCompleted() {
//     this.status = TaskStatus.CONCLUIDA;
//   }
// }
