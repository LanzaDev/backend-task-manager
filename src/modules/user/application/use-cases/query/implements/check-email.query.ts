import { Email } from "@/shared/domain/value-objects/email.vo";

export class CheckEmailQuery {
  constructor(public readonly email: Email) {}
}
