import { UserRole, UserStatus } from 'src/common/types'
import { NotesEntity } from 'src/modules/notes/notes.entity'

export class UserEntity {
  private _id: number
  private _username: string
  private _password: string
  private _role: UserRole
  private _status: UserStatus
  private _createAt: Date
  private _updatedAt: Date
  private _notes?: NotesEntity[]

  constructor(
    id: number,
    username: string,
    password: string,
    role: UserRole,
    status: UserStatus,
    createdAt: Date,
    updateAt: Date,
    notes?: NotesEntity[],
  ) {
    this._id = id
    this._username = username
    this._password = password
    this._role = role
    this._status = status
    this._createAt = createdAt
    this._updatedAt = updateAt
    this._notes = notes || []
  }

  public get id(): number {
    return this._id
  }

  public get username(): string {
    return this._username
  }

  public get password(): string {
    return this._password
  }

  public get role(): UserRole {
    return this._role
  }

  public get status(): UserStatus {
    return this._status
  }

  public get createdAt(): Date {
    return this._createAt
  }

  public get updatedAt(): Date {
    return this._updatedAt
  }

  public get notes(): NotesEntity[] {
    return this._notes
  }
}
