export class NotesEntity {
  private _id: number
  private _title: string
  private _content: string
  private _createAt: Date
  private _updatedAt: Date
  private _ownerID: number

  constructor(
    id: number,
    title: string,
    content: string,
    createdAt: Date,
    updateAt: Date,
    ownerID: number,
  ) {
    this._id = id
    this._title = title
    this._content = content
    this._createAt = createdAt
    this._updatedAt = updateAt
    this._ownerID = ownerID
  }

  public get id(): number {
    return this._id
  }

  public get title(): string {
    return this._title
  }

  public get content(): string {
    return this._content
  }

  public get createdAt(): Date {
    return this._createAt
  }

  public get updatedAt(): Date {
    return this._updatedAt
  }

  public get ownerID(): number {
    return this._ownerID
  }
}
